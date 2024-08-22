// import { useEffect, useState } from "react";
// import * as Locations from "../../api/locations"; // Update import to locations API
// import Header from "../../common/Header";
// import Footer from "../../common/Footer"
// import { XMLUploader } from "../xml/XMLUploader";
// import { useAuthentication } from "../authentication";
// import LocationCard from "./LocationCard";

// export default function LocationListPage() {
//     const [locations, setLocations] = useState([]); // State for locations
//     const [user] = useAuthentication(); // Get user info from authentication hook

//     useEffect(() => {
//         Locations.getAll().then(locations => setLocations(locations)); // Fetch locations
//     }, []);

//     // Check if the user is an admin
//     const isAdmin = user && user.role === "admin";

//     return (
//         <>
//             <Header />
//             <div className="container p-2 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 <div className="rounded border-2 border-primary p-2">
//                     <h2 className="text-center text-xl font-bold mb-4">All Locations</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {locations.map(location => (
//                             <LocationCard
//                                 key={location.id}
//                                 name={location.name}
//                                 address={location.address}
//                                 contactNumber={location.contactNumber}
//                             />
//                         ))}
//                     </div>
//                 </div>
//                 {isAdmin && ( // Conditionally render based on user role
//                     <div className="rounded border-2 border-primary min-h-16 p-2">
//                         <h2 className="text-center text-xl font-bold mb-4">Upload Locations</h2>
//                         <XMLUploader
//                             uploadUrl={"/locations/upload-xml"} // Update upload URL
//                             onUploadSuccess={() => {
//                                 Locations.getAll().then(locations => setLocations(locations)); // Refresh locations on upload success
//                             }}
//                         />
//                     </div>
//                 )}
//             </div>
//             <Footer />
//         </>
//     );
// }


import { useEffect, useState } from "react";
import * as Locations from "../../api/locations"; // Update import to locations API
import Header from "../../common/Header";
import Footer from "../../common/Footer"
import { XMLUploader } from "../xml/XMLUploader";
import { useAuthentication } from "../authentication";
import LocationCard from "./LocationCard";

export default function LocationListPage() {
    const [locations, setLocations] = useState([]); // State for locations
    const [user] = useAuthentication(); // Get user info from authentication hook

    useEffect(() => {
        Locations.getAll().then(locations => setLocations(locations)); // Fetch locations
    }, []);

    // Check if the user is an admin
    const isAdmin = user && user.role === "admin";

    return (
        <>
            <Header />
            <div className="container mx-auto p-4">
                <h2 className="text-center text-2xl font-bold mb-6">All Locations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map(location => (
                        <LocationCard
                            key={location.id}
                            name={location.name}
                            address={location.address}
                            contactNumber={location.contactNumber}
                        />
                    ))}
                </div>
                {isAdmin && ( // Conditionally render based on user role
                    <div className="rounded border-2 border-primary mt-8 p-4">
                        <h2 className="text-center text-xl font-bold mb-4">Upload Locations</h2>
                        <XMLUploader
                            uploadUrl={"/locations/upload-xml"} // Update upload URL
                            onUploadSuccess={() => {
                                Locations.getAll().then(locations => setLocations(locations)); // Refresh locations on upload success
                            }}
                        />
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
