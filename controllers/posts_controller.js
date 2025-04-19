const Post = require("../models/posts_model").default;


exports.getAllPosts = async (req, res) => {
  try {
    const { owner } = req.query;
    const filter = owner ? { owner } : {};
    const posts = await Post.find(filter);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createPost = async (req, res) => {
    console.log("POST request received at /posts");
    console.log("Body:", req.body);
  
    try {
      const newPost = await Post.create(req.body);
      res.status(201).json(newPost);
    } catch (err) {
      console.error("Error creating post:", err.message);
      res.status(400).json({ message: err.message });
    }
  };
  
  


exports.deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

