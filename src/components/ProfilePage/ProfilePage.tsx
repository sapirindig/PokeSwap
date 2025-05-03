import { useEffect, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';
import './ProfilePage.css';

interface Post {
  _id?: string;
  title: string;
  content: string;
  owner: string;
  image?: string;
}

const ProfilePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchUserPosts = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/user/me`, {
        headers: {
          Authorization: `JWT ${token}`,
        }
      });
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load user posts:", err);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  return (
    <div className="profile-page" style={{ backgroundImage: 'url(/pokaballBackground.png)' }}>
      <Navbar />
      <div className="profile-content">
        <ProfileSidebar />
        <div className="posts-container">
          {posts.map((post, index) => (
            <div key={post._id || index} className="post-card">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/${post.image}`}
                alt="post"
                className="post-image"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;