import axiosInstance from "./axiosInstance";

export const createBooking = async (eventId, quantity) => {
  const response = await axiosInstance.post("/bookings", { eventId, quantity });
  return response.data;
};

export const createCheckoutSession = async (bookingId) => {
  const response = await axiosInstance.post(`/bookings/checkout/${bookingId}`);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await axiosInstance.get("/bookings/my-bookings");
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await axiosInstance.get(`/bookings/${id}`);
  return response.data;
};