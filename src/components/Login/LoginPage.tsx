import { useState } from 'react';
import './LoginPage.css';
import ImageSlider from '../ImageSlider/ImageSlider';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const message = await res.text();
        console.error('Login failed:', message);
        setErrorMessage('Incorrect email or password. Please try again.');
        return;
      }

      const data = await res.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      console.log('Logged in successfully');
      setErrorMessage('');
      navigate('/home');
    } catch (err) {
      console.error('Error during login:', err);
      setErrorMessage('Something went wrong. Please try again later.');
    }
  };

  const handleNavigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="auth-layout">
      <div className="image-section">
        <ImageSlider />
      </div>

      <div className="login-page">
        <div className="header-section">
          <img src="/Logo.png" alt="PokeSwap Logo" className="logo-outside" />
          <p className="description-outside">
            <strong>Got rare cards? Looking to complete your deck?</strong><br />
            <strong>PokeSwap</strong> – the ultimate hub where real Pokémon trainers connect, trade, and grow their collections together!
          </p>
        </div>

        <div className="login-box">
          <form className="login-form" onSubmit={handleEmailLogin}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit" className="btn-email">Sign in</button>
          </form>

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="btn-google">
            <img src="/google.png" alt="Google icon" />
            <span>Sign in with Google</span>
          </button>

          <button className="simple-signup-text" onClick={handleNavigateToSignup}>
            Don't have an account yet?
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
