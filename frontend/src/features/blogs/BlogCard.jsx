// BlogCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function BlogCard({ blogPost, onEdit, onDelete, userRole }) {
    // Safely check if userRole is defined
    const isAdminOrAuthorized = ['admin', 'member', 'trainer'].includes(userRole);

    return (
        <div className="shadow-md rounded-lg overflow-hidden mb-4">
            <div className="p-4">
                <h3 className="text-l font-bold mb-2">
                    <Link to={`/blogs/${blogPost.id}`} className="text-blue-500 hover:underline">
                        {blogPost.title}
                    </Link>
                </h3>
                {/* Conditional rendering of edit and delete buttons */}
                {(onEdit || onDelete) && isAdminOrAuthorized && (
                    <div className="mb-2">
                        {onEdit && (
                            <button
                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                onClick={() => onEdit(blogPost.id)}
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => onDelete(blogPost.id)}
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 text-sm">
                    <p className="flex-1 mb-2 sm:mb-0">{blogPost.firstname}</p>
                    <p className="flex-1 text-right">{blogPost.post_datetime}</p>
                </div>
            </div>
        </div>
    );
}
