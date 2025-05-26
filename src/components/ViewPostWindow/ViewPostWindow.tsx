import { useEffect, useState } from "react";
import "./ViewPostWindow.css";

interface ViewPostWindowProps {
  post: {
    _id?: string;
    title: string;
    content: string;
    owner: string;
    image?: string;
    likesCount?: number;
    likedBy?: string[];
  };
  onClose: () => void;
  onLikeChange?: () => void;
}

interface Comment {
  _id?: string;
  comment: string;
  postId: string;
  owner: string;
}

const ViewPostWindow = ({ post, onClose, onLikeChange }: ViewPostWindowProps) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [canLike, setCanLike] = useState(true);

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchPostStatus = async () => {
      if (!token || !post._id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${post._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const updatedPost = await res.json();
        setLiked(updatedPost.liked); 
        setLikesCount(updatedPost.likesCount);
      } catch (err) {
        console.error("Error fetching post like status", err);
      }
    };
    fetchPostStatus();
  }, [post._id, token]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments?postId=${post._id}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post._id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !token) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment, postId: post._id }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        console.error("Failed to post comment. Status:", res.status);
      }
    } catch (err) {
      console.error("Error submitting comment", err);
    }
  };

  const handleLikeToggle = async () => {
    if (!token || !post._id || !canLike) return;

    setCanLike(false);
    console.log("Trying to", liked ? "unlike" : "like", "post:", post._id);

    try {
      const endpoint = `${import.meta.env.VITE_API_BASE_URL}/posts/${post._id}/${liked ? "unlike" : "like"}`;
      const method = liked ? "DELETE" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error("Like/unlike failed", res.status);
        return;
      }

      const updatedRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!updatedRes.ok) return;
      const updatedPost = await updatedRes.json();

      setLiked(updatedPost.liked);
      setLikesCount(updatedPost.likesCount);

      if (onLikeChange) onLikeChange();
    } catch (err) {
      console.error("Like toggle error:", err);
    } finally {
      setTimeout(() => setCanLike(true), 300);
    }
  };

  return (
    <div className="post-window view-post-window">
      <img
        src="/icons/close.png"
        alt="close"
        onClick={onClose}
        className="close-button"
      />
      <div className="view-post-content">
        <div className="image-wrapper">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/${post.image}`}
            alt="Post"
            className="preview-image"
          />
        </div>
        <div className="post-details">
          <div className="like-section">
            <img
              src={liked ? "/icons/RedHeart.png" : "/icons/heart.png"}
              alt="like"
              className="heart-icon"
              onClick={handleLikeToggle}
            />
            <span className="likes-count">{likesCount}</span>
          </div>
          <div className="post-input">{post.title}</div>
          <div className="post-textarea">{post.content}</div>
          <div className="comment-section">
            <div
              className="comment-header"
              onClick={() => setShowInput((prev) => !prev)}
            >
              <img
                src="/icons/arrowGreen.png"
                alt="arrow"
                className="comment-arrow-icon"
              />
              <span className="comment-title">Create Offer</span>
            </div>
            {showInput && (
              <div className="comment-input-row">
                <input
                  type="text"
                  className="comment-input"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write your comment..."
                />
                <div
                  className="comment-send-button"
                  onClick={handleCommentSubmit}
                >
                  <img
                    src="/icons/message.png"
                    alt="submit"
                    className="comment-send-icon"
                  />
                </div>
              </div>
            )}
            <div className="comments-list">
              {comments.map((cmt) => (
                <div key={cmt._id} className="comment-item">
                  {cmt.comment}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPostWindow;
