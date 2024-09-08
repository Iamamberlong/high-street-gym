import { createBrowserRouter } from "react-router-dom";
import { RestrictedRoute } from "./common/RestrictedRoute";
import ClassListPage from "./features/classes/ClassListPage";
import LoginPage from "./features/users/LoginPage";
import RegisterPage from "./features/users/RegisterPage";
import BookingListPage from "./features/bookings/BookingListPage";
import BlogListPage from "./features/blogs/BlogListPage";
import MyBlogsPage from "./features/blogs/MyBlogsPage";
import MyBookingsPage from "./features/bookings/MyBookingsPage"
import LocationListPage from "./features/locations/LocationListPage";
import UserListPage from "./features/users/UserListPage";
import MyProfilePage from "./features/users/MyProfilePage"
import ActivityListPage from "./features/activities/ActivityListPage";
import HomePage from "./features/homepage/HomePage";
import BlogContentPage from "./features/blogs/BlogContentPage"; // 
import ManageUsersPage from "./features/users/ManageUsers";
import TrainerListPage from "./features/users/TrainerListPage";
import ManageClassPage from "./features/classes/ManageClassesPage";
import CreateBlogPage from "./features/blogs/CreateBlogPage";
import EditBlogPage from "./features/blogs/EditBlogPage"
import CreateClassPage from "./features/classes/CreateClassPage"
import UpLoadPage from "./features/users/UpLoadPage";



const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/my-profile",
        element: <RestrictedRoute allowedRoles={["admin", "member", "trainer"]}>
        <MyProfilePage />
    </RestrictedRoute>
    },
    {
        path: "/manage-users",
        element: <ManageUsersPage />
    },
    {
        path: "/upload",
        element: <UpLoadPage />
    },
    {
        path: "/blogs",
        element: <BlogListPage />
    },
    {
        path: "/blogs/create",
        element: <CreateBlogPage />
    },
    {
        path: "/create-class",
        element: <CreateClassPage />
    },
    {
        path: "/users",
        element: <RestrictedRoute allowedRoles={["admin"]}>
            <UserListPage />
        </RestrictedRoute>
    },
    {
        path: "/classes/",
        element: <ClassListPage />    
    },
    {
        path: "/manage-classes",
        element: <RestrictedRoute allowedRoles={["admin"]}>
            <ManageClassPage />
        </RestrictedRoute>
    },
    {
        path: "/trainers",
        element: <TrainerListPage />
    },
    {
        path: "/bookings",
        element: <RestrictedRoute allowedRoles={["admin"]}>
            <BookingListPage />
        </RestrictedRoute>
    },
    {
        path: "/blogs/:id",
        element: <BlogContentPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/activities",
        element: <ActivityListPage />
    },
    {
        path: "/locations",
        element: <LocationListPage />
    },
    {
        path: "/my-bookings",
        element: <RestrictedRoute allowedRoles={["admin", "member", "trainer"]}>
            <MyBookingsPage />
        </RestrictedRoute>
    },
    {
        path: "/blogs/my-blogs",
        element: <RestrictedRoute allowedRoles={["admin", "member", "trainer"]}>
            <MyBlogsPage />
        </RestrictedRoute>
    },
    {
        path: "/blogs/edit/:id",
        element: <RestrictedRoute allowedRoles={["admin", "member", "trainer"]}>
            <EditBlogPage />
        </RestrictedRoute>
    }


]);

export default router;
