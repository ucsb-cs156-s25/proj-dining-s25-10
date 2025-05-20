import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MenuItemTable from "main/components/MenuItem/MenuItemTable";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemTable tests", () => {
  const menuItems = [
    {
      id: 1,
      name: "Pizza",
      station: "Italian",
    },
    {
      id: 2,
      name: "Hamburger",
      station: "Grill",
    },
  ];

  test("renders without crashing for empty table with no user", () => {
    render(
      <MemoryRouter>
        <MenuItemTable menuItems={[]} currentUser={{}} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Station")).toBeInTheDocument();
  });

  test("renders Review Item button for users with ROLE_USER", () => {
    render(
      <MemoryRouter>
        <MenuItemTable
          menuItems={menuItems}
          currentUser={{ root: { user: { roles: ["ROLE_USER"] } } }}
        />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByTestId(
      "MenuItemTable-cell-row-0-button-Review Item",
    );
    expect(buttons.length).toBeGreaterThan(0);
  });

  test("clicking review button navigates to correct URL", () => {
    render(
      <MemoryRouter>
        <MenuItemTable
          menuItems={menuItems}
          currentUser={{ root: { user: { roles: ["ROLE_USER"] } } }}
        />
      </MemoryRouter>,
    );

    const buttons = screen.getAllByTestId(
      "MenuItemTable-cell-row-0-button-Review Item",
    );
    fireEvent.click(buttons[0]);

    expect(mockedNavigate).toHaveBeenCalledWith("/reviews/1");
  });
});
