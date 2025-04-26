import { useEffect, useState } from 'react';
import './ProfileSidebar.css';

const ProfileSidebar = () => {
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No token found');
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error('Failed to fetch profile');
          return;
        }

        const data = await res.json();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No token found');
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });

      if (!res.ok) {
        console.error('Failed to update profile');
        return;
      }

      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  return (
    <div className="profile-sidebar">
      <div className="edit-icon" onClick={() => setEditMode(!editMode)}>
        <img src="/icons/pen.png" alt="Edit Profile" />
      </div>
      <div className="profile-image">
        <img src="/icons/pokaball.png" alt="Profile" />
      </div>
      <div className="profile-info">
        {editMode ? (
          <>
            <input
              className="profile-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="profile-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="save-button" onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            <div className="profile-field">{profile?.username || 'Username'}</div>
            <div className="profile-field">{profile?.email || 'email@example.com'}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSidebar;
