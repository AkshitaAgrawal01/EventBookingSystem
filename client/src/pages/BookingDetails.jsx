import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBookingById, createCheckoutSession } from "../api/bookingService";
import { formatDate, formatDateTime, cancelReasonText } from "../utils/bookingText";

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setBooking(await getBookingById(id));
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this booking");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);
  useEffect(() => {
  const handlePageShow = (e) => {
    if (e.persisted) setPaying(false);
  };
  window.addEventListener("pageshow", handlePageShow);
  return () => window.removeEventListener("pageshow", handlePageShow);
}, []);

  const handlePayNow = async () => {
    setPaying(true);
    setPayError("");
    try {
      const { checkoutUrl } = await createCheckoutSession(booking._id);
      window.location.href = checkoutUrl;
    } catch (err) {
      setPayError(err.response?.data?.message || "Could not start payment");
      setPaying(false);
    }
  };

  if (loading) return <p>Loading booking...</p>;
  if (error) return <p className="error">{error}</p>;

  const event = booking.event;
  const isExpired = new Date(booking.expiresAt) < new Date();

  let note = null;
  if (booking.status === "paid") {
    note = <p className="note good">Payment received. Your tickets are confirmed.</p>;
  } else if (booking.status === "pending" && isExpired) {
    note = <p className="note bad">The payment window has ended. This booking will be cancelled shortly.</p>;
  } else if (booking.status === "pending") {
    note = <p className="note">Pay before {formatDateTime(booking.expiresAt)} to keep your tickets.</p>;
  } else if (booking.status === "cancelled") {
    note = <p className="note bad">{cancelReasonText(booking)}</p>;
  }

  return (
    <div className={`card detail status-${booking.status}`}>
      <div className="row">
        <h1>{event ? event.title : "Event no longer available"}</h1>
        <strong className={`badge ${booking.status}`}>{booking.status}</strong>
      </div>

      {note}

      <dl className="facts">
        {event && (
          <>
            <dt>Venue</dt>
            <dd>{event.venue}</dd>
            <dt>Event date</dt>
            <dd>{formatDate(event.date)}</dd>
            <dt>Organizer</dt>
            <dd>{event.organizer?.name}</dd>
          </>
        )}
        <dt>Tickets</dt>
        <dd>{booking.quantity}</dd>
        {event && (
          <>
            <dt>Total</dt>
            <dd>₹{event.price * booking.quantity}</dd>
          </>
        )}
        <dt>Booked on</dt>
        <dd>{formatDateTime(booking.createdAt)}</dd>
        {booking.cancelledAt && (
          <>
            <dt>Cancelled on</dt>
            <dd>{formatDateTime(booking.cancelledAt)}</dd>
          </>
        )}
      </dl>

      {payError && <p className="error">{payError}</p>}

      <div className="actions">
        {booking.status === "pending" && !isExpired && (
          <button onClick={handlePayNow} disabled={paying}>
            {paying ? "Redirecting..." : "Pay now"}
          </button>
        )}
        {booking.status === "cancelled" && event && (
          <Link className="btn" to={`/events/${event._id}`}>Book again</Link>
        )}
        <Link to="/my-bookings">Back to my bookings</Link>
      </div>
    </div>
  );
}

export default BookingDetails;