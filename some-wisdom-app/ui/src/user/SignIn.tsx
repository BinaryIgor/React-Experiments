import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import * as UserValidator from './user-validator';
import { api } from "../shared/api";
import { Events } from '../shared/events';

export default function SignIn() {
	const { t } = useTranslation();

	const nameInput = useRef<HTMLInputElement>(null);
	const [nameError, setNameError] = useState("");
	const passwordInput = useRef<HTMLInputElement>(null);
	const [passwordError, setPasswordError] = useState("");
	const navigate = useNavigate();

	const validateName = () => {
		if (UserValidator.isNameValid(nameInput.current?.value)) {
			setNameError("");
		} else {
			setNameError(t('errors.INVALID_USER_NAME'));
		}
	};

	const validatePassword = () => {
		if (UserValidator.isPasswordValid(passwordInput.current?.value)) {
			setPasswordError("");
		} else {
			setPasswordError(t('errors.INVALID_USER_PASSWORD'));
		}
	};

	const signIn = async (e: any) => {
		e.preventDefault();
		console.log("Signing in...");
		const response = await api.post("user/sign-in", {
			name: nameInput.current?.value,
			password: passwordInput.current?.value
		});

		if (response.success) {
			console.log("Success, do sth!");
			navigate("/");
		} else {
			Events.showErrorModal(response.errors());
		}
	};

	const formEnabled = nameInput.current?.value && passwordInput.current?.value && !nameError && !passwordError;

	return (<>
		<h1 className="p-4 text-2xl">Let's get some wisdom</h1>
		<form className="p-4 relative w-fit" onSubmit={signIn}>
			<input type="text" name="name" className="input-like" placeholder={t("signInPage.namePlaceholder")}
				ref={nameInput} onChange={validateName} />
			<p className={`error-message mb-4 ${nameError ? "active" : "inactive"}`}>{nameError}</p>
			<input type="password" name="password" className="input-like" placeholder={t("signInPage.passwordPlaceholder")}
				ref={passwordInput} onChange={validatePassword} />
			<p className={`error-message mb-4 ${passwordError ? "active" : "inactive"}`}>{passwordError}</p>
			<input type="submit" className={`w-full py-4 button-like${formEnabled ? "" : " disabled"}`} value={t("signInPage.signInButton")}
				disabled={formEnabled ? false : true}></input>
		</form>
	</>);
}