import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useTranslation } from 'react-i18next';
import { Events } from "./events";
import { api } from "./api";

const HIDE_TOP_NAV_LOCATIONS = ["/sign-in"];

export default function TopNav() {
	const [hidden, setHidden] = useState(true);
	// TODO: change after user successful sign in (or global store)!
	const [currentUser, setCurrentUser] = useState("");
	const { t } = useTranslation();
	const dropDownOptions = useRef<HTMLUListElement>(null);
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const hideDropDownListener = () => {
			dropDownOptions.current?.classList.add("hidden");
		};
		document.addEventListener("click", hideDropDownListener);
		return () => {
			document.removeEventListener("click", hideDropDownListener);
		};
	}, []);

	useEffect(() => {
		const path = location.pathname;
		const hide = HIDE_TOP_NAV_LOCATIONS.find(l => path.includes(l)) != null;
		if (hide == hidden) {
			return
		}
		if (hide) {
			setHidden(true);
		} else {
			setHidden(false);
			getCurrentUser(setCurrentUser);
		}
	}, [location]);


	const signOut = async () => {
		const response = await api.post("user/sign-out");
		Events.showErroModalIfFailure(response);
		setHidden(true);
		setCurrentUser("");
		navigate("/sign-in", { replace: true });
	};

	return !hidden && (
		<div className="z-10 sticky flex justify-between top-0 w-full py-4 px-2 border-b-4
		border-indigo-800 bg-indigo-950 text-zinc-400">
			<div className="text-2xl cursor-pointer">
				<Link to="/">{t('navigation.title')}</Link>
			</div>
			<div className="cursor-pointer text-xl text-right relative w-fit"
				onClick={(e) => {
					e.stopPropagation();
					dropDownOptions.current!.classList.toggle('hidden');
				}}>
				<div>{currentUser}</div>
				<ul className="hidden whitespace-nowrap absolute top-8 right-0 rounded-md shadow-md bg-indigo-800 border-indigo-800"
					ref={dropDownOptions}>
					<li className="hover:bg-indigo-950 hover:text-zinc-200 py-2 px-4">
						<Link to="/user-profile">{t('navigation.profile')}</Link>
					</li>
					<li className="hover:bg-indigo-950 hover:text-zinc-200 py-2 px-4"
						onClick={signOut}>
						{t('navigation.signOut')}
					</li>
				</ul>
			</div>
		</div>
	);
}

// TODO: maybe some global user store
const getCurrentUser = async (setCurrentUser: Function) => {
	const response = await api.get("user/data");
	Events.showErrorModalOrRun(response, () => {
		const user = response.data as { name: string };
		setCurrentUser(user.name);
	});
};