import Navbar from '../Navbar/Navbar';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import './ProfilePage.css';

const ProfilePage = () => {
  return (
    <div className="profile-page" style={{ backgroundImage: 'url(/pokaballBackground.png)' }}>
      <Navbar />
      <div className="profile-content">
        <ProfileSidebar />
      </div>
    </div>
  );
};

export default ProfilePage;
