import { useEffect, useState } from "react";
import * as Bookings from "../../api/bookings";
import Nav from "../../common/Nav";
import { XMLUploader } from "../xml/XMLUploader";
import { RestrictedRoute } from "../../common/RestrictedRoute";
import { useAuthentication } from "../authentication";

export default function BookingListPage() {
    const [bookings, setBookings] = useState([]);
    const [user] = useAuthentication();

    useEffect(() => {
        Bookings.getAll().then(bookings => setBookings(bookings));
    }, []);

    // Check if user is admin
    const isAdmin = user && user.role === "admin";

    return (
        <RestrictedRoute allowedRoles={['admin']}>
            <Nav />
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
    );
}
