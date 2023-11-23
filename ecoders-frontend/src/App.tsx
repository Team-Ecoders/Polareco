import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './components/sharedlayout/Footer';
import Header from './components/sharedlayout/Header';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { useState } from 'react';

import ResetPasswordPage from './pages/ResetPasswordPage';
import ErrorPage from './pages/ErrorPage';
import Session from './components/feature/user/Session';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <BrowserRouter>
        <Session setIsLoading={setIsLoading} />
        {!isLoading && (
          <>
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/error" element={<ErrorPage />} />
            </Routes>
            <Footer />
          </>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
