// src/tests/pages/Placeholder/PlaceholderReviewsPage.test.js
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PlaceholderReviewsPage from "main/pages/Placeholder/PlaceholderReviewsPage";

// Mock the useParams hook instead of trying to use Routes
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    itemid: "1",
  }),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

describe("PlaceholderReviewsPage tests", () => {
  test("renders without crashing", () => {
    render(
      <BrowserRouter>
        <PlaceholderReviewsPage />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Reviews for Menu Item 1/)).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon!/)).toBeInTheDocument();
  });
});
