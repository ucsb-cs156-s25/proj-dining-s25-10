import { render, screen } from "@testing-library/react";
import PlaceholderPostReviewIndexPage from "main/pages/Placeholder/PlaceholderPostReviewIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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

    expect(screen.getByText("Post Reviews Index Page")).toBeInTheDocument();
    expect(screen.getByText("Oatmeal (vgn)")).toBeInTheDocument();

    const links = screen.getAllByRole("link", { name: "Post Review" });
    expect(links.length).toBe(5);
    expect(links[0]).toHaveAttribute("href", "/reviews/post/1");
  });
});
