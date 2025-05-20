import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MenuItemIndexPage from "main/pages/MenuItem/MenuItemIndexPage";

jest.mock("main/components/MenuItem/MenuItemTable", () => {
  return function MockMenuItemTable() {
    return (
      <div data-testid="MenuItemTable">
        <div>Pizza</div>
        <div>Italian</div>
        <div>Hamburger</div>
        <div>Grill</div>
      </div>
    );
  };
});

describe("MenuItemIndexPage tests", () => {
  test("renders without crashing", () => {
    render(
      <BrowserRouter>
        <MenuItemIndexPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("Menu Items")).toBeInTheDocument();
    expect(screen.getByTestId("MenuItemTable")).toBeInTheDocument();
  });
});
