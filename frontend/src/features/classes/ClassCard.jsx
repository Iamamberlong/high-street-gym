import React, { useState } from "react";
import * as Bookings from "../../api/bookings";
import * as GymClasses from "../../api/classes"; // Import GymClasses to use remove method

const ClassCard = ({ gymClass, userRole, userID }) => {
  const { id, activity_name, user_firstname, user_lastname, location_name, class_datetime, activity_duration, creatorId } = gymClass;

  const [bookingMessage, setBookingMessage] = useState('');
  const token = localStorage.getItem('jwtToken');

  // Handle booking submission
  const handleBooking = async () => {
    try {
      const booking = {
        user_id: userID,
        class_id: id,
        created_datetime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      };
      const response = await Bookings.create(booking, token);
      console.log("response in booking class is: ", response);
      if (response.status === 201) {
        setBookingMessage("You have successfully booked the class.");
      } else if (response.status === 409) {
        setBookingMessage("You have already booked this class.");
      } else {
        setBookingMessage("Something went wrong.");
      }
    } catch (error) {
      console.error("Booking error: ", error);
      setBookingMessage("An error occurred while booking the class.");
    }
  };

  // Handle canceling the class
  const handleCancel = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel this class?");
    if (confirmed) {
      try {
        await GymClasses.remove(id, token); 
        setBookingMessage("Class successfully canceled.");

      } catch (error) {
        console.error("Cancel error: ", error);
        setBookingMessage("An error occurred while canceling the class.");
      }
    }
  };

  return (
    <div className="flex flex-col class-card border-md border-0 border-gray-600 shadow-md rounded-lg p-4">
      <span className="class-list-data text-blue-800 text-xl">{activity_name}</span>
      <span className="class-list-data">{user_firstname} {user_lastname}</span>
      <span className="class-list-data text-blue-600">{location_name}</span>
      <span className="class-list-data text-sm">{new Date(class_datetime).toLocaleString('en-AU', { hour12: false }).slice(0, 20)}</span>
      <span className="class-list-data text-sm">{activity_duration}</span>

      {userRole === 'member' && (
        <button onClick={handleBooking} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          Book
        </button>
      )}

      {userRole === 'trainer' && creatorId === userID && (
        <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
          Cancel
        </button>
      )}

      {bookingMessage && (
        <div className={`mt-4 p-2 rounded ${bookingMessage.includes("successfully") ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
          {bookingMessage}
        </div>
      )}
    </div>
  );
};

export default ClassCard;




// This is a working ClassCard component.
// import React, { useState } from "react"
// import * as Bookings from "../../api/bookings"

// const ClassCard = ({ gymClass, userRole, userID }) => {
//   const { id, activity_name, user_firstname, user_lastname, location_name, class_datetime, activity_duration } = gymClass

//   const [bookingMessage, setBookingMessage] = useState('')
//   const token = localStorage.getItem('jwtToken')

//   // Handle booking submission
//   const handleBooking = async () => {
//     try {
//       const booking = {
//         user_id: userID,
//         class_id: id,
//         created_datetime: new Date().toISOString().slice(0, 19).replace('T', ' ')
//       }
//       const response = await Bookings.create(booking, token)
//       console.log("response in booking class is: ", response)
//       console.log("response's status is: ", response.status)
//       if (response.status === 201) {
//         setBookingMessage("You have successfully booked the class.")
//       } else if (response.status === 409) {
//         setBookingMessage("You have already booked this class.")
//       } else {
//         setBookingMessage("Something wrong goes on.")
//       }
//     } catch (error) {
//       console.error("Booking error: ", error)
//       setBookingMessage("An error occurred while booking the class.")
//     }
//   }

  

//   return (
//     <div className=" flex flex-col class-card border border-gray-600 shadow-md rounded-lg p-4">
//       <span className="class-list-data text-blue-800 text-xl">{activity_name}</span>
//       <span className="class-list-data">{user_firstname} {user_lastname}</span>
//       <span className="class-list-data text-blue-600">{location_name}</span>
//       <span className="class-list-data text-sm">{new Date(class_datetime).toLocaleString('en-AU', { hour12: false }).slice(0, 20)}</span>
//       <span className="class-list-data text-sm">{activity_duration}</span>

//       {userRole && (<button onClick={handleBooking} className="btn btn-primary">Book</button>)}

//       {bookingMessage && (
//         <div className={`mt-4 p-2 rounded ${bookingMessage.includes("successfully") ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
//           {bookingMessage}
//         </div>
//       )}
//     </div>
//   )
// }

// export default ClassCard;
