
import { Router, Request, Response } from "express";
import * as Web from "../shared/web";
import { FileQuoteNoteRepository } from "./repository";
import { NewQuoteNote, QuoteNoteService } from "./domain";
import { AuthClient, AuthorClient, UserClient } from "../shared/clients";
import { AppError, Errors } from "../shared/errors";
import * as Mapper from "./mapper";

const QUOTES_ENDPOINT = "/quotes";

export function build(
  quoteNotesDbFilePath: string,
  authClient: AuthClient,
  authorClient: AuthorClient,
  userClient: UserClient
): QuoteModule {
  const quoteNoteRepository = new FileQuoteNoteRepository(quoteNotesDbFilePath);
  const quoteNoteService = new QuoteNoteService(quoteNoteRepository);

  const router = Router()

  router.get(`${QUOTES_ENDPOINT}/:id`,
    Web.asyncHandler(async (req: Request, res: Response) => {
      const quoteId = Web.numberPathParam(req, "id");
      const quote = authorClient.quoteOfId(quoteId);
      if (!quote) {
        throw AppError.ofError(Errors.QUOTE_DOES_NOT_EXIST);
      }

      res.send({
        quote: quote,
        notes: await quoteNoteViews(quoteId)
      });
    }));

  async function quoteNoteViews(quoteId: number): Promise<Mapper.QuoteNoteView[]> {
    const notes = await quoteNoteService.notesOfQuoteSortedByTimestamp(quoteId);
    const authorIds = notes.map(n => n.noteAuthorId);
    const authors = userClient.usersOfIds(authorIds);
    return Mapper.toQuoteNoteViews(notes, authors);
  }

  router.post(`${QUOTES_ENDPOINT}/:id/notes`,
    Web.asyncHandler(async (req: Request, res: Response) => {
      const quoteId = Web.numberPathParam(req, "id");

      const input = req.body as QuoteNoteInput;
      const author = authClient.currentUserOrThrow(req);

      const note = new NewQuoteNote(quoteId, input.note, author.id, Date.now());

      await quoteNoteService.createNote(note);

      res.sendStatus(201);
    }));

  // TODO: maybe without quoteId resource paths?
  router.put(`${QUOTES_ENDPOINT}/:quoteId/notes/:noteId`,
    Web.asyncHandler(async (req: Request, res: Response) => {
      const quoteNoteId = Web.numberPathParam(req, "noteId");

      const input = req.body as QuoteNoteInput;
      const author = authClient.currentUserOrThrow(req);

      await quoteNoteService.editNote(quoteNoteId, input.note, author.id);

      res.sendStatus(200);
    }));

  router.delete(`${QUOTES_ENDPOINT}/:quoteId/notes/:noteId`,
    Web.asyncHandler(async (req: Request, res: Response) => {
      const quoteNoteId = Web.numberPathParam(req, "noteId");

      const author = authClient.currentUserOrThrow(req);

      await quoteNoteService.deleteNote(quoteNoteId, author.id);

      res.sendStatus(200);
    }));

  return new QuoteModule(router);
}

class QuoteNoteInput {
  constructor(readonly note: string) { }
}

export class QuoteModule {
  constructor(readonly router: Router) { }
}