import { AuthClient } from "../shared/clients";
import { AuthUser } from "../shared/models";
import { AuthSessions } from "./auth";
import { SessionCookies, setCurrentUser, currentUser, currentUserOrThrow } from "./web";
import { Response, Request } from "express";


export function build(sessionConfig: any): AuthClient {
	const authSessions = new AuthSessions(sessionConfig.dir, sessionConfig.dir, sessionConfig.refreshInterval);
	// TODO: configurable domain
	const sessionCookies = new SessionCookies(sessionConfig.duration, "session-id", false, "localhost");
	return {
		async createSession(res: Response, user: AuthUser): Promise<string> {
			const session = await authSessions.create(user);
			sessionCookies.setCookie(res, session);
			return session;
		},
		sessionFromCookie(req: Request): string | null {
			return sessionCookies.sessionFromCookie(req);
		},
		authenticate(session: string): Promise<AuthUser | null> {
			return authSessions.authenticate(session);
		},
		shouldRefreshSession(session: string): Promise<boolean> {
			return authSessions.shouldRefresh(session);
		},
		async refreshSession(res: Response, session: string): Promise<void> {
			await authSessions.refresh(session);
			sessionCookies.setCookie(res, session);
		},
		setCurrentUser(req: any, user: AuthUser | null): void {
			setCurrentUser(req, user);
		},
		currentUser(req: any): AuthUser | null {
			return currentUser(req);
		},
		async deleteSession(res: Response, session: string): Promise<void> {
			await authSessions.delete(session);
			sessionCookies.setCookie(res, session, true);
		},
		currentUserOrThrow(req: Request): AuthUser {
			return currentUserOrThrow(req);
		}
	};
}