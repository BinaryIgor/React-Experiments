import { useLocation } from "react-router";
import { useEffect, useContext, createContext, useState } from "react";
import { api } from "./api";
import { Events } from "./events";
import { CurrentUser, useUser } from "./UserContext";
import { eventBus } from "./event-bus";

export const PUBLIC_ROUTES = ["/sign-in"];

const RouteContext = createContext({ from: "", current: "" });

export default function RoutesGuard(props: any) {
	const location = useLocation();
	const { user, setUser } = useUser();
	const [route, setRoute] = useState({ from: "", current: "" });

	useEffect(() => {
    console.log("Location, Route guard:", location);
		if (!user.data) {
			getCurrentUser(setUser);
		}
		setRoute({ from: route.current, current: location.pathname });
	}, [location]);

	useEffect(() => {
		const userSignedInSubscriber = eventBus.subscribe(Events.USER_SIGNED_IN, () => {
			// useEffect [location] follows immediately
			setUser(CurrentUser.loading());
		});
		const userSignedOutSubscriber = eventBus.subscribe(Events.USER_SIGNED_OUT, () => {
			setUser(CurrentUser.loaded(null));
		});
		return () => {
			eventBus.unsubscribe(userSignedInSubscriber);
			eventBus.unsubscribe(userSignedOutSubscriber);
		};
	}, []);

	// TODO: rather no longer needed!
	return <RouteContext.Provider value={route}>{props.children}</RouteContext.Provider>;
}

const getCurrentUser = async (setUser: Function) => {
	const response = await api.get("user/data");
	if (response.success) {
		const user = response.data ? response.data : null;
		setUser(CurrentUser.loaded(user));
	} else {
		setUser(CurrentUser.loaded(null));
		Events.showErrorModal(response.errors());
	}
};

export const useRoute = () => useContext(RouteContext);