import { useEffect, useState } from "react";
import * as Bookings from "../../api/bookings";
import PageLayout from "../../common/PageLayout";
import BookingCard from "./BookingCard";
import { useAuthentication } from "../authentication";
import { useNavigate } from "react-router-dom";
import Footer from "../../common/Footer";

export default function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState([]);
  const [message, setMessage] = useState(''); // New state for message
  const [user] = useAuthentication();
  const token = localStorage.getItem("jwtToken");
  const navigate = useNavigate();
  const userRole = user?.role || '';

  useEffect(() => {
    const fetchBookings = async () => {
      if (user && token) {
        try {
          const bookings = await Bookings.getMyBookings(token);
          console.log("My bookings are: ", bookings);
          setMyBookings(bookings);
        } catch (error) {
          console.error("Error fetching my bookings: ", error);
        }
      }
    };
    fetchBookings();
  }, [user, token]);

  const handleDelete = async (bookingId) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (confirmed) {
      try {
        await Bookings.remove(bookingId, token);
        setMyBookings(myBookings.filter(booking => booking.id !== bookingId));
        setMessage("Booking successfully canceled.");
      } catch (error) {
        console.error("Error canceling booking: ", error);
        setMessage("An error occurred while canceling the booking.");
      }
    }
  };

  return (
    <PageLayout>
     
      <div className="classes-container p-4">
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        {message && (
          <div className={`mt-4 p-2 rounded ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {myBookings.length > 0 ? (
            myBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onDelete={handleDelete}
                userRole={userRole}
              />
            ))
          ) : (
            <div className="text-center">You have not booked any classes yet.</div>
          )}
        </div>
      </div>

    </PageLayout>
  );
}



// import { useEffect, useState } from "react";
// import * as Bookings from "../../api/bookings";
// import Header from "../../common/Header";
// import BookingCard from "./BookingCard";
// import { useAuthentication } from "../authentication";
// import { useNavigate } from "react-router-dom";
// import Footer from "../../common/Footer";

// export default function MyBookingsPage() {
//   const [myBookings, setMyBookings] = useState([]);
//   const [user] = useAuthentication();
//   const token = localStorage.getItem("jwtToken");
//   const navigate = useNavigate();
//   const userRole = user?.role || '';

//   useEffect(() => {
//     const fetchBookings = async () => {
//       if (user && token) {
//         try {
//           const bookings = await Bookings.getMyBookings(token);
//           console.log("My bookings are: ", bookings);
//           setMyBookings(bookings);
//         } catch (error) {
//           console.error("Error fetching my bookings: ", error);
//         }
//       }
//     };
//     fetchBookings();
//   }, [user, token]);

//   const handleDelete = async (bookingId) => {
//     const confirmed = window.confirm("Are you sure you want to cancel this booking?");
//     if (confirmed) {
//       try {
//         await Bookings.remove(bookingId, token); // Assuming the API needs the token
//         setMyBookings(myBookings.filter(booking => booking.id !== bookingId)); // Update state
//       } catch (error) {
//         console.error("Error canceling booking: ", error);
//       }
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="container p-2 mx-auto">
//         <h2 className="text-center">My Bookings</h2>
//         <div className="grid gap-4 grid-cols-1">
//           {myBookings.length > 0 ? (
//             myBookings.map((booking) => (
//               <BookingCard
//                 key={booking.id}
//                 booking={booking}
//                 onDelete={handleDelete}
//                 userRole={userRole}
//               />
//             ))
//           ) : (
//             <div className="text-center">You have not booked any classes yet.</div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }
