import { useState, useRef, FormEvent } from "react";
import { useParams } from "react-router";
import { api } from "../shared/api";
import { Events } from "../shared/events";
import { useFetch } from "../shared/hooks";
import CenteredH from "../shared/CenteredH";
import { Quote } from "../shared/models";
import { useTranslation } from "react-i18next";
import * as QuoteNoteValidator from './quote-note-validator';
import { useUser } from "../shared/UserContext";
import ConfirmableModal from "../shared/ConfirmableModal";

const QUOTE_NOTE_DELETE_CONFIRMATION_MODAL_ID = "quote-node-delete-confirmation-modal";

export default function QuotePage() {
  const params = useParams();
  // TODO: validation
  const id = params.id!;
  const [quoteNotes, setQuoteNotes] = useState<QuoteNotes>();
  const { t } = useTranslation();

  const [noteInputHidden, setNoteInputHidden] = useState(true);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const [noteError, setNoteError] = useState("");

  let toDeleteQuoteNoteId = -1;

  useFetch(() => fetchQuoteNotes(id, setQuoteNotes));

  const validateNote = () => {
    if (QuoteNoteValidator.isValid(noteInput.current?.value)) {
      setNoteError("");
    } else {
      setNoteError(t('errors.INVALID_QUOTE_NOTE_CONTENT'));
    }
  };

  if (!quoteNotes) {
    return null;
  }

  const noteFormEnabled = noteInput.current?.value && !noteError;

  const addNote = async (e: FormEvent) => {
    e.preventDefault();
    const response = await api.post(`quotes/${id}/notes`, { note: noteInput.current!.value });
    Events.showErrorModalOrRun(response, () => {
      noteInput.current!.value = "";
      fetchQuoteNotes(id, setQuoteNotes);
    });
  };

  const deleteNote = async () => {
    const response = await api.delete(`quotes/${id}/notes/${toDeleteQuoteNoteId}`);
    Events.showErrorModalOrRun(response, () => {
      fetchQuoteNotes(id, setQuoteNotes);
    });
  };

  return (
    <CenteredH>
      <ConfirmableModal
        modalId={QUOTE_NOTE_DELETE_CONFIRMATION_MODAL_ID}
        title={t('quotePage.confirmDeleteQuoteNoteTitle')}
        content={t('quotePage.confirmDeleteQuoteNoteContent')}
        left={t('quotePage.cancel')}
        right={t('quotePage.ok')}
        onRight={deleteNote}>
      </ConfirmableModal>
      <div className="py-16 px-8 w-full bg-indigo-900 italic shadow-md rounded-b-xl shadow-indigo-900">
        <p className="text-2xl">"{quoteNotes.quote.content}"</p>
        <p className="text-xl font-bold text-right text-zinc-300 mt-8">{quoteNotes.quote.author}</p>
      </div>
      <div className="py-4 px-4 lg:px-0">
        <div className="flex justify-between my-4">
          <p className="text-xl mt-4 mb-4">{t('quotePage.notes')} ({quoteNotes.notes.length})</p>
          <button className="button-like px-12"
            onClick={() => setNoteInputHidden(!noteInputHidden)}>{t('quotePage.addNote')}</button>
        </div>
        {!noteInputHidden && (
          <form className="py-4" onSubmit={addNote}>
            <textarea placeholder={t('quotePage.notePlaceholder')} className="h-24 w-full resize-none input-like"
              ref={noteInput} onChange={validateNote}>
            </textarea>
            <p className={`error-message mb-4 ${noteError ? "active" : "inactive"}`}>{noteError}</p>
            <div className="flex justify-end">
              <input className={`button-like py-4 px-12${noteFormEnabled ? "" : " disabled"}`} type="submit" value={t('quotePage.addNote')}
                disabled={noteFormEnabled ? false : true}></input>
            </div>
          </form>
        )}
        {quoteNotes &&
          <div className="mt-12 space-y-4">
            {<QuoteNotes
              quoteId={id}
              quoteNotes={quoteNotes.notes}
              setToDeleteQuoteNoteId={(noteId: number) => toDeleteQuoteNoteId = noteId}
              refreshQuoteNotes={() => fetchQuoteNotes(id, setQuoteNotes)}></QuoteNotes>}
          </div>}
      </div>
    </CenteredH>);
}

