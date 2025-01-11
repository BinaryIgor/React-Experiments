const cache: any = {};

export const ViewsCache = {
	set(key: string, value: any) {
		cache[key] = value;
	},
	get(key: string): any {
		return cache[key];
	}
}