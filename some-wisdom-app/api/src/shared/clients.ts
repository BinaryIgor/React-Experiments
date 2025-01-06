import { AuthUser, User, Author, Quote } from "./models";
import  { Response, Request } from "express";

export interface AuthClient {

	createSession(res: Response, user: AuthUser): Promise<string> 

	sessionFromCookie(req: Request): string | null

	authenticate(session: string): Promise<AuthUser | null>

	shouldRefreshSession(session: string): Promise<boolean>

	refreshSession(res: Response, session: string): Promise<void>

	setCurrentUser(req: Request, user: AuthUser | null): void

	currentUser(req: any): AuthUser | null

	currentUserOrThrow(req: Request): AuthUser

	deleteSession(res: Response, session: string): Promise<void>
}

export interface UserClient {

	create(user: User): void

	usersOfIds(ids: number[]): Map<number, User>
}

export interface AuthorClient {

    create(author: Author): void

    quoteOfId(id: number): Quote | null;
}