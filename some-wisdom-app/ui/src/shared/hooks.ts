import { useEffect } from "react";

export function useFetch(fetch: Function, deps: any[] = []) {
	useEffect(() => {
		fetch();
	}, deps);
}