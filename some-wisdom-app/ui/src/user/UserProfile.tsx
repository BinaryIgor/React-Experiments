import { useState } from "react";
import { api } from "../shared/api";
import { Events } from "../shared/events";
import { useFetch } from "../shared/hooks";
import { useTranslation } from "react-i18next";

export default function UserProfile() {
	const [userProfile, setUserProfile] = useState<UserProfileView>();
	const { t } = useTranslation();

	useFetch(() => fetchUserProfile(setUserProfile));

	if (!userProfile) {
		return null;
	}
	return (
		<div className="m-2">
			<h2 className="text-xl my-4">{t('userProfilePage.header')}</h2>
			<div>{t('userProfilePage.name')}: {userProfile.name}</div>
			<div>{t('userProfilePage.description')}: {userProfile.description}</div>
		</div>);
}

interface UserProfileView {
	name: string;
	description: string;
}

async function fetchUserProfile(setUserProfile: Function) {
	const response = await api.get("user/profile");
	Events.showErrorModalOrRun(response, () => setUserProfile(response.data));
}
