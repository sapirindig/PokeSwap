import Navbar from '../Navbar/Navbar';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage" style={{ backgroundImage: 'url(/pokaballBackground.png)' }}>
      <Navbar />
    </div>
  );
};

export default HomePage;
