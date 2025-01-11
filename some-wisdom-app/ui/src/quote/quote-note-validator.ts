import * as Validator from '../shared/validator';

const MIN_NOTE_LENGTH = 3;
const MAX_NOTE_LENGTH = 1000;

export function isValid(note: string | null | undefined): boolean {
  return Validator.hasAnyContent(note) && Validator.hasLength(note, MIN_NOTE_LENGTH, MAX_NOTE_LENGTH);
}