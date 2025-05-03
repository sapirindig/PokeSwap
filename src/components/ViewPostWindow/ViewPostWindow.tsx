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

const ViewPostWindow = ({ post, onClose }: ViewPostWindowProps) => {
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
          <div className="post-input">
            {post.title}
          </div>

          <div className="post-textarea">
            {post.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPostWindow;
