import ToLeft from "../shared/ToLeft";
import { useState } from "react";
import { useFetch, useNavigationType } from "../shared/hooks";
import { api } from "../shared/api";
import { Events } from "../shared/events";
import { useParams, useNavigate } from "react-router";
import { Quote } from "../shared/models";

let lastAuthorName = "";
let lastScroll = 0;

export default function AuthorPage() {
  const params = useParams();
  // TODO: validation
  const name = params.name as string;
  const [author, setAuthor] = useState<Author>();
  const navigate = useNavigate();
  const navigationType = useNavigationType();

  if (lastAuthorName != name || !navigationType.pop) {
    lastScroll = 0;
  }
  lastAuthorName = name;

  useFetch(() => getAuthor(name, setAuthor));

  if (!author) {
    return null;
  }

  return (
    <ToLeft>
      <div className="p-4">
        <h1 className="text-2xl">{author.name}</h1>
        <div className="p-4 my-4 rounded-md shadow-md shadow-indigo-800 w-full 
					bg-indigo-900 text-zinc-300 whitespace-pre-line">{author.note}</div>
        <h2 className="text-xl mt-8 mb-4">Quotes ({author.quotes.length})</h2>
        <div className="space-y-4">
          {author.quotes.map(q =>
            <div key={q.id} className="rounded-lg shadow p-8 cursor-pointer border-2 
						border-indigo-900 shadow-indigo-800 italic text-lg"
              onClick={() => {
                lastScroll = document.documentElement.scrollTop;
                navigate(`/quotes/${q.id}`);
              }}>"{q.content}"
            </div>)}
        </div>
      </div>
    </ToLeft>
  );
}

interface Author {
  name: string;
  note: string;
  quotes: Quote[];
}

async function getAuthor(name: string, setAuthor: Function) {
  const response = await api.get(`authors/${name}`);
  Events.showErrorModalOrRun(response, () => {
    setAuthor(response.data as Author);
    if (lastScroll > 0) {
      window.scrollTo({ left: 0, top: lastScroll });
    }
  });
}