import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PlaceholderReviewsPage from "main/pages/Placeholder/PlaceholderReviewsPage";

jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  const originalUseState = originalReact.useState;

  return {
    ...originalReact,
    useState: jest.fn((init) => {
      if (init === null) {
        return [{ name: "Menu Item 1" }, jest.fn()];
      }
      return originalUseState(init);
    }),
  };
});

describe("PlaceholderReviewsPage tests", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter initialEntries={["/reviews/1"]}>
        <Routes>
          <Route path="/reviews/:itemid" element={<PlaceholderReviewsPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const headingElement = screen.getByRole("heading", { level: 1 });
    expect(headingElement).toBeInTheDocument();
    expect(headingElement).toHaveTextContent("Reviews for Menu Item 1");
    expect(screen.getByText(/Coming Soon!/)).toBeInTheDocument();
  });
});
