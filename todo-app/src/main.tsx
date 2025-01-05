import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import Todos from './Todos';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Todos />
    </BrowserRouter>
  </StrictMode>,
)
