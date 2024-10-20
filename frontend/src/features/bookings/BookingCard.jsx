import React from "react";

const BookingCard = ({ booking, onDelete, userRole }) => {
  const { id, activity_name, trainer_firstname, trainer_lastname, location_name, class_datetime } = booking;

  return (
    <div className="flex flex-col class-card shadow-md border-gray-600 rounded-lg p-4">
      <span className="class-list-data text-blue-800 text-xl">{activity_name}</span>
      <span className="class-list-data">{trainer_firstname} {trainer_lastname}</span>
      <span className="class-list-data text-blue-600">{location_name}</span>
      <span className="class-list-data text-sm">{new Date(class_datetime).toLocaleString('en-AU', { hour12: false }).slice(0, 20)}</span>
      

      {userRole && (
        <button onClick={() => onDelete(id)} className="btn btn-danger mt-4 w-full max-w-xs bg-danger text-white border-2 border-0 bg-violet-400 text-white px-2 py-1 rounded">
          Cancel
        </button>
      )}
    </div>
  );
};

export default BookingCard;




// import React, { useState } from "react";
// import * as Bookings from "../../api/bookings";

// const BookingCard = ({ booking, userRole, userID }) => {
//   const { id, activity_name, user_firstname, user_lastname, location_name, class_datetime, activity_duration } = booking;

//   const [bookingMessage, setBookingMessage] = useState('');
//   const token = localStorage.getItem('jwtToken');

//   // Handle booking cancellation
//   const handleCancel = async () => {
//     try {
//       const response = await Bookings.remove(id, token); // Assuming you have a cancel method in your API
//       console.log("response in cancelling class is: ", response);
//       console.log("response's status is: ", response.status);
//       if (response.status === 200) {
//         setBookingMessage("You have successfully canceled the booking.");
//       } else if (response.status === 404) {
//         setBookingMessage("Booking not found.");
//       } else {
//         setBookingMessage("Something went wrong.");
//       }
//     } catch (error) {
//       console.error("Cancellation error: ", error);
//       setBookingMessage("An error occurred while canceling the booking.");
//     }
//   };

//   return (
//     <div className="flex flex-col class-card bg-white shadow-md rounded-lg p-4">
//       <span className="class-list-data text-blue-800 text-xl">{activity_name}</span>
//       <span className="class-list-data">{user_firstname} {user_lastname}</span>
//       <span className="class-list-data text-blue-600">{location_name}</span>
//       <span className="class-list-data text-sm">{new Date(class_datetime).toLocaleString('en-AU', { hour12: false }).slice(0, 20)}</span>
//       <span className="class-list-data text-sm">{activity_duration}</span>

//       {userRole && (<button onClick={handleCancel} className="btn btn-danger">Cancel</button>)}

//       {bookingMessage && (
//         <div className={`mt-4 p-2 rounded ${bookingMessage.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
//           {bookingMessage}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BookingCard;
