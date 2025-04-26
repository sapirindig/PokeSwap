import { useEffect, useState } from 'react';
import './ProfileSidebar.css';

const ProfileSidebar = () => {
  const [profile, setProfile] = useState<{ username: string; email: string } | null>(null);

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
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="profile-sidebar">
      <div className="edit-icon">
        <img src="/icons/pen.png" alt="Edit Profile" />
      </div>
      <div className="profile-image">
        <img src="/icons/pokaball.png" alt="Profile" />
      </div>
      <div className="profile-info">
        <div className="profile-field">{profile?.username || 'Username'}</div>
        <div className="profile-field">{profile?.email || 'email@example.com'}</div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
