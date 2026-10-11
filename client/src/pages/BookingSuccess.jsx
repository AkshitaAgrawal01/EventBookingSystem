import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getMyBookings } from "../api/bookingService";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 10;

function BookingSuccess() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [status, setStatus] = useState("checking"); // checking | paid | timeout | error

  useEffect(() => {
    if (!bookingId) {
      setStatus("error");
      return;
    }

    let attempts = 0;
    let cancelled = false;
    let timerId;

    const check = async () => {
      attempts += 1;

      try {
        const bookings = await getMyBookings();
        const booking = bookings.find((b) => b._id === bookingId);

        if (cancelled) return;

        if (booking && booking.status === "paid") {
          setStatus("paid");
          return;
        }
      } catch (err) {
        // A failed check is not a failed payment. Ignore it and try again.
      }

      if (cancelled) return;

      if (attempts >= MAX_ATTEMPTS) {
        setStatus("timeout");
      } else {
        timerId = setTimeout(check, POLL_INTERVAL_MS);
      }
    };

    check();

    return () => {
      cancelled = true;
      clearTimeout(timerId);
    };
  }, [bookingId]);

  if (status === "checking") {
    return (
      <div className="card narrow">
        <h1>Confirming your payment...</h1>
        <p>This usually takes a few seconds. Please keep this page open.</p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="card narrow">
        <h1>Payment successful</h1>
        <p>Your booking is confirmed.</p>
        <Link to="/my-bookings">View My Bookings</Link>
      </div>
    );
  }

  if (status === "timeout") {
    return (
      <div className="card narrow">
        <h1>Still confirming...</h1>
        <p>
          We haven't received confirmation yet. If you were charged, your booking
          will update shortly. Check My Bookings in a minute.
        </p>
        <Link to="/my-bookings">Go to My Bookings</Link>
      </div>
    );
  }

  return (
    <div className="card narrow">
      <h1>Something went wrong</h1>
      <p>We couldn't find the booking details in this link.</p>
      <Link to="/my-bookings">Go to My Bookings</Link>
    </div>
  );
}

export default BookingSuccess;