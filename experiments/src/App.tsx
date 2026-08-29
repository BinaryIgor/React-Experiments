import { useEffect, useState, useRef, type SubmitEvent, lazy } from 'react'
import { Styles } from './styles'
import { booksClient, type Book } from './books.ts'
import { Errors } from './errors.ts';

const authorAndTitleRegex = /^[\p{L}\p{N}](?: ?[\p{L}\p{N}]){2,}$/u;

// experiments with splitting
const Books = lazy(() => import('./Books.tsx'));

export default function App() {
  const formRef = useRef<HTMLFormElement>(null);
  const [authorError, setAuthorError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [genericError, setGenericError] = useState("");
  const [loadingBooks, setLoadingBooks] = useState(true);

  const [books, setBooks] = useState<{ id: string, author: string, title: string }[]>([]);

  useEffect(() => {
    fetchBooks(setBooks, setLoadingBooks, setGenericError);
  }, []);

  const addBook = async (e: SubmitEvent) => {
    e.preventDefault();

    setGenericError("");

    const form = new FormData(e.target);
    // validateAuthor();
    console.log("Adding book; form: ", form);
    // console.log(`Author: ${author}, title: ${title}`);
    const author = form.get('author') as string;
    const title = form.get("title") as string;

    validateAuthor(author);
    validateTitle(title);

    if (!isAuthorValid(author) || !isTitleValid(title)) {
      console.log("Ignoring invalid book!");
      return;
    }

    console.log("Valid book to be added!");
    setLoadingBooks(true);
    const result = await booksClient.addBook(title, author);
    if (result.error) {
      const errorMessage = result.error == Errors.DUPLICATED_BOOK ?
        "Book of this author and title exist already" : "Unknown error while adding book";
      setGenericError(errorMessage);
      setLoadingBooks(false);
    } else {
      await fetchBooks(setBooks, setLoadingBooks, setGenericError);
      formRef.current?.reset();
    }
  };

  const validateAuthor = (authorInput: string) => {
    if (isAuthorValid(authorInput)) {
      setAuthorError("");
    } else {
      setAuthorError("Valid author is required");
    }
  };

  const isAuthorValid = (author: string) => author && author.length > 2 && authorAndTitleRegex.test(author);

  const validateTitle = (titleInput: string) => {
    if (isTitleValid(titleInput)) {
      setTitleError("");
    } else {
      setTitleError("Valid title is required");
    }
  };

  const isTitleValid = (title: string) => title && authorAndTitleRegex.test(title);

  const errorStyle = {
    margin: `${Styles.baseSpacingUnit(0.5)} ${Styles.baseSpacingUnit()} ${Styles.baseSpacingUnit(2)} ${Styles.baseSpacingUnit()}`,
    fontSize: Styles.baseFontUnit(0.75), color: 'red'
  };

  return (
    <>
      <p hidden={genericError ? false : true} style={errorStyle}>{genericError}</p>
      <form onSubmit={addBook} ref={formRef}>
        <input name="author" style={{ margin: Styles.baseSpacingUnit(), display: 'block' }} type="text"
          placeholder="Author" onChange={e => {
            setGenericError("");
            validateAuthor(e.target.value);
          }} />
        <p hidden={authorError ? false : true} style={errorStyle}>{authorError}</p>
        <input name="title" style={{ margin: Styles.baseSpacingUnit(), display: 'block' }} type="text"
          placeholder="Title" onChange={e => {
            setGenericError("");
            validateTitle(e.target.value);
          }} />
        <p hidden={titleError ? false : true} style={errorStyle}>{titleError}</p>
        <button style={{ margin: Styles.baseSpacingUnit(), padding: `${Styles.baseSpacingUnit(1)} ${Styles.baseSpacingUnit(8)}` }}
          type="submit">Add</button>
      </form>
      <Books loading={loadingBooks} books={books}></Books>
    </>
  )
}

async function fetchBooks(setBooks: (books: Book[]) => void,
  setLoadingBooks: (loading: boolean) => void,
  setLoadingBooksError: (error: string) => void) {
  setLoadingBooks(true);
  const result = await booksClient.getBooks();
  setLoadingBooks(false);
  if (result.error) {
    setLoadingBooksError(result.error);
  } else {
    setLoadingBooksError("");
    setBooks(result.data as Book[]);
  }
}