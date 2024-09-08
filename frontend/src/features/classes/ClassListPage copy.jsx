import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ClassCard from "./ClassCard";
import PageLayout from "../../common/PageLayout";
import * as Classes from "../../api/classes";
import { useAuthentication } from "../authentication";

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

const ClassListPage = () => {

  // const query = useQuery();
  // const startDate = query.get("startDate");
  // const endDate = query.get("endDate");

  const {startDate, endDate} = useParams()

  console.log("startDate is:", startDate)
  console.log("endDate", endDate)
  const [classesByDay, setClassesByDay] = useState({});
  const [mondayOfThisWeek, setMondayOfThisWeek] = useState(null);
  const [dateOfMonday, setDateOfMonday] = useState(null);
  const [dateOfSunday, setDateOfSunday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthentication();
  const userRole = user?.role || '';
  const userID = user?.userID || '';
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const response = await Classes.getAll()
        console.log("fetched classes: ", response);

        if (response && response.classesByDay) {
  
        setClassesByDay(response.classesByDay);
        setMondayOfThisWeek(response.mondayOfThisWeek);
        setDateOfMonday(response.dateOfMonday);
        setDateOfSunday(response.dateOfSunday);}
        else {
          throw new Error("Invalid data structure from API.")
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setError("Failed to fetch classes");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []); // Fetch classes whenever date range changes

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Create an array of days for rendering
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // Handle navigation to previous and next weeks
  const navigateToWeek = (direction) => {
    const currentMonday = new Date(dateOfMonday);
    const newMonday = direction === "next" 
      ? new Date(currentMonday.setDate(currentMonday.getDate() + 7))
      : new Date(currentMonday.setDate(currentMonday.getDate() - 7));
    
    const newDateOfMonday = new Date(newMonday);
    const newDateOfSunday = new Date(newMonday);
    newDateOfSunday.setDate(newDateOfSunday.getDate() + 6);

    const newStartDate = formatDate(newDateOfMonday);
    const newEndDate = formatDate(newDateOfSunday);

    navigate(`/classes/${newStartDate}-${newEndDate}`);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <PageLayout>
      <section className="classes-container p-4">
        <h2 className="text-2xl font-bold mb-4">Classes Timetable</h2>
        <p id="class-timetable">
          From <span className="class-date">{dateOfMonday}</span> to{" "}
          <span className="class-date">{dateOfSunday}</span>
        </p>
        <div className="mb-4">
          <button onClick={() => navigateToWeek("previous")}>Previous Week</button>
          <button onClick={() => navigateToWeek("next")}>Next Week</button>
        </div>
        {daysOfWeek.map((day) => (
          <div key={day}>
            <h3 className="day-of-class text-xl font-semibold mt-6">{day}</h3>
            {classesByDay[day]?.length > 0 ? (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {classesByDay[day].map((gymClass) => (
                  <ClassCard key={gymClass.id} gymClass={gymClass} userRole={userRole} userID={userID}/>
                ))}
              </section>
            ) : (
              <p>No classes on this day</p>
            )}
          </div>
        ))}
      </section>
    </PageLayout>
  );
};

export default ClassListPage;



// // ****************** The following ClassListPage.jsx works fine. it shows the current week classes

// import React, { useState, useEffect } from "react";
// import ClassCard from "./ClassCard";
// import PageLayout from "../../common/PageLayout";

// import * as Classes from "../../api/classes";
// import { useAuthentication } from "../authentication"; // Import the API functions for fetching classes

// const ClassListPage = () => {
//   const [classesByDay, setClassesByDay] = useState({});
//   const [mondayOfThisWeek, setMondayOfThisWeek] = useState(null);
//   const [dateOfMonday, setDateOfMonday] = useState(null);
//   const [dateOfSunday, setDateOfSunday] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [user] = useAuthentication()
//   const userRole = user?.role || '' 
//   const userID = user?.userID || ''
//   console.log("userID: ", userID)

//   useEffect(() => {
//     const fetchClasses = async () => {
//       setLoading(true);
//       try {
//         const data = await Classes.getAll();
//         console.log("fetched classes: ", data)

//         setClassesByDay(data.classesByDay);
//         setMondayOfThisWeek(data.mondayOfThisWeek);
//         setDateOfMonday(data.dateOfMonday);
//         setDateOfSunday(data.dateOfSunday);
//       } catch (error) {
//         console.error("Failed to fetch classes:", error);
//         setError("Failed to fetch classes");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClasses();
//   }, []); // Empty dependency array to run only once on component mount

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="alert alert-danger">{error}</div>;

//   // Create an array of days for rendering
//   const daysOfWeek = [
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//     "Sunday",
//   ];

//   return (
// <PageLayout>
//       <section className="classes-container p-4">
//         <h2 className="text-2xl font-bold mb-4">Classes Timetable</h2>
//         <p id="class-timetable">
//           From <span className="class-date">{dateOfMonday}</span> to{" "}
//           <span className="class-date">{dateOfSunday}</span>
//         </p>

//         {daysOfWeek.map((day) => (
//           <div key={day}>
//             <h3 className="day-of-class text-xl font-semibold mt-6">{day}</h3>
//             {classesByDay[day]?.length > 0 ? (
//               <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
//                 {classesByDay[day].map((gymClass) => (
//                   <ClassCard key={gymClass.id} gymClass={gymClass} userRole={userRole} userID={userID}/>
//                 ))}
//               </section>
//             ) : (
//               <p>No classes on this day</p>
//             )}
//           </div>
//         ))}
//       </section>

//     </PageLayout>
//   );
// };

// export default ClassListPage;
