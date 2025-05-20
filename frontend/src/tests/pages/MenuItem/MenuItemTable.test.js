import { render, screen, fireEvent } from "@testing-library/react";
import MenuItemTable from "main/components/MenuItem/MenuItemTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

jest.mock("main/utils/currentUser", () => {
  return {
    hasRole: (user, role) => {
      if (
        role === "ROLE_USER" &&
        user?.root?.user?.roles?.includes("ROLE_USER")
      ) {
        return true;
      }
      return false;
    },
  };
});

describe("MenuItemTable tests", () => {
  const queryClient = new QueryClient();

  // Sample menu items
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
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemTable menuItems={[]} currentUser={{}} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Station")).toBeInTheDocument();
  });

  test("renders Review Item button for users with ROLE_USER", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemTable
            menuItems={menuItems}
            currentUser={{ root: { user: { roles: ["ROLE_USER"] } } }}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  test("clicking review button navigates to correct URL", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemTable
            menuItems={menuItems}
            currentUser={{ root: { user: { roles: ["ROLE_USER"] } } }}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(mockedNavigate).toHaveBeenCalledWith("/reviews/1");
  });
});
