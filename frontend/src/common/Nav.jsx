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
    <div className="w-full flex flex-col justify-between bg-teal-500 text-white py-4 items-center md:flex-row md:items-baseline">
      {/* <Link to="/" className="hidden md:flex items-center ml-5">
        <img
          src={logo}
          alt="High Street Gym Logo"
          className="h-10 w-auto mt-5 ml-5"
        />
      </Link> */}
      <div className="navbar flex md:justify-start">
        <ul className="menu md:menu-horizontal px-1 w-full text-lg">
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
              
              <li className="text-yellow-300">
                Hello, {user.firstName}!
              </li>
          
              <li>
              <Link to={`/users/${user.userID}`}>My Profile</Link>
              </li>

              {user.role === "admin" && (
                <>
                  <li>
                    <Link to="/create-class">Create Class</Link>
                  </li>
                  <li>
                    <Link to="/blogs/my-blogs">My Blogs</Link>
                  </li>
                </>
              )}
              {user.role === "trainer" && (
                <>
                  <li>
                    <Link to='/classes/my-classes'>My Classes</Link>
                  </li>
                  <li>
                    <Link to="/blogs/my-blogs">My Blogs</Link>
                  </li>
                  <li>
                    <Link to="/create-class">Create Class</Link>
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
