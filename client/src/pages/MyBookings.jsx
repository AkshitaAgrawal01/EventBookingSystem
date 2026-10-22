import { useState, useEffect } from "react";
import { getMyBookings, createCheckoutSession } from "../api/bookingService";
import { Link } from "react-router-dom";
import { formatDate, cancelReasonText } from "../utils/bookingText";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getMyBookings();
        const newestFirst = [...data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBookings(newestFirst);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
  const handlePageShow = (e) => {
    if (e.persisted) setPayingId(null);
  };
  window.addEventListener("pageshow", handlePageShow);
  return () => window.removeEventListener("pageshow", handlePageShow);
}, []);

  const handlePayNow = async (bookingId) => {
    setPayingId(bookingId);
    setError("");
    try {
      const { checkoutUrl } = await createCheckoutSession(bookingId);
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err.response?.data?.message || "Could not start payment");
      setPayingId(null);
    }
  };

  if (loading) return <p>Loading bookings...</p>;

return (
  <div>
    <h1>My bookings</h1>
    {error && <p className="error">{error}</p>}
    {bookings.length === 0 && <p>You haven't booked anything yet.</p>}

    <div className="stack">
      {bookings.map((booking) => (
        <article className={`card booking-card status-${booking.status}`} key={booking._id}>
          <div className="row">
            <h2>
              <Link className="stretched" to={`/my-bookings/${booking._id}`}>
                {booking.event?.title || "Event no longer available"}
              </Link>
            </h2>
            <strong className={`badge ${booking.status}`}>{booking.status}</strong>
          </div>

          {booking.event && (
            <p className="muted">
              {booking.event.venue}, {formatDate(booking.event.date)}
            </p>
          )}

          <p>
            {booking.quantity} {booking.quantity === 1 ? "ticket" : "tickets"}
            {booking.event && `, ₹${booking.event.price * booking.quantity} total`}
          </p>

          {booking.status === "cancelled" && (
            <p className="note bad">{cancelReasonText(booking)}</p>
          )}

          {booking.status === "pending" && (
            <button
              onClick={() => handlePayNow(booking._id)}
              disabled={payingId === booking._id}
            >
              {payingId === booking._id ? "Redirecting..." : "Pay now"}
            </button>
          )}
        </article>
      ))}
    </div>
  </div>
);
}

export default MyBookings;