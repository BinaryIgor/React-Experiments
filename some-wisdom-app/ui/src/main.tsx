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
import AuthorPage from './author/AuthorPage';
import RoutesGuard from './shared/RoutesGuard';
import QuotePage from './quote/QuotePage';
import { UserProvider } from './shared/UserContext';
import ProtectedRoute from './shared/ProtectedRoute';

// public routes needed to also be defined in the <RoutesGuard>
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<UserProvider>
			<ErrorModal />
			<BrowserRouter>
				<RoutesGuard>
					<TopNav />
					<Routes>
						<Route path="/sign-in" element={<SignIn />}></Route>

						<Route element={<ProtectedRoute />}>
							<Route path="/" element={<AuthorsHomePage />} />
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route path="/authors/:name" element={<AuthorPage></AuthorPage>}></Route>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route path="/quotes/:id" element={<QuotePage></QuotePage>}></Route>
						</Route>
						<Route element={<ProtectedRoute />}>
							<Route path="/user-profile" element={<UserProfile />}></Route>
						</Route>
					</Routes>
				</RoutesGuard>
			</BrowserRouter>
		</UserProvider>
	</StrictMode>
)
