import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MenuItemIndexPage from "main/pages/MenuItem/MenuItemIndexPage";

jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useState: jest.fn().mockImplementation((initial) => {
      if (Array.isArray(initial) && initial.length === 0) {
        return [
          [
            { id: 1, name: "Pizza", station: "Italian" },
            { id: 2, name: "Hamburger", station: "Grill" },
          ],
          jest.fn(),
        ];
      }
      return [initial, jest.fn()];
    }),
  };
});

describe("MenuItemIndexPage tests", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <MenuItemIndexPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Menu Items")).toBeInTheDocument();
    expect(screen.getByText("Pizza")).toBeInTheDocument();
    expect(screen.getByText("Italian")).toBeInTheDocument();
    expect(screen.getByText("Hamburger")).toBeInTheDocument();
    expect(screen.getByText("Grill")).toBeInTheDocument();
  });
});
