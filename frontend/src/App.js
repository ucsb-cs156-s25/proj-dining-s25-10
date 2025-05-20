import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import MyReviewsIndexPage from "main/pages/MyReviews/MyReviewsIndexPage";
import MenuItemIndexPage from "main/pages/MenuItem/MenuItemIndexPage";
import MealTimesPage from "main/pages/Meal/MealTimesPage";

import Moderate from "main/pages/Moderate";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import MenuItemPage from "main/pages/MenuItem/MenuItemPage";

import PlaceHolderReviewsPage from "main/pages/Placeholder/PlaceholderReviewsPage";

function App() {
  const { data: currentUser } = useCurrentUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/profile" element={<ProfilePage />} />
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <Route exact path="/admin/users" element={<AdminUsersPage />} />
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route exact path="/myreviews" element={<MyReviewsIndexPage />} />
            <Route
              exact
              path="/reviews/:itemid"
              element={<PlaceHolderReviewsPage />}
            />
            <Route exact path="/menuitems" element={<MenuItemIndexPage />} />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <Route exact path="/moderate" element={<Moderate />} />
        )}
        {hasRole(currentUser, "ROLE_USER") && (
          <>
            <Route
              exact
              path="/placeholder"
              element={<PlaceholderIndexPage />}
            />
          </>
        )}
        {hasRole(currentUser, "ROLE_ADMIN") && (
          <>
            <Route
              exact
              path="/placeholder/edit/:id"
              element={<PlaceholderEditPage />}
            />
            <Route
              exact
              path="/placeholder/create"
              element={<PlaceholderCreatePage />}
            />
          </>
        )}
        <>
          <Route
            exact
            path="/diningcommons/:date-time/:dining-commons-code"
            element={<MealTimesPage />}
          />
        </>
        <>
          <Route
            exact
            path="/diningcommons/:date-time/:dining-commons-code/:meal"
            element={<MenuItemPage />}
          />
        </>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
