import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [hovered, setHovered] = useState('');

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/Logo.png" alt="Logo" className="logo" />
        <p className="subtitle">Gotta trade 'em all!</p>
      </div>

      <div className="navbar-center">
        {['PROFILE', 'HOW TO PLAY', 'WHERE TO BUY'].map((item) => (
          <div
            key={item}
            className={`nav-item ${hovered === item ? 'hovered' : ''}`}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered('')}
          >
            {item}
            <img src="/icons/down-arrow.png" className="arrow-icon" alt="arrow" />
          </div>
        ))}

        <div className="search-box">
          <img src="/icons/search (2).png" alt="search" className="icon" />
          <input type="text" placeholder="search" />
          <img src="/icons/close.png" alt="close" className="icon" />
        </div>
      </div>

      <div className="navbar-right">
      <img src="/icons/pokaball.png" alt="pokaball" />
      </div>
    </nav>
  );
};

export default Navbar;
