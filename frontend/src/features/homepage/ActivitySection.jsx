import React, { useEffect, useState } from 'react';
import * as Activities from '../../api/activities'; // Adjust the import based on your project structure

const ActivitySection = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


//   useEffect(() => {
//       Activities.getAll().then(activities => setActivities(activities))
//   }, []) 

useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await Activities.getAll();
        console.log('Activities Data:', data); // Log data to verify it is an array
        if (Array.isArray(data)) { // Check if data is an array
          setActivities(data);
        } else {
          throw new Error('Data is not an array');
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to fetch activities');
      } 

    };

    fetchActivities();
  }, []); 

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error) {
//     return <div>Error: {error}</div>;
//   }

  return (
    
  );
};

const ActivityCard = ({ name, description }) => {
  return (
    <div className="card shadow-lg rounded-lg p-4">
      <h3 className="text-xl font-semibold">{name}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ActivitySection;
