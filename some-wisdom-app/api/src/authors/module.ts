import { Router, Request, Response } from "express";
import * as Web from "../shared/web";
import { InMemoryAuthorRepository, InMemoryQuoteRepository } from "./repository";
import { AuthorService } from "./domain";
import { AuthorClient } from "../shared/clients";
import { Author, Quote } from "../shared/models";
import { AppError, Errors } from "../shared/errors";

const SEARCH_AUTHORS_ENDPOINT = "/search-authors";
const AUTHORS_ENDPOINT = "/authors";

export function build(): AuthorModule {
    const quoteRepository = new InMemoryQuoteRepository();
    const authorRepository = new InMemoryAuthorRepository(quoteRepository);

    const authorService = new AuthorService();

    const router = Router();

    router.get(SEARCH_AUTHORS_ENDPOINT, (req: Request, res: Response) => {
        const query = (req.query.query ?? "") as string;

        const foundAuthors = authorRepository.search(query);

        //Slowing it down a little, for demonstration purposes
        const results = authorService.authorsWithRandomQuotes(foundAuthors);
        setTimeout(() => res.send(results), 500);
    });

    router.get(`${AUTHORS_ENDPOINT}/:name`, (req: Request, res: Response) => {
        const name = req.params.name;
        const author = authorRepository.ofName(name);
        if (author) {
            res.send(author);
        } else {
            throw AppError.ofError(Errors.AUTHOR_DOES_NOT_EXIST);
        }
    });

    // function returnHomePage(req: Request, res: Response, withSwappedNavigation: boolean) {
    //     const homePage = AuthorViews.homePage(authorRepository.random(3).map(a => a.name),
    //         SEARCH_AUTHORS_ENDPOINT,
    //         AuthWeb.currentUserName(req),
    //         withSwappedNavigation,
    //         Web.shouldReturnFullPage(req));

    //     Web.returnHtml(res, homePage);
    // }

    router.get("/authors-random", (req: Request, res: Response) => {
        const random = authorRepository.random(3);
        res.send(random);
    });

    return new AuthorModule(router, {
        create(author: Author) {
            authorRepository.create(author);
        },
        quoteOfId(id: number): Quote | null {
            return quoteRepository.ofId(id);
        }
    });
}

export class AuthorModule {
    constructor(readonly router: Router, readonly client: AuthorClient) { }
}