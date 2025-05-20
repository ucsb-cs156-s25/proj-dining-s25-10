import { render, screen } from "@testing-library/react";
import PlaceholderReviewsIndexPage from "main/pages/Reviews/PlaceholderReviewsIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

describe("PlaceholderReviewsIndexPage", () => {
  const queryClient = new QueryClient();

  test("renders menu items and review links correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PlaceholderReviewsIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Reviews Index Page")).toBeInTheDocument();
    expect(screen.getByText("Oatmeal (vgn)")).toBeInTheDocument();

    const links = screen.getAllByRole("link", { name: "View" });
    expect(links.length).toBe(5);

    expect(links[0]).toHaveAttribute("href", "/reviews/1");
  });
});
