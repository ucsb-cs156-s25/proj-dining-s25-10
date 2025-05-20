import { render, screen } from "@testing-library/react";
import PlaceholderReviewsIndexPage from "main/pages/Reviews/PlaceholderReviewsIndexPage";
import { MemoryRouter } from "react-router-dom";

describe("PlaceholderReviewsIndexPage", () => {
  test("renders menu items and review links correctly", () => {
    render(
      <MemoryRouter>
        <PlaceholderReviewsIndexPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Reviews Index Page")).toBeInTheDocument();
    expect(screen.getByText("Oatmeal (vgn)")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "View" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/reviews/1");
  });
});
