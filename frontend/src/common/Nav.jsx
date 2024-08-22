import { Link, useNavigate } from "react-router-dom"
import { useAuthentication } from "../features/authentication"
import logo from "../assets/logo-no-background.png"
import { useEffect, useState } from "react"
import { getUserById } from "../api/users"
import LogoutButton from "./LogoutButton"

export default function Nav() {
  const [user, login, logout] = useAuthentication();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // console.log("logged in user first name: ", user.firstname)
  function onLogoutClick(e) {
    e.preventDefault(); // Prevent default link behavior
    logout();
    navigate("/");
  }

  return (
    <div className="w-full flex flex-col justify-between bg-gray-600 text-white py-4 items-center md:flex-row md:items-baseline">
      <Link to="/" className="flex items-center">
        <img
          src={logo}
          alt="High Street Gym Logo"
          className="h-10 w-auto mt-5 ml-5"
        />
      </Link>
      <div className="navbar flex md:justify-start">
        <ul className="menu md:menu-horizontal px-1 w-full">
          {/* Common links for all users */}
          <li>
            <Link to="/activities">Activities</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/classes">Classes</Link>
          </li>
          {/* <li><Link to="/locations">Locations</Link></li> */}
          <li>
            <a href="/locations">Locations</a>
          </li>

          {/* <li><Link to="/trainers">Trainers</Link></li> */}
          <li>
            <a href="/trainers">Trainers</a>
          </li>

          {/* Links for logged-in users */}
          {user && (
            <>
              {/* Common links for logged-in users */}
              
              <li className="text-gray-500">
                Hello, {user.firstName}!
            
              </li>
        
              

              {/* Additional links based on user role */}
              {user.role === "admin" && (
                <>
                  <li>
                    <Link to="/manage-users">Manage Users</Link>
                  </li>
                  <li>
                    <Link to="/manage-classes">Manage Classes</Link>
                  </li>
                  <li>
                    <Link to="/manage-bookings">Manage Bookings</Link>
                  </li>
                  <li>
                    <Link to="/manage-activities">Manage Activities</Link>
                  </li>
                  <li>
                    <Link to="/manage-locations">Manage Locations</Link>
                  </li>
                  <li>
                    <Link to="/manage-blogs">Manage Blogs</Link>
                  </li>
                  <li>
                    <Link to="/blogs/my-blogs">My Blogs</Link>
                  </li>
                </>
              )}
              {user.role === "trainer" && (
                <>
                  <li>
                    <Link to="/my-classes">My Classes</Link>
                  </li>
                  <li>
                    <Link to="/blogs/my-blogs">My Blogs</Link>
                  </li>
                </>
              )}
              {user.role === "member" && (
                <>
                  <li>
                    <Link to="/my-bookings">My Bookings</Link>
                  </li>
                  <li>
                    <Link to="/blogs/my-blogs">My Blogs</Link>
                  </li>
                </>
              )}
              {/* Move Logout link to the end */}
              <li>
               <LogoutButton />
              </li>
            </>
          )}

          {/* Links for unlogged users */}
          {!user && (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
