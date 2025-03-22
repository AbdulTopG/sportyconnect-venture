import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./pages/App";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Venue from "./pages/Venue";
import Matches from "./pages/Matches";
import Bookings from "./pages/Bookings";
import Venues from "./pages/Venues";
import VenueRequest from "./pages/VenueRequest";
import Messages from "./pages/Messages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/venue/:id",
        element: <Venue />,
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
        element: <VenueRequest />,
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
