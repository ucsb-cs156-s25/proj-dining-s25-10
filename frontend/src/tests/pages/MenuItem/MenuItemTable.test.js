import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import MenuItemTable from "main/components/MenuItem/MenuItemTable";
import { menuItemFixtures } from "fixtures/menuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

describe("MenuItemTable", () => {
  const queryClient = new QueryClient();

  function renderWithHistory(menuItems, currentUser) {
    const history = createMemoryHistory();
    render(
      <QueryClientProvider client={queryClient}>
        <Router location={history.location} navigator={history}>
          <MenuItemTable menuItems={menuItems} currentUser={currentUser} />
        </Router>
      </QueryClientProvider>,
    );
    return history;
  }

  test("renders headers and menu items correctly without buttons (non-logged-in)", () => {
    renderWithHistory(
      menuItemFixtures.fiveMenuItems,
      currentUserFixtures.notLoggedIn,
    );

    expect(screen.getByText("Item Name")).toBeInTheDocument();
    expect(screen.getByText("Station")).toBeInTheDocument();

    for (let i = 0; i < menuItemFixtures.fiveMenuItems.length; i++) {
      expect(
        screen.getByTestId(`MenuItemTable-cell-row-${i}-col-name`),
      ).toHaveTextContent(menuItemFixtures.fiveMenuItems[i].name);
      expect(
        screen.getByTestId(`MenuItemTable-cell-row-${i}-col-station`),
      ).toHaveTextContent(menuItemFixtures.fiveMenuItems[i].station);
    }

    expect(
      screen.queryByRole("button", { name: /review item/i }),
    ).not.toBeInTheDocument();
  });

  test("renders review buttons for ROLE_USER only", () => {
    renderWithHistory(
      menuItemFixtures.fiveMenuItems,
      currentUserFixtures.userOnly,
    );

    const buttons = screen.getAllByRole("button", { name: /review item/i });
    expect(buttons).toHaveLength(5);
  });

  test("clicking review button navigates to correct review page", async () => {
    const itemWithId = [{ ...menuItemFixtures.oneMenuItem[0], id: 42 }];
    const view = renderWithHistory(itemWithId, currentUserFixtures.userOnly);
    const history = view.history;

    const button = screen.getByRole("button", { name: /review item/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(history.location.pathname).toBe("/reviews/42");
    });
  });

  test("does not render buttons for unauthenticated users", () => {
    renderWithHistory(
      menuItemFixtures.oneMenuItem,
      currentUserFixtures.notLoggedIn,
    );
    expect(
      screen.queryByRole("button", { name: /review item/i }),
    ).not.toBeInTheDocument();
  });
});
