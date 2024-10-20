import { useEffect, useState } from "react";
import * as Bookings from "../../api/bookings";
import PageLayout from "../../common/PageLayout";
import { XMLUploader } from "../xml/XMLUploader";
import { RestrictedRoute } from "../../common/RestrictedRoute";
import { useAuthentication } from "../authentication";

export default function BookingListPage() {
    const [bookings, setBookings] = useState([]);
    const [user] = useAuthentication();

    // useEffect(() => {
    //     Bookings.getAll().then(bookings => setBookings(bookings));
    // }, []);
    useEffect(() => {
        Bookings.getAll().then(fetchedBookings => {
            // Get today's date in 'YYYY-MM-DD' format
            const today = new Date().toISOString().split('T')[0];
            
            // Filter bookings to include only today's and future bookings
            const filteredBookings = fetchedBookings.filter(booking => {
                // Extract the date part and convert it to 'YYYY-MM-DD' format
                const [day, month, year] = booking.booking_created_datetime.split(', ')[0].split('/');
                const bookingDate = `${year}-${month}-${day}`; // Format to 'YYYY-MM-DD'
                console.log('bookingDate: ', bookingDate)
                return bookingDate >= today; // Compare dates
            });
            
            setBookings(filteredBookings);
            console.log("bookings: ", bookings) // Set the filtered bookings
        });
    }, []);
    

    // Check if user is admin
    const isAdmin = user && user.role === "admin";

    return (
        <PageLayout>
        <RestrictedRoute allowedRoles={['admin']}>
            
            <div className="container p-2 mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="rounded border-2 border-primary p-2">
                    <h2 className="text-center">All Bookings</h2>
                    <div className="overflow-x-auto">
                        <table className="table table-compact w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User ID</th>
                                    <th>Class ID</th>
                                    <th>Created Datetime</th>
                                    <th>Removed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(booking => (
                                    <tr key={booking.booking_id}>
                                        <td>{booking.booking_id}</td>
                                        <td>{booking.booking_user_id}</td>
                                        <td>{booking.booking_class_id}</td>
                                        <td>{booking.booking_created_datetime}</td>
                                        {/* <td>{booking.booking_removed ? "Yes" : "No"}</td> */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {isAdmin && (
                    <div className="rounded border-2 border-primary min-h-16 p-2">
                        <h2 className="text-center">Upload Bookings</h2>
                        <XMLUploader
                            uploadUrl={"/bookings/upload-xml"}
                            onUploadSuccess={() => {
                                Bookings.getAll().then(bookings => setBookings(bookings));
                            }}
                        />
                    </div>
                )}
            </div>
           
        </RestrictedRoute>
        </PageLayout>
    );
}
