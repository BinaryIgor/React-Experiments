import { Router, Request, Response } from "express";
import { InMemoryUserRepository } from "./repository";
import { Base64PasswordHasher } from "./password-hasher";
import { UserService, UserProfile } from "./domain";
import * as Web from "../shared/web";
import { UserClient } from "../shared/clients";
import { AuthClient } from "../shared/clients";
import { User } from "../shared/models";

// TODO
const USER_PROFILE_ENDPOINT = "/user/profile";
const SIGN_IN_ENDPOINT = "/user/sign-in";
const SIGN_OUT_ENDPOINT = "/user/sign-out";
const USER_DATA_ENDPOINT = "/user/data";

export function build(authClient: AuthClient): UserModule {

	const userRepository = new InMemoryUserRepository();

	const passwordHasher = new Base64PasswordHasher();
	const userService = new UserService(userRepository, passwordHasher);

	const router = Router();

	router.post(SIGN_IN_ENDPOINT, Web.asyncHandler(async (req: Request, res: Response) => {
		const input = Web.requireBody(req.body as UserSignInInput);
		const user = userService.signIn(input.name, input.password);

		await authClient.createSession(res, user);

		res.status(200);
		res.send(user);
	}));

	router.post(SIGN_OUT_ENDPOINT, Web.asyncHandler(async (req: Request, res: Response) => {
		const session = authClient.sessionFromCookie(req);
		if (session) {
			await authClient.deleteSession(res, session);
		}
		res.status(200);
		res.send();
	}));

	router.get(USER_DATA_ENDPOINT, (req: Request, res: Response) => {
		const user = authClient.currentUser(req);
		if (user) {
			res.send(user);
		} else {
			res.status(204);
			res.send();
		}
	});

	router.get(USER_PROFILE_ENDPOINT, (req: Request, res: Response) => {
		const user = authClient.currentUserOrThrow(req);
		// TODO: real desc
		res.send(new UserProfile(user.id, user.name, "some description"));
	});

	return new UserModule(router, SIGN_IN_ENDPOINT, {
		create(user: User): void {
			userRepository.create(user);
		},
		usersOfIds(ids: number[]): Map<number, User> {
			return userRepository.ofIds(ids);
		}
	});
}

class UserSignInInput {
	constructor(readonly name: string, readonly password: string) { }
}

export class UserModule {
	constructor(readonly router: Router,
		readonly signInEndpoint: string,
		readonly client: UserClient) { }
}