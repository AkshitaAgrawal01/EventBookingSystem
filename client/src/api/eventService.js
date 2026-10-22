import axiosInstance from "./axiosInstance";

export const getEvents = async (params = {}) => {
  const response = await axiosInstance.get("/events", { params });
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