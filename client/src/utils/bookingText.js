const DATE = { day: "numeric", month: "short", year: "numeric" };
const DATE_TIME = { ...DATE, hour: "numeric", minute: "2-digit" };

export const formatDate = (value) => new Date(value).toLocaleDateString(undefined, DATE);
export const formatDateTime = (value) => new Date(value).toLocaleString(undefined, DATE_TIME);

// Bookings cancelled before this field existed have no stored reason.
// Expiry was the only way to cancel then, so it is the fallback.
const REASONS = {
  expired:
    "Payment wasn't completed in time, so the tickets were released. You can book again if tickets are still available.",
};

export const cancelReasonText = (booking) => REASONS[booking.cancelReason] || REASONS.expired;