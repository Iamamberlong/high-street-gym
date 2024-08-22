import React, { useState, useEffect } from "react";
import ActivityCard from "./ActivityCard";
import Header from "../../common/Header";
import Footer from "../../common/Footer";
import * as Activities from "../../api/activities"; 
import { XMLUploader } from "../xml/XMLUploader"
import { useAuthentication } from "../authentication";

const ActivityListPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [user] = useAuthentication()

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const activities = await Activities.getAll();
        setActivities(activities)

        console.log("Fetched data is: ", activities)
      } catch (error) {
        console.error("Failed to fetch activities:", error);
        setError("Failed to fetch activities");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []); // Empty dependency array to run only once on component mount

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  // Create an array of days for rendering

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <section className="my-8 grid grid-cols-1 gap-6">
      <h2 className="text-3xl font-bold text-center mb-6">Our Activities</h2>
      <div className="grid grid-cols-1 gap-6">
        
        {activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            name={activity.activity_name}
            description={activity.activity_description}
          />
        ))}
      </div>
    </section>
    { user && user.role == "admin" && (
    <div className="rounded border-2 border-primary  min-h-16 p-2">
                <h2 className="text-center">Upload Activities</h2>
                <XMLUploader uploadUrl={"/activities/upload-xml"} onUploadSuccess={() => {
                    Activities.getAll().then(activities => setActivities(activities))
                }} />
            </div>)}
      <Footer />
    </main>
  );
};

export default ActivityListPage;
