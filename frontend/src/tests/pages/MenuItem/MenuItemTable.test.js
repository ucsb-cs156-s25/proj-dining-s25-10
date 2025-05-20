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

    const buttonCells = screen.getAllByTestId(
      /MenuItemTable-cell-row-\d+-button-Review Item/,
    );
    expect(buttonCells.length).toBe(2);
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

    const buttons = screen.getAllByRole("button", { name: "Review Item" });
    fireEvent.click(buttons[0]);

    expect(mockedNavigate).toHaveBeenCalledWith("/reviews/1");
  });
});
