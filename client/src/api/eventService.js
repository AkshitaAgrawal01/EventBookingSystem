import axiosInstance from "./axiosInstance";

export const getEvents = async () => {
  const response = await axiosInstance.get("/events");
  return response.data;
};

export const getEventById = async (id) => {
  const response = await axiosInstance.get(`/events/${id}`);
  return response.data;
};
export const createEvent = async (eventData) => {
  const response = await axiosInstance.post("/events", eventData);
  return response.data;
};