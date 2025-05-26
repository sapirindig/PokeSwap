import { useEffect, useRef, useState } from 'react';
import './ProfileSidebar.css';

const ProfileSidebar = () => {
  const [profile, setProfile] = useState<{ username: string; email: string; imageUrl?: string } | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); 

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

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No token found');
        return;
      }
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username, email }),
      });

      if (selectedImage) {
        const formData = new FormData();
        formData.append('profileImage', selectedImage);

        await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/upload-profile-image`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setEditMode(false);
      setSelectedImage(null);
    } catch (error) {
      console.error('Error updating profile', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  return (
    <div className="profile-sidebar">
      <div className="edit-icon" onClick={() => setEditMode(!editMode)}>
        <img src="/icons/pen.png" alt="Edit Profile" />
      </div>

      <div className="profile-image" onClick={editMode ? handleImageClick : undefined} style={{ cursor: editMode ? 'pointer' : 'default' }}>
        <img
          src={
            profile?.imageUrl && profile.imageUrl.trim() !== ''
              ? `${import.meta.env.VITE_API_BASE_URL}${profile.imageUrl.startsWith('/') ? '' : '/'}${profile.imageUrl}`
              : '/icons/pokaball.png'
          }
          alt="Profile"
        />
      </div>

      {editMode && (
        <input
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      )}

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

      <button className="logout-button" onClick={handleLogout}>
        LOG OUT
      </button>
    </div>
  );
};

export default ProfileSidebar;
