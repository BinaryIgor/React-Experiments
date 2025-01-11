import  { NextFunction, Request, Response } from "express";
import { AppError } from "./errors";

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
}

export function cookieValue(req: Request, cookie: string): string | null {
    const cookiesHeader = req.headers.cookie;
    if (!cookiesHeader) {
        return null;
    }
    const cookies = cookiesHeader.split(';');
    for (let c of cookies) {
        const kv = c.split("=", 2);
        if (kv.length != 2) {
            continue;
        }
        const k = kv[0].trim();
        const v = kv[1].trim();
        if (k == cookie) {
            return v;
        }
    }

    return null;
}

export function numberPathParam(req: Request, param: string): number {
    return parseInt(req.params[param]);
}

export function fileNameFromPath(req: Request): string {
    return req.url.substring(req.url.lastIndexOf("/"));
}

export function requireBody<T>(body: T | null): T {
    if (body) {
        return body;
    }
    // TODO
    throw AppError.ofError("BODY_REQUIRED");
}