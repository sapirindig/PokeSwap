import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch(`/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.status === 409) {
        setErrorMessage('משתמש עם כתובת האימייל הזו כבר קיים');
        return;
      }

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('User registered:', data);
      navigate('/login');

    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('User details already exist.');
    }
  };

  return (
    <div className="auth-layout">
      <div className="signup-page">
        <div className="header-section">
          <img src="/Logo.png" alt="PokeSwap Logo" className="logo-outside" />
          <p className="description-outside">Where Pokémon cards find new homes</p>
        </div>

        <div className="signup-box">
          <form className="signup-form" onSubmit={handleSignup}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              required
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            <button type="submit" className="btn-signup">
              Start your trading journey now!
            </button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </div>
      </div>

      <div className="image-section">
        <img src="/wallpeper/1.jpg" className="slider-image" />
      </div>
    </div>
  );
};

export default SignupPage;
