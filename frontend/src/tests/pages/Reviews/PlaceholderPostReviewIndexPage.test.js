import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PlaceholderPostReviewIndexPage from "main/pages/Placeholder/PlaceholderPostReviewIndexPage";

describe("PlaceholderPostReviewIndexPage", () => {
  test("renders menu items and Post Review links correctly", () => {
    render(
      <MemoryRouter>
        <PlaceholderPostReviewIndexPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Reviews Index Page")).toBeInTheDocument();

    const expectedItems = [
      "Oatmeal (vgn)",
      "Blintz with Strawberry Compote (v)",
      "Cage Free Scrambled Eggs (v)",
      "Cage Free Scrambled Egg Whites (v)",
      "Sliced Potato with Onions (vgn)",
    ];

    expectedItems.forEach((itemName, index) => {
      expect(screen.getByText(itemName)).toBeInTheDocument();
      const link = screen.getAllByRole("link", { name: "Post Review" })[index];
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", `/reviews/post/${index + 1}`);
    });
  });
});
