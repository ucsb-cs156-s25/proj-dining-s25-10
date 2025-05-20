import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import MenuItemTable from "main/components/MenuItem/MenuItemTable";
import { menuItemFixtures } from "fixtures/menuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("MenuItemTable", () => {
  const queryClient = new QueryClient();

  test("renders menu items with buttons for ROLE_USER", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemTable
            menuItems={menuItemFixtures.fiveMenuItems}
            currentUser={currentUserFixtures.userOnly}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getAllByText("Review Item").length).toBe(5);
  });

  test("clicking review button navigates to review page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemTable
            menuItems={[{ ...menuItemFixtures.oneMenuItem[0], id: 42 }]}
            currentUser={currentUserFixtures.userOnly}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText("Review Item"));
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/reviews/42"),
    );
  });

  test("no buttons for non-logged in users", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemTable
            menuItems={menuItemFixtures.oneMenuItem}
            currentUser={currentUserFixtures.notLoggedIn}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.queryByText("Review Item")).not.toBeInTheDocument();
  });
});
