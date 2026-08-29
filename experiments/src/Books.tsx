import { type Book } from "./books";
import { Styles } from './styles';

export default function Books({ loading, books }: { loading: boolean, books: Book[] }) {
  return (<>
    <p hidden={loading ? false : true}>Loading...</p>
    <div style={{ margin: Styles.baseSpacingUnit(2) }}>
      {books.map(b => <div key={b.id}>"{b.title}" by {b.author}</div>)}
    </div>
  </>);
} 