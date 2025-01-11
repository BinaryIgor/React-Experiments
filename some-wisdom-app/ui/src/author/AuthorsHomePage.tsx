import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';
import { Events } from "../shared/events";
import { api } from "../shared/api";
import { useFetch } from '../shared/hooks';
import ToLeft from '../shared/ToLeft';
import { useNavigate } from 'react-router';
import { ViewsCache } from '../shared/ViewsCache';
import { eventBus } from '../shared/event-bus';

interface PageCache {
  authors: string[],
  inputQuery: string,
  queryResults: AuthorWithRandomQuote[]
}
const pageCache = {
  authors: [],
  inputQuery: "",
  queryResults: []
} as PageCache;

ViewsCache.set("homePage", pageCache);

eventBus.subscribe(Events.HOME_PAGE_CLICKED, () => {
  pageCache.authors = [];
  pageCache.inputQuery = "";
  pageCache.queryResults = [];
});

export default function AuthorsHomePage() {
  const { t } = useTranslation();
  const [authors, setAuthors] = useState<string[]>(pageCache.authors);
  const [searching, setSearching] = useState(false);

  const [hasSearched, setHasSearched] = useState(pageCache.queryResults.length > 0);
  const [searchResults, setSearchResults] = useState<AuthorWithRandomQuote[]>(pageCache.queryResults);
  const searchInput = useRef<HTMLInputElement>(null);

  useFetch(() => fetchAuthors(setAuthors));

  let searchAuthorsTimer: number = -1;
  const onSearchInputKeyDown = () => {
    clearTimeout(searchAuthorsTimer);
  };

  const onSearchInputKeyUp = () => {
    clearTimeout(searchAuthorsTimer);
    searchAuthorsTimer = setTimeout(searchAuthors, 500);
  };

  const searchAuthors = () => {
    if (searching) {
      return;
    }
    setSearchResults([]);
    setHasSearched(true);
    setSearching(true);
    const input = searchInput?.current?.value ?? "";
    pageCache.inputQuery = input;
    console.log("Fetch authors..." + input);
    doSearchAuthors(input, setSearching, setSearchResults);
  };

  return (
    <ToLeft>
      <h1 className="text-xl m-2">{t('homePage.header')}</h1>
      <div className="m-4">
        {t('homePage.suggestion')}
        <ul className='m-2 list-disc'>
          {authors.map((a, i) => <li key={i} className='ml-4 font-medium'>{a}</li>)}
        </ul>
      </div>

      <div className="w-full p-4">
        <div className="relative">
          <input className="input-like w-full" placeholder={t('homePage.searchPlaceholder')}
            ref={searchInput} onKeyUp={onSearchInputKeyUp} onKeyDown={onSearchInputKeyDown}
            defaultValue={pageCache.inputQuery}></input>
          <div onClick={searchAuthors} className='text-2xl absolute top-2 right-2 cursor-pointer'>&#8635;</div>
        </div>
        {searching && <div className='text-xl m-2 italic'>{t('homePage.searchLoader')}</div>}
        {hasSearched && <SearchResults searchResults={searchResults} searching={searching} noResultsMessage={t('homePage.noAuthors')}></SearchResults>}
      </div>
    </ToLeft>);
}

const AUTHOR_QUOTE_PREVIEW_MAX_LENGTH = 300;
function SearchResults({ searchResults, searching, noResultsMessage }:
  { searchResults: AuthorWithRandomQuote[], searching: boolean, noResultsMessage: string }) {

  if (searchResults.length == 0 && !searching) {
    return (<div className="m-2 text-lg italic">{noResultsMessage}</div>);
  }

  const navigate = useNavigate();
  return (<div className="mt-2">
    <div className='space-y-4'>
      {searchResults.map(r => {
        let quotePreview = r.quote.content;
        if (quotePreview.length > AUTHOR_QUOTE_PREVIEW_MAX_LENGTH) {
          quotePreview = `${quotePreview.substring(0, AUTHOR_QUOTE_PREVIEW_MAX_LENGTH)}...`;
        }
        return <div key={r.name} className="rounded-lg shadow-md p-4 cursor-pointer border-2 border-indigo-800 shadow-indigo-800"
          onClick={() => navigate(`authors/${r.name}`, { state: { clearScroll: true } })}>
          <div className="text-xl">{r.name}</div>
          <div className="text-zinc-300 italic mt-2">{quotePreview}</div>
        </div>
      })}
    </div>
  </div>);
}

interface Quote {
  id: number;
  author: string;
  content: string;
}

interface AuthorWithRandomQuote {
  name: string;
  quote: Quote;
}

async function fetchAuthors(setAuthors: Function) {
  if (pageCache.authors.length > 0) {
    return;
  }
  const response = await api.get("authors-random");
  Events.showErrorModalOrRun(response, () => {
    const authors = response.data as { name: string }[];
    const authorNames = authors.map(a => a.name);
    setAuthors(authorNames);
    pageCache.authors = authorNames;
  });
}

async function doSearchAuthors(query: string, setSearching: Function, setResults: Function) {
  const response = await api.get("search-authors?" + new URLSearchParams({ query: query }));
  setSearching(false);
  Events.showErrorModalOrRun(response, () => {
    const results = response.data as AuthorWithRandomQuote[];
    setResults(results);
    pageCache.queryResults = results;
  });
}