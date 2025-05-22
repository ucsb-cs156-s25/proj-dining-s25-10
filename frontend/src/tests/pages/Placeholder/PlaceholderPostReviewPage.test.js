import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import PlaceholderPostReviewPage from "main/pages/Placeholder/PlaceholderPostReviewPage";

describe("PlaceholderPostReviewPage", () => {
  test("renders expected content with menu item id", () => {
    render(
      <MemoryRouter initialEntries={["/reviews/post/42"]}>
        <Routes>
          <Route path="/reviews/post/:id" element={<PlaceholderPostReviewPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Review Posting Page for Menu Item 42")).toBeInTheDocument();
    expect(screen.getByText("Coming Soon!")).toBeInTheDocument();
  });
});
