
import { useState } from 'react';
import "./EditPostWindow.css";

interface EditPostWindowProps {
  post: {
    _id?: string;
    title: string;
    content: string;
    image?: string;
  };
  onClose: () => void;
}

const EditPostWindow = ({ post, onClose }: EditPostWindowProps) => {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(post.image ? `${import.meta.env.VITE_API_BASE_URL}/${post.image}` : '/icons/image.jpg');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('accessToken');
    if (!post._id || !token) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${post._id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (res.ok) onClose();
    else alert('Failed to update post');
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('accessToken');
    if (!post._id || !token) return;

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/posts/${post._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) onClose();
    else alert('Failed to delete post');
  };

  return (
    <div className="edit-post-window">
      <img
        src="/icons/close.png"
        alt="close"
        className="close-button"
        onClick={onClose}
      />

      <div className="image-wrapper">
        <label htmlFor="edit-image-upload" className="image-upload">
          <img src={imagePreview} alt="preview" className="preview-image" />
        </label>
        <input
          type="file"
          id="edit-image-upload"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </div>

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

      <div className="button-row">
        <button className="post-button green" onClick={handleSave}>SAVE</button>
        <button className="post-button red" onClick={handleDelete}>DELETE</button>
      </div>
    </div>
  );
};

export default EditPostWindow;