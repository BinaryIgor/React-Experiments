import { User } from "../shared/models";
import { QuoteNote } from "./domain";

export function toQuoteNoteViews(quoteNotes: QuoteNote[], authors: Map<number, User>): QuoteNoteView[] {
    return quoteNotes.map(q => {
        const author = authors.get(q.noteAuthorId)?.name ?? "Anonymous";
        //TODO: prettier date format!
        const timestamp = new Date(q.timestamp);
        return new QuoteNoteView(q.noteId, q.quoteId, q.note, q.noteAuthorId, author, formattedDateTime(timestamp));
    });
}

// TODO: shouldn't be on the frontend?
function formattedDateTime(date: Date): string {
    let displayedHour: string | number = date.getHours();
    displayedHour = displayedHour < 10 ? '0' + displayedHour : displayedHour;
    let displayedMinute: string | number = date.getMinutes();
    displayedMinute = displayedMinute < 10 ? '0' + displayedMinute : displayedMinute;
    let displayedDay: string | number = date.getDate();
    displayedDay = displayedDay < 10 ? '0' + displayedDay : displayedDay;
    let displayedMonth: string | number = date.getMonth() + 1;
    displayedMonth = displayedMonth < 10 ? '0' + displayedMonth : displayedMonth;

    return `${displayedDay}.${displayedMonth}.${date.getFullYear()}, ${displayedHour}:${displayedMinute}`;
}

export class QuoteNoteView {
    constructor(
        readonly noteId: number,
        readonly quoteId: number,
        readonly note: string,
        readonly noteAuthorId: number,
        readonly noteAuthor: string,
        readonly timestamp: string) { }
}