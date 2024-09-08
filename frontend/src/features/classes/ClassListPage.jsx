import React, { useState, useEffect } from "react";
import ClassCard from "./ClassCard";
import PageLayout from "../../common/PageLayout";
import * as Classes from "../../api/classes";
import { useAuthentication } from "../authentication";

const ClassListPage = () => {
  const [classesByDay, setClassesByDay] = useState({});
  const [mondayOfThisWeek, setMondayOfThisWeek] = useState(null);
  const [dateOfMonday, setDateOfMonday] = useState(null);
  const [dateOfSunday, setDateOfSunday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthentication();
  const userRole = user?.role || "";
  const userID = user?.userID || "";

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Dropdown options
  const [locations, setLocations] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch classes
        const classesData = await Classes.getAll();
        console.log("Fetched classes data: ", classesData);

        setClassesByDay(classesData.classesByDay);
        setMondayOfThisWeek(classesData.mondayOfThisWeek);
        setDateOfMonday(classesData.dateOfMonday);
        setDateOfSunday(classesData.dateOfSunday);

        // Extract unique filter values
        const allClasses = Object.values(classesData.classesByDay).flat();

        // Locations
        const uniqueLocations = [
          ...new Set(
            allClasses.map((cls) => cls.location_name).filter(Boolean)
          ),
        ];
        setLocations(uniqueLocations);

        // Trainers
        const uniqueTrainers = [
          ...new Set(
            allClasses
              .map((cls) => `${cls.user_firstname} ${cls.user_lastname}`)
              .filter(Boolean)
          ),
        ];
        setTrainers(uniqueTrainers);

        // Times (Extract start times from class_datetime and sort them)
        const uniqueTimes = [
          ...new Set(
            allClasses
              .map((cls) => {
                const date = new Date(cls.class_datetime);
                return date.toTimeString().split(" ")[0]; // Extract time part (e.g., "13:00:00")
              })
              .filter(Boolean)
          ),
        ];

        // Sort times in ascending order
        uniqueTimes.sort((a, b) => {
          const [hoursA, minutesA, secondsA] = a.split(":").map(Number);
          const [hoursB, minutesB, secondsB] = b.split(":").map(Number);
          return hoursA - hoursB || minutesA - minutesB || secondsA - secondsB;
        });

        setTimes(uniqueTimes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run only once on component mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Apply filters
  const applyFilters = (classes) => {
    return classes.filter(
      (gymClass) =>
        (selectedLocation === "" ||
          gymClass.location_name === selectedLocation) &&
        (selectedTrainer === "" ||
          `${gymClass.user_firstname} ${gymClass.user_lastname}` ===
            selectedTrainer) &&
        (selectedTime === "" ||
          new Date(gymClass.class_datetime).toTimeString().split(" ")[0] ===
            selectedTime)
    );
  };

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

  return (
    <PageLayout>
      <section className="classes-container p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Classes Timetable
        </h2>
        <div className="flex justify-center">
          <p id="class-timetable text-center">
            From{" "}
            <span className="class-date text-center text-blue-500">
              {dateOfMonday}
            </span>{" "}
            to <span className="class-date text-blue-500">{dateOfSunday}</span>
          </p>
        </div>

        {/* Filter Controls */}
        <div className="filters mb-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <div className="flex flex-col w-full sm:w-1/3">
            <label>
              Location:
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.length > 0 ? (
                  locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))
                ) : (
                  <option value="">No Locations Available</option>
                )}
              </select>
            </label>

            <label>
              Trainer:
              <select
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
              >
                <option value="">All Trainers</option>
                {trainers.length > 0 ? (
                  trainers.map((trainer) => (
                    <option key={trainer} value={trainer}>
                      {trainer}
                    </option>
                  ))
                ) : (
                  <option value="">No Trainers Available</option>
                )}
              </select>
            </label>

            <label>
              Time:
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Any Time</option>
                {times.length > 0 ? (
                  times.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))
                ) : (
                  <option value="">No Times Available</option>
                )}
              </select>
            </label>
          </div>
        </div>

        {/* Filtered Classes */}
        {daysOfWeek.map((day) => {
          const classesForDay = classesByDay[day] || [];
          const filteredClasses = applyFilters(classesForDay);

          return (
            <div key={day}>
              <h3 className="day-of-class text-xl font-semibold mt-6">{day}</h3>
              {filteredClasses.length > 0 ? (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {filteredClasses.map((gymClass) => (
                    <ClassCard
                      key={gymClass.id}
                      gymClass={gymClass}
                      userRole={userRole}
                      userID={userID}
                    />
                  ))}
                </section>
              ) : (
                <p>No classes on this day</p>
              )}
            </div>
          );
        })}
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

//   // Filter States
//   const [selectedLocation, setSelectedLocation] = useState('')
//   const [selectTrainer, setSelectedTrainer] = useState('')
//   const [selectedTime, setSelectedTime] = useState('')

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
