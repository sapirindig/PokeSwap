import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import PostWindow from '../CreatePostWindow/CreatePostWindow';
import './HomePage.css';

interface Post {
  _id?: string;
  title: string;
  content: string;
  owner: string;     
  image?: string;
}

const HomePage = () => {
  const [showPostWindow, setShowPostWindow] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="homepage" style={{ backgroundImage: 'url(/pokaballBackground.png)' }}>
      <Navbar />

      {!showPostWindow && (
        <div className="post-button-wrapper">
          <button className="post-button" onClick={() => setShowPostWindow(true)}>
            <img src="/icons/plus.png" alt="plus" className="plus-icon" />
            <span>Post a card</span>
          </button>
        </div>
      )}

      {showPostWindow && (
        <PostWindow
          onClose={() => setShowPostWindow(false)}
          onPostSuccess={fetchPosts}
        />
      )}

      
      {!showPostWindow && (
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
      )}
    </div>
  );
};

export default HomePage;
