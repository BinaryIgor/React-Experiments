import React, { StrictMode } from 'react';
import './index.css';
import App from './App.jsx';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Details from './Details.jsx';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/details" element={<Details />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>,
)