interface QuoteNote {
  noteId: number
  note: string
  noteAuthorId: number
  noteAuthor: string
  timestamp: string
}

interface QuoteNotes {
  quote: Quote
  notes: QuoteNote[]
}

async function fetchQuoteNotes(id: string, setQuoteNotes: Function) {
  const response = await api.get(`quotes/${id}`);
  Events.showErrorModalOrRun(response, () => {
    console.log("Quotes response...", response);
    setQuoteNotes(response.data as QuoteNotes);
  });
}

function QuoteNotes({ quoteId, quoteNotes, setToDeleteQuoteNoteId, refreshQuoteNotes }:
  { quoteId: string, quoteNotes: QuoteNote[], setToDeleteQuoteNoteId: Function, refreshQuoteNotes: Function }) {
  const { user } = useUser();
  return (<>
    {quoteNotes.map(q => <QuoteNote key={q.noteId}
      quoteId={quoteId}
      quoteNote={q}
      currentUserId={user.data!.id}
      setToDeleteQuoteNoteId={setToDeleteQuoteNoteId}
      refreshQuoteNotes={refreshQuoteNotes}></QuoteNote>)}
  </>);
}

function QuoteNote({ quoteId, quoteNote, currentUserId, setToDeleteQuoteNoteId, refreshQuoteNotes }:
  {
    quoteId: string, quoteNote: QuoteNote, currentUserId: number,
    setToDeleteQuoteNoteId: Function,
    refreshQuoteNotes: Function
  }) {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const [noteError, setNoteError] = useState("");

  let editDeleteNote;
  if (quoteNote.noteAuthorId == currentUserId) {
    editDeleteNote = <div className="text-4xl absolute top-0 right-0 cursor-pointer p-2">
      <span className="p-2 hover:text-zinc-400" onClick={() => {
        console.log("About to edit note...");
        setEditMode(prev => !prev);
      }}>
        &#9998;
      </span>
      <span className="p-2 hover:text-zinc-400"
        onClick={() => {
          setToDeleteQuoteNoteId(quoteNote.noteId);
          Events.showConfirmableModal(QUOTE_NOTE_DELETE_CONFIRMATION_MODAL_ID);
        }}>
        &times;
      </span>
    </div>;
  } else {
    editDeleteNote = null;
  }

  const editNote = async (e: FormEvent) => {
    e.preventDefault();
    const response = await api.put(`quotes/${quoteId}/notes/${quoteNote.noteId}`, { note: noteInput.current?.value });
    Events.showErrorModalOrRun(response, () => {
      refreshQuoteNotes();
      setEditMode(false);
    });
  };

  const validateNote = () => {
    if (QuoteNoteValidator.isValid(noteInput.current?.value)) {
      console.log("note is valid!");
      setNoteError("");
    } else {
      setNoteError(t('errors.INVALID_QUOTE_NOTE_CONTENT'));
    }
  };

  const editNoteFormEnabled = (noteInput.current == undefined || noteInput.current?.value) && !noteError;

  return (
    <div className="relative rounded-lg shadow p-8 cursor-pointer border-2 border-indigo-900 shadow-indigo-800">
      {!editMode && <p className="italic text-lg whitespace-pre-line">{quoteNote.note}</p>}
      {editMode &&
        <form className="py-4" onSubmit={editNote}>
          <textarea placeholder={t('quotePage.notePlaceholder')}
            ref={noteInput}
            defaultValue={quoteNote.note}
            className="h-24 w-full resize-none input-like"
            onChange={validateNote}>
          </textarea>
          <p className={`error-message mb-4 ${noteError ? "active" : "inactive"}`}>{noteError}</p>
          <div className="flex justify-end">
            <input className={`button-like py-4 px-12${editNoteFormEnabled ? "" : " disabled"}`} type="submit" value={t('quotePage.saveNote')}
              disabled={editNoteFormEnabled ? false : true}></input>
          </div>
        </form>}
      <div className="mt-4 text-right">
        <span className="font-bold">{quoteNote.noteAuthor}</span> {t('quotePage.on')} {quoteNote.timestamp}
        {editDeleteNote}
      </div>
    </div>
  );
}