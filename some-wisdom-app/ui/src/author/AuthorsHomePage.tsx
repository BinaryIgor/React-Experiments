import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Events } from "../shared/events";
import { api } from "../shared/api";
import { useFetch } from '../shared/hooks';

export default function AuthorsHomePage() {
	const { t } = useTranslation();
	const [authors, setAuthors] = useState<string[]>([]);

	useFetch(() => fetchAuthors(setAuthors));

	return (
		<div className='lg:pr-60 xl:pr-80 2xl:pr-[30rem]'>
			<h1 className="text-xl m-2">{t('homePage.header')}</h1>
			<div className="m-4">
				{t('homePage.suggestion')}
				<ul className='m-2 list-disc'>
					{authors.map((a, i) => <li key={i} className='ml-4 font-medium'>{a}</li>)}
				</ul>
			</div>
		</div>);
}

async function fetchAuthors(setAuthors: Function) {
	const response = await api.get("authors-random");
	Events.showErrorModalOrRun(response, () => {
		const authors = response.data as { name: string }[];
		const authorNames = authors.map(a => a.name);
		setAuthors(authorNames);
	});
}