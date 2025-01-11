import { createContext, useContext, useState } from 'react';

type CurrentUserData = { id: number, name: string } | null;

export class CurrentUser {
	constructor(readonly loading: boolean, readonly data: CurrentUserData) { }

	static loading(): CurrentUser {
		return new CurrentUser(true, null);
	}

	static loaded(data: CurrentUserData) {
		return new CurrentUser(false, data);
	}
}

const UserContext = createContext<{ user: CurrentUser, setUser: any }>({ user: CurrentUser.loading(), setUser: null });

export function UserProvider(props: any) {
	const [user, setUser] = useState<CurrentUser>(CurrentUser.loading());
	return (
		<UserContext.Provider value={{ user, setUser }}>
			{props.children}
		</UserContext.Provider>
	);
}

export const useUser = () => useContext(UserContext);