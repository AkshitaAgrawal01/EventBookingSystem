import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../api/eventService";

function CreateEvent() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    date: "",
    price: "",
    totalCapacity: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const price = Number(form.price);
    const totalCapacity = Number(form.totalCapacity);

    if (price < 0 || Number.isNaN(price)) {
      setError("Price must be 0 or more");
      return;
    }
    if (!Number.isInteger(totalCapacity) || totalCapacity < 1) {
      setError("Capacity must be a whole number, at least 1");
      return;
    }
    if (new Date(form.date) <= new Date()) {
      setError("Event date must be in the future");
      return;
    }

    setSubmitting(true);

    try {
      const event = await createEvent({ ...form, price, totalCapacity });
      navigate(`/events/${event._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create event");
      setSubmitting(false);
    }
  };

  return (
  <form onSubmit={handleSubmit}>
    <h1>Create event</h1>
    {error && <p className="error">{error}</p>}

    <label>
      Title
      <input name="title" value={form.title} onChange={handleChange} required />
    </label>

    <label>
      Description
      <textarea name="description" value={form.description} onChange={handleChange} required />
    </label>

    <label>
      Venue
      <input name="venue" value={form.venue} onChange={handleChange} required />
    </label>

    <label>
      Date
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
    </label>

    <label>
      Price per ticket (₹)
      <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
    </label>

    <label>
      Total tickets
      <input
        name="totalCapacity"
        type="number"
        min="1"
        step="1"
        value={form.totalCapacity}
        onChange={handleChange}
        required
      />
    </label>

    <button type="submit" disabled={submitting}>
      {submitting ? "Creating..." : "Create event"}
    </button>
  </form>
);
}

export default CreateEvent;