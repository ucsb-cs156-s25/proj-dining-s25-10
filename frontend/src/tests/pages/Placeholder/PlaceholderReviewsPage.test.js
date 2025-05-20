import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import PlaceholderReviewsPage from "main/pages/Placeholder/PlaceholderReviewsPage";

describe("PlaceholderReviewsPage", () => {
  const queryClient = new QueryClient();

  test("renders correctly with itemid param", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/reviews/123"]}>
          <Routes>
            <Route
              path="/reviews/:itemid"
              element={<PlaceholderReviewsPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Reviews for Menu Item 123")).toBeInTheDocument();
    expect(screen.getByText("Coming Soon!")).toBeInTheDocument();
  });
});
