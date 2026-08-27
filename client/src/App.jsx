import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Search from "./pages/Search";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ListingDetails from "./pages/ListingDetails";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import CreateProperty from "./pages/CreateProperty";
import CreateListing from "./pages/CreateListing";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import EditProperty from "./pages/EditProperty";

import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/search"
          element={<Search />}
        />

        <Route
          path="/sign-in"
          element={<SignIn />}
        />

        <Route
          path="/sign-up"
          element={<SignUp />}
        />

        <Route
          path="/properties"
          element={<Properties />}
        />

        <Route
          path="/properties/:id"
          element={<PropertyDetails />}
        />

        <Route
          path="/listing/:id"
          element={<ListingDetails />}
        />

        {/* ================= PROTECTED ================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/profile/edit"
            element={<EditProfile />}
          />

          <Route
            path="/create-listing"
            element={<CreateListing />}
          />

          <Route
            path="/property/create"
            element={<CreateProperty />}
          />

          <Route
            path="/properties/edit/:id"
            element={<EditProperty />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}