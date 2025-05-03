import './CreatePostWindow.css';
import { useState, useEffect } from 'react';

interface PostWindowProps {
  onClose: () => void;
  onPostSuccess: () => void;
}

const CreatePostWindow = ({ onClose, onPostSuccess }: PostWindowProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("/icons/image.jpg");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    const fetchUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    if (token && userId) {
      fetchUser();
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Please fill in both title and content");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", localStorage.getItem("userId") || "");
    if (image) {
      formData.append("image", image);
    }

    try {
        const token = localStorage.getItem("accessToken");

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts`, {
          method: "POST",
          headers: {
            Authorization: `JWT ${token}`,
          },
          body: formData,
        });

      if (response.ok) {
        onClose();
        onPostSuccess();
      } else {
        alert("Failed to create post");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting post");
    }
  };

  return (
    <div className="post-window">
      <div className="image-wrapper">
        <label htmlFor="image-upload" className="image-upload">
          <img src={imagePreview} alt="preview" className="preview-image" />
        </label>
        <input type="file" id="image-upload" style={{ display: 'none' }} onChange={handleImageChange} />
      </div>

      <div className="owner-badge">{user?.username || "Unknown user"}</div>

      <input
        type="text"
        className="post-input"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="post-textarea"
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button className="post-button" onClick={handleSubmit}>
        <img src="/icons/plus.png" alt="plus" className="plus-icon" />
        <span>Post a card</span>
      </button>
    </div>
  );
};

export default CreatePostWindow;
