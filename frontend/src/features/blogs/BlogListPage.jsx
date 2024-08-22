// BlogListPage.jsx
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import * as Blogs from "../../api/blogs"
import Header from "../../common/Header"
import Footer from "../../common/Footer"
import { useAuthentication } from "../authentication"
import BlogCard from "./BlogCard" // Import the BlogCard component

export default function BlogListPage() {
    const [blogPosts, setBlogPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [user] = useAuthentication();
   

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const blogPosts = searchTerm
                    ? await Blogs.getBySearchTerm(searchTerm)
                    : await Blogs.getAll();

                setBlogPosts(blogPosts);
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [searchTerm]);

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
             
                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        className="input input-bordered w-full max-w-md"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        className="btn btn-primary ml-2"
                        onClick={() => setSearchTerm(searchTerm)}
                    >
                        Search
                    </button>
                </div>
                <div className="grid gap-4 grid-cols-1">
                    {loading ? (
                        <div className="text-center">Loading...</div>
                    ) : blogPosts.length > 0 ? (
                        blogPosts.map(blogPost => (
                            <BlogCard key={blogPost.post_id} blogPost={blogPost} />
                        ))
                    ) : (
                        <div className="text-center">No blogs found.</div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}
