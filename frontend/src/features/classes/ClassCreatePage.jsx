import { useEffect, useState } from "react";
import * as Activities from "../../api/activities";
import * as Locations from "../../api/locations";
import * as GymClasses from "../../api/classes";

import { useAuthentication } from "../authentication";

export default function Add({ onAdded }) {
  const [user, login, logout] = useAuthentication();

  const [formData, setFormData] = useState({
    activity_id: "",
    location_id: "",
    gymClass_date: "",
    gymClass_time: "",
    gymClass_trainer: user.role === "trainer" ? user.name : "", 
  });
  const [statusMessage, setStatusMessage] = useState("");

  // Load activities
  const [activities, setActivities] = useState([]);
  useEffect(() => {
    Activities.getAll().then((activities) => setActivities(activities));
  }, []);

  // Load locations
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    Locations.getAll().then((locations) => setTrails(locations));
  }, []);

  // generateTimeOptions function
  const generateTimeOptions = () => {
    const times = []; // `times` is not reassigned, only its contents change
    let currentHour = 8; // `currentHour` changes in each iteration

    while (currentHour <= 20) {
      const hour = currentHour % 12 === 0 ? 12 : currentHour % 12;
      const amPm = currentHour < 12 ? "AM" : "PM";
      const timeString = `${hour}:00 ${amPm}`;
      times.push(timeString);
      currentHour += 1;
    }

    return times;
  };

  function addGymClass(e) {
    e.preventDefault();
    setStatusMessage("Creating a gym class...");

    // Add user_id to the sighting object before sending
    const gymClassData = {
      ...formData,
      user_id: user.id,
    };

    GymClasses.create(gymClassData, token).then((result) => {
      setStatusMessage(result.message);
      setFormData({
        activity_id: "",
        location_id: "",
        gymClass_date: "",
        gymClass_time: "",
        gymClass_trainer: user.role === "trainer" ? user.name : "", 
      });

      if (typeof onAdded === "function") {
        onAdded();
      }
    });
  }

  return (
    <div>
      <form className="flex-grow m-4 max-w-2xl" onSubmit={addGymClass}>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Gym Class</span>
          </label>
          <select
            className="select select-bordered"
            value={formData.activity_id}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, activity_id: e.target.value };
              })
            }
          >
            <option value="" disabled>
              Select Activity
            </option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <select
            className="select select-bordered"
            value={formData.location_id}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, location_id: e.target.value };
              })
            }
          >
            <option value="" disabled>
              Select Location
            </option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Date of sighting</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={formData.date}
            onChange={(e) =>
              setFormData((existing) => {
                return { ...existing, date: e.target.value };
              })
            }
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Time of Gym Class</span>
          </label>
          <select
            className="select select-bordered"
            value={formData.gymClass_time}
            onChange={(e) =>
              setFormData((existing) => ({
                ...existing,
                gymClass_time: e.target.value,
              }))
            }
          >
            <option value="" disabled>
              Select Time
            </option>
            {generateTimeOptions().map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Trainer</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={formData.gymClass_trainer}
            readOnly={user.role === "trainer"} // Make it read-only if the user is a trainer
          />
        </div>
        <div className="my-2">
          <button className="btn btn-primary mr-2">Add</button>
          <label className="label">
            <span className="label-text-alt">{statusMessage}</span>
          </label>
        </div>
      </form>
    </div>
  );
}
