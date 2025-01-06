import { Author, Quote } from "../shared/models";
import { randomNumber } from "../shared/utils";

export class AuthorService {

    authorsWithRandomQuotes(authors: Author[]): AuthorWithRandomQuote[] {
        return authors.map(a => {
            let quote: Quote;
            if (a.quotes.length > 1) {
                quote = a.quotes[randomNumber(0, a.quotes.length - 1)];
            } else {
                quote = a.quotes[0];
            }
            return new AuthorWithRandomQuote(a.name, quote);
        })
    }
}

export interface AuthorRepository {

    create(author: Author): void

    search(query: string): Author[]

    ofName(name: string): Author | null

    random(size: number): Author[]
}

export interface QuoteRepository {
    ofId(id: number): Quote | null
}

export class AuthorWithRandomQuote {
    constructor(readonly name: string, readonly quote: Quote) { }
}