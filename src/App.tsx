import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import SignupPage from './components/Signup/SignupPage';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} /> 
      <Route path="/signup" element={<SignupPage />} />
      <Route path="*" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} /> 
    </Routes>
  );
}

export default App;
