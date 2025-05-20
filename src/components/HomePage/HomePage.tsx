import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import PostWindow from '../CreatePostWindow/CreatePostWindow';
import ViewPostWindow from '../ViewPostWindow/ViewPostWindow';
import './HomePage.css';

interface Post {
  _id?: string;
  title: string;
  content: string;
  owner: string;
  image?: string;
  likesCount?: number;
  likedBy?: string[];
  commentsCount?: number;
}

const HomePage = () => {
  const [showPostWindow, setShowPostWindow] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchCommentsCount = async (posts: Post[]) => {
    const updatedPosts = await Promise.all(posts.map(async (post) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments?postId=${post._id}`);
        const comments = await res.json();
        return { ...post, commentsCount: comments.length };
      } catch {
        return { ...post, commentsCount: 0 };
      }
    }));
    setPosts(updatedPosts);
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`);
      const data = await res.json();
      setPosts(data);
      fetchCommentsCount(data);
    } catch (err) {
      console.error("Failed to load posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleCloseView = () => {
    setSelectedPost(null);
    fetchPosts();
  };

  return (
    <div className="homepage" style={{ backgroundImage: 'url(/pokaballBackground.png)' }}>
      <Navbar />

      {!showPostWindow && !selectedPost && (
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

      {!showPostWindow && !selectedPost && (
        <div className="posts-container">
          {posts.map((post, index) => (
            <div
              key={post._id || index}
              className="post-card"
              onClick={() => handlePostClick(post)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/${post.image}`}
                alt="post"
                className="post-image"
              />
              <div className="post-meta">
                <div className="meta-info">
                  <img src="/icons/RedHeart.png" className="meta-icon" />
                  <span>{post.likesCount || 0}</span>
                </div>
                <div className="meta-info">
                  <img src="/icons/chat.png" className="meta-icon" />
                  <span>{post.commentsCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPost && (
        <ViewPostWindow post={selectedPost} onClose={handleCloseView} />
      )}
    </div>
  );
};

export default HomePage;
