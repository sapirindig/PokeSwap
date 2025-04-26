import './ProfileSidebar.css';

const ProfileSidebar = () => {
  return (
    <div className="profile-sidebar">
      <div className="edit-icon">
        <img src="public/icons/pen.png" alt="Edit Profile" />
      </div>
      <div className="profile-image">
        <img src="icons/pokaball.png" alt="Profile" />
      </div>
      <div className="profile-info">
        <div className="profile-field">Username</div>
        <div className="profile-field">email@example.com</div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
