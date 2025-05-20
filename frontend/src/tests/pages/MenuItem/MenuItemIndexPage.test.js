import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemIndexPage from "main/pages/MenuItem/MenuItemIndexPage";
import { menuItemFixtures } from "fixtures/menuItemFixtures";

jest.mock("main/layouts/BasicLayout/BasicLayout", () => {
  return function MockBasicLayout({ children }) {
    return <div data-testid="MockBasicLayout">{children}</div>;
  };
});

jest.mock("main/components/MenuItem/MenuItemTable", () => {
  return function MockMenuItemTable({ menuItems }) {
    return (
      <div data-testid="MockMenuItemTable">
        {menuItems.map((item) => (
          <div key={item.id} data-testid="MenuItem">
            {item.name} - {item.station}
          </div>
        ))}
      </div>
    );
  };
});

describe("MenuItemIndexPage tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByTestId("MockBasicLayout")).toBeInTheDocument();
    expect(screen.getByText("Menu Items")).toBeInTheDocument();
    expect(screen.getByTestId("MockMenuItemTable")).toBeInTheDocument();

    const menuItems = screen.getAllByTestId("MenuItem");
    expect(menuItems.length).toBe(menuItemFixtures.fiveMenuItems.length);
  });
});
