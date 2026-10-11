import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getEvents } from "../api/eventService";

function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load events");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
  <div>
    <h1>Upcoming events</h1>
    <p className="muted">Choose an event, pick your tickets, and pay securely.</p>

    {events.length === 0 && <p>No upcoming events yet.</p>}

    <div className="grid">
      {events.map((event) => (
        <article className="card" key={event._id}>
          <h2>{event.title}</h2>
          <p className="muted">{event.venue}</p>
          <p className="muted">
            {new Date(event.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
          </p>
          <div className="row">
            <span className="price">₹{event.price}</span>
            <span className="muted">
              {event.ticketsRemaining === 0 ? "Sold out" : `${event.ticketsRemaining} left`}
            </span>
          </div>
          <Link className="btn" to={`/events/${event._id}`}>View details</Link>
        </article>
      ))}
    </div>
  </div>
);
}

export default BrowseEvents;