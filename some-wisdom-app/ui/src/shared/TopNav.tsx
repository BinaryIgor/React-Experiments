import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useTranslation } from 'react-i18next';
import { Events } from "./events";
import { api } from "./api";
import { useUser } from "./UserContext";
import { PUBLIC_ROUTES } from "./RoutesGuard";

export default function TopNav() {
  const [hidden, setHidden] = useState(true);
  const { user } = useUser();
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
    const hide = PUBLIC_ROUTES.find(l => location.pathname.includes(l)) != null;
    setHidden(hide);
  }, [location]);

  const onHomePageClick = () => {
    Events.homePageClicked();
    const replace = location.pathname == "/";
    navigate("/", { replace });
  };

  const signOut = async () => {
    const response = await api.post("user/sign-out");
    Events.showErroModalIfFailure(response);
    Events.userSignedOut();
    setHidden(true);
    navigate("/sign-in", { replace: true });
  };

  return !hidden && (
    <div className="z-10 sticky flex justify-between top-0 w-full py-4 px-2 border-b-4
		border-indigo-800 bg-indigo-950 text-zinc-400">
      <div className="text-2xl cursor-pointer" onClick={onHomePageClick}>{t('navigation.title')}</div>
      <div className="cursor-pointer text-xl text-right relative w-fit"
        onClick={(e) => {
          e.stopPropagation();
          dropDownOptions.current!.classList.toggle('hidden');
        }}>
        <div>{user.data?.name}</div>
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