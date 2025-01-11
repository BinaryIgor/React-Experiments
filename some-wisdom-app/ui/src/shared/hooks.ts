import { useEffect } from "react";
import { useNavigationType as navigationTypeReact } from "react-router";

export function useFetch(fetch: Function, deps: any[] = []) {
	useEffect(() => {
		fetch();
	}, deps);
}

export function useNavigationType() {
	const navigationType = navigationTypeReact();
	return {
		pop: navigationType == "POP",
		push: navigationType == "PUSH",
		replace: navigationType == "REPLACE"
	};
}