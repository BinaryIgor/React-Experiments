import fs from "fs";
import path from "path";
import express, { NextFunction, Request, Response } from "express";
import { getConfig } from "./config";
import { AppError, ErrorCode, Errors } from "./shared/errors";
import * as Web from "./shared/web";
import * as AuthModule from "./auth/module";
import * as UserModule from "./user/module";
import * as AuthorsModule from "./authors/module";
import * as QuotesModule from "./quotes/module";
import * as FilesDb from "./files-db";
import cors from "cors";
import bodyParser from "body-parser";

const appConfig = getConfig();

const sessionConfig = appConfig.session;
if (!fs.existsSync(sessionConfig.dir)) {
	fs.mkdirSync(sessionConfig.dir);
}

const quoteNotesDbPath = path.join(appConfig.db.path, "__quote-notes.json");

const authClient = AuthModule.build(sessionConfig);
const userModule = UserModule.build(authClient);
const authorsModule = AuthorsModule.build();
const quotesModule = QuotesModule.build(quoteNotesDbPath, authClient, authorsModule.client, userModule.client);

const dbPath = appConfig.db.path;

console.log("App profile:", appConfig.profile);
console.log(`Loading data from ${dbPath} path...`);

staticFileContentOfPath(path.join(dbPath, "authors.json"))
	.then(db => FilesDb.importAuthors(db, authorsModule.client))
	.catch(e => console.log("Failed to load authors db!", e));

staticFileContentOfPath(path.join(dbPath, "users.json"))
	.then(db => FilesDb.importUsers(db, userModule.client))
	.catch(e => console.log("Failed to load users db!", e));

const app = express();

app.use(bodyParser.json());
// TODO: config
const corsOptions = {
	origin: true,
	credentials: true
};
app.use(cors(corsOptions));

// Weak etags are added by default, we don't want that
// app.set('etag', false);

app.use(Web.asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
	const session = authClient.sessionFromCookie(req);
	const user = session ? await authClient.authenticate(session) : null;

	if (user) {
		authClient.setCurrentUser(req, user);
	}

	if (isPublicRequest(req) || user) {
		if (user && session && await authClient.shouldRefreshSession(session)) {
			await authClient.refreshSession(res, session);
		}
		next();
	} else {
		throw AppError.ofError(Errors.NOT_AUTHENTICATED);
	}
}));

function isPublicRequest(req: Request): boolean {
	return req.path.startsWith("/user/sign-in") || req.path.startsWith("/user/sign-out") || req.path.startsWith("/user/data");
}

app.use(userModule.router);
app.use(authorsModule.router);
app.use(quotesModule.router);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	console.error("Something went wrong...", error);
	//TODO: refactor!
	let status: number;
	let errors: ErrorCode[]
	if (error instanceof AppError) {
		status = appErrorStatus(error);
		errors = error.errors;
	} else {
		status = 500;
		//TODO: maybe more details
		errors = ["UNKNOWN_ERROR"];
	}
	res.status(status);
	res.send({ errors: errors, message: error.message });
});

function appErrorStatus(error: AppError): number {
	for (let e of error.errors) {
		if (e == Errors.NOT_AUTHENTICATED || e == Errors.INVALID_SESSION || e == Errors.EXPIRED_SESSION) {
			return 401;
		}
		if (e == Errors.INCORRECT_USER_PASSWORD) {
			return 403;
		}
		if (e.includes("NOT_FOUND")) {
			return 404;
		}
	}
	return 400;
}

app.listen(appConfig.server.port, () => {
	console.log(`Server started on ${appConfig.server.port}`);
});

//TODO: graceful shutdown
process.on('SIGTERM', () => {
	console.log("Received SIGTERM signal, exiting...");
	process.exit();
});

process.on('SIGINT', () => {
	console.log("Received SIGINT signal, exiting...");
	process.exit();
});

function staticFileContentOfPath(path: string): Promise<string> {
	return fs.promises.readFile(path, 'utf-8');
}