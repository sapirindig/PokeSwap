import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import SignupPage from './components/Signup/SignupPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

export default App;
