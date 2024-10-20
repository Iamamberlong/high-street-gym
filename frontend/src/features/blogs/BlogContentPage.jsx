// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import * as Blogs from "../../api/blogs";
// import PageLayout from "../../common/PageLayout";
// import { useAuthentication } from "../authentication"; // Import for user role

// export default function BlogContentPage() {
//     // this id is the blog's id
//     const { id } = useParams(); 
//     console.log("id on ContentPage is: ", id)
//     const navigate = useNavigate();
//     const [blog, setBlog] = useState(null);
//     const [title, setTitle] = useState('');
//     const [content, setContent] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [isEditing, setIsEditing] = useState(false);
//     const [user] = useAuthentication(); // Get user for role-based access
//     console.log("userID is: ", user.userID)
//     const token = localStorage.getItem('jwtToken'); // Ensure you have a valid token
//     const userRole = user?.role || '';
//     console.log("userRole is: ", userRole)
    

//     useEffect(() => {
//         const fetchBlog = async () => {
//             setLoading(true);
//             try {
//                 const fetchedBlog = await Blogs.getById(id);
//                 setBlog(fetchedBlog);
//                 setTitle(fetchedBlog.title);
//                 setContent(fetchedBlog.content);
//             } catch (error) {
//                 console.error("Failed to fetch blog:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBlog();
//     }, [id]); // Add `isEditing` as a dependency to refetch when it changes

//     const handleSave = async () => {
//         try {
//             const blogData = { title, content };
//             await Blogs.update(id, blogData, token);

//             // After saving, set editing mode to false and refetch data
//             setIsEditing(false);
//             navigate(`/blogs/${id}`); // Ensure redirection to the blog content page
//         } catch (error) {
//             console.error("Failed to update blog:", error);
//         }
//     };
//     const handleDelete = async () => {
//         try {
//             await Blogs.delete(id, token);
//             navigate('/blogs'); // Redirect to blog list after deletion
//         } catch (error) {
//             console.error("Failed to delete blog:", error);
//         }
//     };

//     return (
//         <PageLayout>
            
//             <div className="container mx-auto p-4">
    
//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : blog ? (
//                     <div>
//                         {isEditing ? (
//                             // Show edit form if user has the required role
//                             (userRole === 'admin' || ((userRole === 'member'|| userRole === 'trainer') && user.userID === blog.user_id)) && (
//                                 <div>
//                                     <label className="block mb-2">
//                                         Title:
//                                         <input
//                                             type="text"
//                                             value={title}
//                                             onChange={(e) => setTitle(e.target.value)}
//                                             className="block w-full p-2 border border-gray-300 rounded"
//                                         />
//                                     </label>
//                                     <label className="block mb-4">
//                                         Content:
//                                         <textarea
//                                             value={content}
//                                             onChange={(e) => setContent(e.target.value)}
//                                             className="block w-full p-2 h-80 border border-gray-300 rounded"
//                                         />
//                                     </label>
//                                     <button
//                                         onClick={handleSave}
//                                         className="bg-blue-500 text-white px-4 py-2 rounded"
//                                     >
//                                         Save
//                                     </button>
//                                     <button
//                                         onClick={() => setIsEditing(false)}
//                                         className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
//                                     >
//                                         Cancel
//                                     </button>
//                                 </div>
//                             )
//                         ) : (
//                             <div>
//                                 <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
//                                 <p className="text-sm text-gray-600 mb-4">{blog.post_datetime}</p>
//                                 <div>{blog.content}</div>
                        
//                                 {/* {(userRole === 'admin' || ((userRole === 'member' || userRole === 'trainer') && user.userID === blog.user_id)) && (
//                                     <button
//                                         onClick={() => setIsEditing(true)}
//                                         className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
//                                     >
//                                         Edit
//                                     </button>
//                                 )} */}
//                             </div>
//                         )}
//                     </div>
//                 ) : (
//                     <p>Blog not found.</p>
//                 )}
//             </div>
//         </PageLayout>
//     );
// }


// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import * as Blogs from "../../api/blogs";
// import Nav from "../../common/Nav";

// export default function BlogContentPage() {
//     const { id } = useParams(); 
//     console.log("Blog ID:", id)
   
//     const [blog, setBlog] = useState(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBlog = async () => {
//             setLoading(true);
//             try {
//                 const fetchedBlog = await Blogs.getByID(id);
//                 setBlog(fetchedBlog);
//             } catch (error) {
//                 console.error("Failed to fetch blog:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBlog();
//     }, [id]);

//     return (
//         <>
//             <Nav />
//             <div className="container mx-auto p-4">
//                 <h2 className="text-3xl font-bold text-center mb-4"></h2>
//                 {loading ? (
//                     <p>Loading...</p>
//                 ) : blog ? (
//                     <div>
//                         <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
//                         <p className="text-sm text-gray-600 mb-4">{blog.post_datetime}</p>
//                         <div>{blog.content}</div>
//                     </div>
//                 ) : (
//                     <p>Blog not found.</p>
//                 )}
//             </div>
//         </>
//     );
// }


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Blogs from "../../api/blogs";
import PageLayout from "../../common/PageLayout";
import { useAuthentication } from "../authentication";

export default function BlogContentPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [user] = useAuthentication(); // Get user for role-based access
    const token = localStorage.getItem('jwtToken'); // Ensure you have a valid token
    const userRole = user?.role || '';
    const userId = user?.userID || null; // Get user ID

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const fetchedBlog = await Blogs.getById(id);
                setBlog(fetchedBlog);
                setTitle(fetchedBlog.title);
                setContent(fetchedBlog.content);
            } catch (error) {
                console.error("Failed to fetch blog:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    const handleSave = async () => {
        try {
            const blogData = { title, content };
            await Blogs.update(id, blogData, token);

            const updatedBlog = await Blogs.getById(id)
            setBlog(updatedBlog)
            setTitle(updatedBlog.title)
            setContent(updatedBlog.content)
            setIsEditing(false);
            navigate(`/blogs/${id}`);
        } catch (error) {
            console.error("Failed to update blog:", error);
        }
    };

    // const handleDelete = async () => {
    //     try {
    //         await Blogs.delete(id, token);
    //         navigate('/blogs'); // Redirect to blog list after deletion
    //     } catch (error) {
    //         console.error("Failed to delete blog:", error);
    //     }
    // };



    return (
        <PageLayout>
            <div className="container mx-auto p-4">
                {loading ? (
                    <p>Loading...</p>
                ) : blog ? (
                    <div>
                        {isEditing ? (
                            // Show edit form if user has the required role
                            (userRole === 'admin' || (userRole === 'member' || userRole === 'trainer') && userId === blog.user_id) && (
                                <div>
                                    <label className="block mb-2">
                                        Title:
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="block w-full p-2 border border-gray-300 rounded"
                                        />
                                    </label>
                                    <label className="block mb-4">
                                        Content:
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="block w-full p-2 h-80 border border-gray-300 rounded"
                                        />
                                    </label>
                                    <button
                                        onClick={handleSave}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                                    >
                                        Cancel
                                    </button>
         
                                </div>
                            )
                        ) : (
                            <div>
                                <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
                                <p className="text-sm text-gray-600 mb-4">{blog.post_datetime}</p>
                                <div>{blog.content}</div>
                                {/* Show edit button if user has the required role */}
                                {(userRole === 'admin' || (userRole === 'member' || userRole === 'trainer') && userId === blog.user_id) && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <p>Blog not found.</p>
                )}
            </div>
        </PageLayout>
    );
}
