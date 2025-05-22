import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import PlaceholderPostReviewIndexPage from "main/pages/Placeholder/PlaceholderPostReviewIndexPage";

describe("PlaceholderPostReviewIndexPage", () => {
  const queryClient = new QueryClient();

  test("renders menu items and post review links correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PlaceholderPostReviewIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Reviews Index Page")).toBeInTheDocument();
    expect(screen.getByText("Oatmeal (vgn)")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Post Review" }).length).toBe(5);
    expect(screen.getByRole("link", { name: "Post Review" })).toHaveAttribute(
      "href",
      "/reviews/post/1",
    );
  });
});
