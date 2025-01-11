import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const enTranslations = {
    navigation: {
        title: "Some Wisdom App",
        profile: "Profile",
        signOut: "Sign Out"
    },
    signIn: "Sign In",
    signInPage: {
        namePlaceholder: "Your name...",
        passwordPlaceholder: "Your password...",
        signInButton: "Sign In"
    },
    homePage: {
        header: "What authors you are looking for?",
        suggestion: "If in doubt, some suggestions:",
        searchPlaceholder: "Search for interesting authors by their name...",
        searchLoader: "Searching...",
        noAuthors: "There are no authors maching your query, try something else!"
    },
    authorPage: {
        quotes: "Quotes"
    },
    quotePage: {
        confirmAddQuoteNoteTitle: "Quote note confirmation",
        confirmAddQuoteNoteContent: "Are you sure that you want to add this note to the quote?",
        notes: "Notes",
        addNote: "Add",
        saveNote: "Save",
        notePlaceholder: "Your note...",
        confirmDeleteQuoteNoteTitle: "Quote note confirmation",
        confirmDeleteQuoteNoteContent: "Are you sure that you want to delete this note from the quote?",
        cancel: "Cancel",
        ok: "Ok",
        on: "on"
    },
    userProfilePage: {
        header: "User Profile",
        name: "Name",
        description: "Description"
    },
    errorsModal: {
        header: "Something went wrong..."
    },
    errors: {
        INVALID_USER_NAME: "Name should have 3 - 30 characters",
        INVALID_USER_PASSWORD: "Password should have 8 - 50 characters",
        USER_DOES_NOT_EXIST: "Given user doesn't exist",
        INCORRECT_USER_PASSWORD: "Incorrect password",
        INVALID_QUOTE_NOTE_CONTENT: "Note can't be empty and needs to have 3 - 1000 characters",
        INVALID_QUOTE_NOTE_AUTHOR: "Note author can't be empty and needs to have 3 - 50 characters",
        NOT_AUTHENTICATED: "Sign in required",
        UNKNOWN_ERROR: "Unknown error, should never happen",
    },
    global: {
        loading: "Loading..."
    }
};

// TODO
const plTranslations = enTranslations;


i18n.use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslations
            },
            pl: {
                translation: plTranslations
            }
        },
        lng: "en",
        // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;