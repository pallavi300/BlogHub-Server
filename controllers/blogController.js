const Blog = require('../models/Blog');

exports.createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create blog', error: err.message });
  }
};

exports.getAllBlogs = async (req, res) => {
  const blogs = await Blog.find().populate('author', 'name email').sort({ createdAt: -1 });
  res.json(blogs);
};

exports.getBlogById = async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('author', 'name email');
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).json({ message: 'Blog not found' });
  }
};

exports.updateBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });

  if (blog.author.toString() !== req.user._id.toString())
    return res.status(401).json({ message: 'Unauthorized' });

  blog.title = req.body.title || blog.title;
  blog.content = req.body.content || blog.content;

  const updated = await blog.save();
  res.json(updated);
};

exports.deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });

  if (blog.author.toString() !== req.user._id.toString())
    return res.status(401).json({ message: 'Unauthorized' });

  await blog.remove();
  res.json({ message: 'Blog deleted' });
};
