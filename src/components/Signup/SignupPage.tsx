import { useNavigate } from 'react-router-dom';
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן תוכלי להוסיף לוגיקה בעתיד
    navigate('/login'); // מעבר לעמוד הכניסה
  };

  return (
    <div className="signup-page">
      <div className="header-section">
        <img src="/Logo.png" alt="PokeSwap Logo" className="logo-outside" />
        <p className="description-outside">Where Pokémon cards find new homes</p>
      </div>

      <div className="signup-box">
        <form className="signup-form" onSubmit={handleSignup}>
          <input type="text" placeholder="Full Name" required />
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-signup">
            Start your trading journey now!
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
