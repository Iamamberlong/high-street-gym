// ClassSelectionPage.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as Classes from "../../api/classes"; // Adjust this import based on your API structure
import { useAuthentication } from "../authentication";

const ClassSelectionPage = () => {
  const { classType } = useParams(); // Get class type from URL
  const [availableClasses, setAvailableClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [user] = useAuthentication();

  useEffect(() => {
    const fetchAvailableClasses = async () => {
      setLoading(true);
      try {
        const response = await Classes.getAvailableByType(classType); // Fetch available classes by type
        setAvailableClasses(response.classes); // Assuming this returns classes with available times, trainers, and locations
      } catch (error) {
        console.error("Failed to fetch available classes:", error);
        setError("Failed to fetch available classes");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableClasses();
  }, [classType]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  const handleBooking = () => {
    // Handle booking logic here
  };

  return (
    <div>
      <h2>{classType} Classes</h2>
      <form onSubmit={handleBooking}>
        <div>
          <label htmlFor="time">Select Time</label>
          <select id="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)}>
            <option value="">Select Time</option>
            {/* Map available times here */}
            {availableClasses.map((gymClass) => (
              <option key={gymClass.id} value={gymClass.time}>
                {gymClass.time}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="trainer">Select Trainer</label>
          <select id="trainer" value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)}>
            <option value="">Select Trainer</option>
            {/* Map available trainers here */}
            {availableClasses.map((gymClass) => (
              <option key={gymClass.trainer.id} value={gymClass.trainer.id}>
                {gymClass.trainer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location">Select Location</label>
          <select id="location" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">Select Location</option>
            {/* Map available locations here */}
            {availableClasses.map((gymClass) => (
              <option key={gymClass.location.id} value={gymClass.location.id}>
                {gymClass.location.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Book Class</button>
      </form>
    </div>
  );
};

export default ClassSelectionPage;
