import { useNavigate } from 'react-router-dom';
import ImageSlider from '../ImageSlider/ImageSlider'; // הוספת רכיב התמונות
import './SignupPage.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="auth-layout">
      {/* צד שמאל – הטופס */}
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

      {/* צד ימין – גלריית התמונות */}
      <div className="image-section">
        <ImageSlider />
      </div>
    </div>
  );
};

export default SignupPage;
