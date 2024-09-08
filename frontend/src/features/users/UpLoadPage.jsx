import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";
import * as Users from "../../api/users";
import { UserCircleIcon } from "@heroicons/react/solid";
import validator from "validator";
import PageLayout from "../../common/PageLayout";
import * as Locations from "../../api/locations.js"
import * as Activities from "../../api/activities.js"
import { XMLUploader } from "../xml/XMLUploader";

export default function UpLoadPage() {
    const [locations, setLocations] = useState([])
    const [activities, setActivities] = useState([])

    useEffect(() => {
        Locations.getAll().then(locations => setLocations(locations))
    }, [])
  return (
    <PageLayout>
        <div className="container p-2 mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="rounded border-2 border-primary p-2">
                <h2 className="text-center">All Locations</h2>
                <div className="overflow-x-auto">
                    <table className="table table-compact w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Contact Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map(location =>
                                <tr key={location.id}>
                                    <td>{location.id}</td>
                                    <td>{location.name}</td>
                                    <td>{location.address}</td>
                                    <td>{location.contactNumber}</td>

                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
      <div>
        <h2 className="text-center text-xl font-bold mb-4">Upload Locations</h2>
        <XMLUploader
          uploadUrl={"/upload"} // Update upload URL
          onUploadSuccess={() => {
            Locations.getAll().then((locations) => setLocations(locations)); // Refresh locations on upload success
          }}
        />
      </div>

      <div className="container p-2 mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="rounded border-2 border-primary p-2">
                <h2 className="text-center">All Activities</h2>
                <div className="overflow-x-auto">
                    <table className="table table-compact w-full">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map(activity=>
                                <tr key={activity.id}>
                                    <td>{activity.id}</td>
                                    <td>{activity.name}</td>
                                    <td>{activity.description}</td>
                                    <td>{activity.duration}</td>

                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>

      <div>
        <h2 className="text-center text-xl font-bold mb-4">Upload Activities</h2>
        <XMLUploader
          uploadUrl={"/upload"}
          onUploadSuccess={() => {
            Activities.getAll().then((activities) => setActivities(activities));
          }}
        />
      </div>
    </PageLayout>
  );
}
