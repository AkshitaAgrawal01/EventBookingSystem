import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById } from "../api/eventService";
import { createBooking, createCheckoutSession } from "../api/bookingService";
import { useAuth } from "../context/AuthContext";

function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (quantity < 1 || quantity > event.ticketsRemaining) {
      setBookingError(`Choose between 1 and ${event.ticketsRemaining} tickets`);
      return;
    }

    setBookingError("");
    setSubmitting(true);

    try {
      const booking = await createBooking(id, quantity);
      const { checkoutUrl } = await createCheckoutSession(booking._id);
      window.location.href = checkoutUrl;
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed");
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const soldOut = event.ticketsRemaining === 0;

return (
  <div className="card detail">
    <h1>{event.title}</h1>
    <p>{event.description}</p>
    <p className="muted">{event.venue}</p>
    <p className="muted">
      {new Date(event.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
    </p>
    <p className="muted">Organized by {event.organizer?.name}</p>

    <div className="row">
      <span className="price">₹{event.price}</span>
      <span className="muted">
        {soldOut ? "Sold out" : `${event.ticketsRemaining} tickets left`}
      </span>
    </div>

    {!soldOut && (
      <>
        <label>
          Tickets
          <input
            type="number"
            min="1"
            max={event.ticketsRemaining}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
        <p>Total: ₹{event.price * quantity}</p>
        {bookingError && <p className="error">{bookingError}</p>}
        <button onClick={handleBook} disabled={submitting}>
          {submitting ? "Redirecting to payment..." : "Book now"}
        </button>
      </>
    )}
  </div>
);
}

export default EventDetails;