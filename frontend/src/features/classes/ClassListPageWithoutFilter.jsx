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
          <p id="class-timetable" className="text-center">
            From{" "}
            <span className="class-date text-center text-blue-500">
              {dateOfMonday}
            </span>{" "}
            to <span className="class-date text-blue-500">{dateOfSunday}</span>
          </p>
        </div>

        {/* List Classes for Each Day */}
        {daysOfWeek.map((day) => {
          const classesForDay = classesByDay[day] || [];

          return (
            <div key={day}>
              <h3 className="day-of-class text-xl font-semibold mt-6">{day}</h3>
              {classesForDay.length > 0 ? (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {classesForDay.map((gymClass) => (
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
