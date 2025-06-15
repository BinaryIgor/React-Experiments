import { render, screen } from '../../shared/__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import SignIn from '../SignIn';
// https://github.com/mswjs/msw
import { MemoryRouter, Route, Routes } from 'react-router';

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const SIGN_IN_BUTTON_TEXT = "Sign In";
const NAME_INPUT_ERROR_TEXT = "Name should have 3 - 30 characters";
const PASSWORD_INPUT_ERROR_TEXT = "Password should have 8 - 50 characters";

describe('SignIn', () => {
    it('renders page with disabled sign in', () => {
        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>);

        expect(screen.getByText("Let's get some wisdom")).toBeInTheDocument();
        expect(screen.getByText(SIGN_IN_BUTTON_TEXT)).toBeDisabled();
    });

    it('validates name and password inputs', async () => {
        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <SignIn />
            </MemoryRouter>);


        expect(screen.queryByText(NAME_INPUT_ERROR_TEXT)).not.toBeInTheDocument();
        expect(screen.queryByText(PASSWORD_INPUT_ERROR_TEXT)).not.toBeInTheDocument();

        const nameInput = screen.getByPlaceholderText("Your name...");
        const passwordInput = screen.getByPlaceholderText("Your password...");

        await user.click(nameInput);
        await user.keyboard("N");

        expect(screen.getByText(NAME_INPUT_ERROR_TEXT)).toBeInTheDocument();

        await user.click(passwordInput);
        await user.keyboard("P");

        expect(screen.getByText(PASSWORD_INPUT_ERROR_TEXT)).toBeInTheDocument();

        expect(screen.getByText(SIGN_IN_BUTTON_TEXT)).toBeDisabled();
    });

    it('signs in', async () => {
        const server = setupServer(
            http.post('/user/sign-in', () => {
                return HttpResponse.json();
            })
        );

        const user = userEvent.setup();

        render(
            <MemoryRouter>
                <Routes>
                    <Route path="/sign-in" element={<SignIn />}></Route>
                </Routes>
            </MemoryRouter>);

        const nameInput = screen.getByPlaceholderText("Your name...");
        const passwordInput = screen.getByPlaceholderText("Your password...");

        await user.click(nameInput);
        await user.keyboard("SomeName");

        await user.click(passwordInput);
        await user.keyboard("SomePassword");

        const signInButton = screen.getByText(SIGN_IN_BUTTON_TEXT);

        console.info(window.location.href);

        await user.click(signInButton);

        console.info(window.location.href);
    });


});