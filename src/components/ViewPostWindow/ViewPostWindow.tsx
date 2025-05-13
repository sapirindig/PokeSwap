import { useEffect, useState } from "react";
import "./ViewPostWindow.css";

interface ViewPostWindowProps {
  post: {
    _id?: string;
    title: string;
    content: string;
    owner: string;
    image?: string;
  };
  onClose: () => void;
}

interface Comment {
  _id?: string;
  comment: string;
  postId: string;
  owner: string;
}

const ViewPostWindow = ({ post, onClose }: ViewPostWindowProps) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showInput, setShowInput] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/comments?postId=${post._id}`
      );
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (!newComment.trim() || !token || !userId) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ comment: newComment, postId: post._id }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments();
      } else {
        console.error("Failed to post comment");
      }
    } catch (err) {
      console.error("Error submitting comment", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post._id]);

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
                <img
                  src="/icons/message.png"
                  alt="submit"
                  className="comment-send-icon"
                  onClick={handleCommentSubmit}
                />
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
