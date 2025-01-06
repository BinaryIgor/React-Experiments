export class AuthUser {
	constructor(readonly id: number, readonly name: string) { }
}

export class User {
	constructor(readonly id: number,
		readonly name: string,
		readonly password: string) { }
}

export class Author {
    constructor(readonly name: string,
        readonly note: string,
        readonly quotes: Quote[]) { }
}

export class Quote {
    constructor(readonly id: number, readonly author: string, readonly content: string) { }
}