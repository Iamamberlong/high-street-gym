import React, { useState, useEffect } from "react";
import ClassCard from "./ClassCard";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import * as Classes from "../../api/classes";
import { useAuthentication } from "../authentication"; // Import the API functions for fetching classes

const ClassListPage = () => {
  const [classesByDay, setClassesByDay] = useState({});
  const [mondayOfThisWeek, setMondayOfThisWeek] = useState(null);
  const [dateOfMonday, setDateOfMonday] = useState(null);
  const [dateOfSunday, setDateOfSunday] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user] = useAuthentication()
  const userRole = user?.role || '' 
  const userID = user?.userID || ''
  console.log("userID: ", userID)

  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const data = await Classes.getAll();
        setClassesByDay(data.classesByDay);
        setMondayOfThisWeek(data.mondayOfThisWeek);
        setDateOfMonday(data.dateOfMonday);
        setDateOfSunday(data.dateOfSunday);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setError("Failed to fetch classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []); // Empty dependency array to run only once on component mount

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

  return (
    <main>
      <Header />
      <section className="classes-container p-4">
        <h2 className="text-2xl font-bold mb-4">Classes Timetable</h2>
        <p id="class-timetable">
          From <span className="class-date">{dateOfMonday}</span> to{" "}
          <span className="class-date">{dateOfSunday}</span>
        </p>

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
      <Footer />
    </main>
  );
};

export default ClassListPage;
