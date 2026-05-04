import Blog from "../models/blogPost.js";

const createBlogPost = async (req, res) => {
  const { title, description, content } = req.body;
  const blogDescription = description || content;

  try {
    if (!title || !blogDescription) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    const createdBlogPost = await Blog.create({
      title,
      description: blogDescription,
      author: req.user?.id,
    });

    res.status(201).json(createdBlogPost);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to create blog post" });
  }
};

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await Blog.find()
      .populate("author", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json(blogPosts);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
};

const getBlogPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const blogPost = await Blog.findById(id).populate("author", "userName email");
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(200).json(blogPost);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
};

const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const { title, description, content } = req.body;
  const blogDescription = description || content;

  try {
    const blogPost = await Blog.findById(id);
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    blogPost.title = title || blogPost.title;
    blogPost.description = blogDescription || blogPost.description;

    const updatedBlogPost = await blogPost.save();
    res.status(200).json(updatedBlogPost);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to update blog post" });
  }
};

const deleteBlogPost = async (req, res) => {
  const { id } = req.params;

  try {
    const blogPost = await Blog.findById(id);
    if (!blogPost) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    await blogPost.deleteOne();
    res.status(200).json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Failed to delete blog post" });
  }
};

export {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
};
