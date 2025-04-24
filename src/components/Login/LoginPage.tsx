import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="header-section">
        <img src="/Logo.png" alt="PokeSwap Logo" className="logo-outside" />
        <p className="description-outside">
        <strong>Got rare cards? Looking to complete your deck?</strong><br />
          <strong>PokeSwap</strong> – the ultimate hub where real Pokémon trainers connect, trade, and grow their collections together!
        </p>
      </div>

      <div className="login-box">
        <form className="login-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit" className="btn-email">Sign in</button>
        </form>

        <button className="btn-google">
          <img src="/google.png" alt="Google icon" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
