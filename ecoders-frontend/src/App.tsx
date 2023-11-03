import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Footer from './components/sharedlayout/Footer';
import Header from './components/sharedlayout/Header';
import SignupPage from './pages/SignupPage';
function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
