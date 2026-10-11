import { Link } from "react-router-dom";

function BookingCancelled() {
  return (
    <div className="card narrow">
      <h1>Payment cancelled</h1>
      <p>You haven't been charged. Your booking is saved as pending.</p>
      <p>You can complete payment any time from My bookings.</p>
      <Link className="btn" to="/my-bookings">Go to My bookings</Link>
    </div>
  );
}

export default BookingCancelled;