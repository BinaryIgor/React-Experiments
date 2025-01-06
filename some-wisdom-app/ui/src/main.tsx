import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css';
import './i18n';
import TopNav from './shared/TopNav';
import ErrorModal from './shared/ErrorModal';
import AuthorsHomePage from './author/AuthorsHomePage';
import SignIn from './user/SignIn';
import UserProfile from './user/UserProfile';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ErrorModal />
		<BrowserRouter>
			<TopNav />
			<Routes>
				<Route path="/" element={<AuthorsHomePage />}></Route>
				<Route path="*" element={<AuthorsHomePage />}></Route>
				<Route path="/sign-in" element={<SignIn />}></Route>
				<Route path="/user-profile" element={<UserProfile />}></Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
)
