import { Router, Request, Response } from "express";
import * as Web from "../shared/web";
import { InMemoryAuthorRepository, InMemoryQuoteRepository } from "./repository";
import { AuthorService } from "./domain";
import * as AuthWeb from "../auth/web";
import { AuthorClient } from "../shared/clients";
import { Author, Quote } from "../shared/models";

const SEARCH_AUTHORS_ENDPOINT = "/search-authors";
const AUTHORS_ENDPOINT = "/authors";

export function build(): AuthorModule {
    const quoteRepository = new InMemoryQuoteRepository();
    const authorRepository = new InMemoryAuthorRepository(quoteRepository);

    const authorService = new AuthorService();

    const router = Router();

    // router.post(SEARCH_AUTHORS_ENDPOINT, (req: Request, res: Response) => {
    //     const query = req.body[Views.AUTHORS_SEARCH_INPUT];

    //     const foundAuthors = authorRepository.search(query);

    //     //Slowing it down a little, for demonstration purposes
    //     setTimeout(() => Web.returnHtml(res,
    //         AuthorViews.authorsSearchResult(authorService.authorsWithRandomQuotes(foundAuthors),
    //             (aName: string) => `${AUTHORS_ENDPOINT}/${aName}`)),
    //         1000);
    // });

    // router.get(`${AUTHORS_ENDPOINT}/:name`, (req: Request, res: Response) => {
    //     const name = req.params.name;

    //     const author = authorRepository.ofName(name);
    //     if (author) {
    //         Web.returnHtml(res, AuthorViews.authorPage(author, quoteEndpoint,
    //             Web.shouldReturnFullPage(req), AuthWeb.currentUserName(req)));
    //     } else {
    //         Web.returnNotFound(res);
    //     }
    // });

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