import { Errors } from "./errors";
import { Result } from "./result";

export interface Book {
  id: string;
  title: string;
  author: string;
}

export interface BooksClient {
  addBook(title: string, author: string): Promise<Result<void>>;
  getBooks(): Promise<Result<Book[]>>;
}

const BOOKS_KEY = "experiments-app-books";

class SessionStorageBooksClient implements BooksClient {

  // TODO: validate whether doesn't exist already
  addBook(title: string, author: string): Promise<Result<void>> {
    const newBook = { id: crypto.randomUUID(), title, author };

    const books = this.booksFromStorage();
    
    const existingBook = books.find(b => b.title == title && b.author == author);
    if (existingBook) {
      return Promise.resolve(Result.failure(Errors.DUPLICATED_BOOK));
    }

    books.push(newBook);

    sessionStorage.setItem(BOOKS_KEY, JSON.stringify(books));

    return Promise.resolve(Result.success());
  }

  private booksFromStorage(): Book[] {
    const rawBooks = sessionStorage.getItem(BOOKS_KEY);
    return rawBooks ? JSON.parse(rawBooks) as Book[] : []
  }

  // artifical delay on purpose
  getBooks(): Promise<Result<Book[]>> {
    const books = this.booksFromStorage();
    return new Promise(resolve => {
      setTimeout(() => resolve(Result.success(books)), 1000);
    });
  }
}

export const booksClient: BooksClient = new SessionStorageBooksClient();