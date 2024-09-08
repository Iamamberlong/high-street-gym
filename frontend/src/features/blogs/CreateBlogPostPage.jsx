import { useState } from "react";
import * as Blogs from "../../api/blogs";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";
import PageLayout from "../../common/PageLayout";

export default function CreateBlogPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user] = useAuthentication();
  const token = localStorage.getItem("jwtToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBlog = {
        title,
        content,
      };
      const response = await Blogs.create(newBlog, token);
      console.log("response is: ", response.blog[0].insertId)

      if (response.status === 201) {
        const blogId = response.blog[0].insertId
        console.log("blog id is: ", blogId)
      
        navigate(`/blogs/${blogId}`); // Redirect to MyBlogsPage after successful creation
      } else {
        setError("Failed to create blog post.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      setError("An error occurred while creating the blog post.");
    }
  };

  return (
    <PageLayout>
    <div className="flex flex-col min-h-screen">
    
    <div className="container p-4 mx-auto">
      <h2 className="text-center">Create New Blog</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="form-group mb-4">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="form-group mb-4">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="block w-full max-w-3xl p-2 h-96 border border-gray-300 rounded"
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Blog</button>
      </form>
    </div>
   
    </div>
    </PageLayout>
  );
}
