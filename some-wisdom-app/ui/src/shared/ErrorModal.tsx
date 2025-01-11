import { useEffect, useState } from "react";
import { eventBus } from "./event-bus";
import { Events } from "./events";
import { useTranslation } from 'react-i18next';

export default function ErrorModal() {
	const [errors, setErrors] = useState<string[]>([]);
	const [hidden, setHidden] = useState(true);
	const { t } = useTranslation();

	useEffect(() => {
		const subscriber = eventBus.subscribe(Events.SHOW_ERROR_MODAL, data => {
			const receivedErrors = (data as string[]).map(ec => t(`errors.${ec}`));
			setErrors(receivedErrors);
			setHidden(false);
		});
		return () => eventBus.unsubscribe(subscriber);
	}, []);


	return (
		<div className={"fixed w-full h-full z-50 pt-32 bg-black/60" + `${hidden ? " hidden" : ""}`}>
			<div className="w-11/12 md:w-8/12 xl:w-6/12 px-8 pt-8 pb-12 m-auto relative rounded-lg bg-indigo-900">
				<span onClick={() => setHidden(true)}
					className="text-4xl absolute top-0 right-2 hover:text-zinc-400 cursor-pointer">&times;</span>
				<div>
					<h2 className="text-xl text-red-600 mb-4">Something went wrong...</h2>
					{errors.map(e => <div key={e}>{e}</div>)}
				</div>
			</div>
		</div>
	);
}