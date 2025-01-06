import * as Validator from '../shared/validator';

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 50;

export function isNameValid(name: string | null | undefined): boolean {
	return Validator.hasAnyContent(name) && Validator.hasLength(name, MIN_NAME_LENGTH, MAX_NAME_LENGTH);
}

export function isPasswordValid(password: string | null | undefined): boolean {
	return Validator.hasAnyContent(password) && Validator.hasLength(password, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH);
}