
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import VenueDetail from "./pages/VenueDetail";
import Matches from "./pages/Matches";
import Bookings from "./pages/Bookings";
import Venues from "./pages/Venues";
import RequestVenue from "./pages/RequestVenue";
import Messages from "./pages/Messages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/venue/:id",
        element: <VenueDetail />,
      },
      {
        path: "/matches",
        element: <Matches />,
      },
      {
        path: "/bookings",
        element: <Bookings />,
      },
      {
        path: "/venues",
        element: <Venues />,
      },
      {
        path: "/venue-request",
        element: <RequestVenue />,
      },
      {
        path: "/messages",
        element: <Messages />
      },
    ],
  },
]);

function Router() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default Router;
