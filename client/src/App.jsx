import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BrowseEvents from "./pages/BrowseEvents";
import EventDetails from "./pages/EventDetails";
import MyBookings from "./pages/MyBookings";
import CreateEvent from "./pages/CreateEvent";
import BookingSuccess from "./pages/BookingSuccess";
import BookingCancelled from "./pages/BookingCancelled";
import ProtectedRoute from "./components/ProtectedRoute";
import BookingDetails from "./pages/BookingDetails";

import { useAuth } from "./context/AuthContext";

function App() {
  const { loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  return (
    <BrowserRouter>
      <Navbar />
      <main className="page">
      <Routes>
        <Route path="/" element={<BrowseEvents />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>}/>
        <Route path="/booking-cancelled" element={<ProtectedRoute><BookingCancelled /></ProtectedRoute>}/>
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>}/>
        <Route path="/my-bookings/:id" element={<ProtectedRoute><BookingDetails /></ProtectedRoute>}/>
        <Route path="/create-event" element={<ProtectedRoute role="organizer"><CreateEvent /></ProtectedRoute>}/>
      </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;