import React, { useState, useEffect } from 'react';
import * as Users from '../../api/users'; // Adjust the import path if necessary
import { useAuthentication } from '../authentication'; // Adjust the import path if necessary
import { useParams } from 'react-router-dom'; // Import useParams for URL parameters

const MyProfilePage = () => {
  const [accessRole, setAccessRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [editUser, setEditUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [loggedInUser] = useAuthentication();
  const { userID } = useParams(); // Extract 'userID' from the URL

  useEffect(() => {

    console.log("UserID from params:", userID); // Log userID
    console.log("Logged in user:", loggedInUser); // Log loggedInUser
    const fetchUserData = async () => {
      try {
        const response = await Users.getById(userID);
        if (response.ok) {
          const user = await response.json();
          setEditUser(user);
          setAccessRole(user.role);
          setFirstName(user.firstname);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) {
      fetchUserData();
    } else {
      setError("User is not authenticated.");
      setLoading(false);
    }
  }, [userID, loggedInUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Component */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold">High Street Gym</h1>
          <div className="flex items-center space-x-4">
            <span>{firstName}</span>
            <span>Role: {accessRole}</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <form action="/my_profile" method="post" className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <input type="hidden" name="user_id" value={editUser.id || ''} />

          <div className="form-control">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={editUser.email || ''}
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div className="form-control">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div className="form-control">
            <label htmlFor="access_role" className="block text-sm font-medium text-gray-700">Access Role:</label>
            <input
              type="text"
              name="access_role"
              id="access_role"
              value={editUser.role || ''}
              readOnly
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div className="form-control">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Number:</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              defaultValue={editUser.phone || ''}
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div className="form-control">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name:</label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              defaultValue={editUser.firstname || ''}
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div className="form-control">
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name:</label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              defaultValue={editUser.lastname || ''}
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div className="form-control">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
            <input
              type="text"
              name="address"
              id="address"
              defaultValue={editUser.address || ''}
              className="input input-bordered w-full mt-1"
            />
          </div>

          <div className="form-control mt-4">
            <input
              type="submit"
              name="action"
              value="Update"
              className="btn btn-primary w-full"
            />
          </div>
        </form>
      </main>

      {/* Footer Component */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 High Street Gym. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MyProfilePage;
