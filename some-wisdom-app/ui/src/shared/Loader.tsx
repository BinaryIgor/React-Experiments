import { useTranslation } from "react-i18next"

export default function Loader() {
	const { t } = useTranslation();
	return (<div className="m-4 text-xl italic">{t('global.loading')}</div>);
}