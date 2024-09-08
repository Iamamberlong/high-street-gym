import { useState } from "react";
import * as Blogs from "../../api/blogs";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";
import PageLayout from "../../common/PageLayout";
import BlogForm from "./BlogForm"; // Import the reusable BlogForm component

export default function CreateBlogPage() {
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

      if (response.status === 201) {
        const blogId = response.blog[0].insertId;
        console.log("blog id is: ", blogId);
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
          {/* Use the BlogForm component and pass the necessary props */}
          <BlogForm
            title={title}
            content={content}
            setTitle={setTitle}
            setContent={setContent}
            error={error}
            onSubmit={handleSubmit}
            submitButtonText="Create Blog"
          />
        </div>
      </div>
    </PageLayout>
  );
}
