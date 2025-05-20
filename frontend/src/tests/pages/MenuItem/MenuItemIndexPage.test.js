import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import MenuItemIndexPage from "main/pages/MenuItem/MenuItemIndexPage";

jest.mock("main/components/Nav/AppNavbar", () => {
  return function MockAppNavbar() {
    return <div data-testid="MockAppNavbar"></div>;
  };
});

jest.mock("main/components/Nav/Footer", () => {
  return function MockFooter() {
    return <div data-testid="MockFooter"></div>;
  };
});

jest.mock("main/components/MenuItem/MenuItemTable", () => {
  return function MockMenuItemTable(props) {
    return (
      <div data-testid="MenuItemTable">
        {props.menuItems.map((item) => (
          <div key={item.id}>
            <div>{item.name}</div>
            <div>{item.station}</div>
          </div>
        ))}
      </div>
    );
  };
});

jest.mock("main/utils/currentUser", () => {
  return {
    useCurrentUser: () => ({
      data: { root: { user: { roles: ["ROLE_USER"] } } },
    }),
    useLogout: () => ({ mutate: jest.fn() }),
    hasRole: () => true,
  };
});

jest.mock("main/utils/systemInfo", () => {
  return {
    useSystemInfo: () => ({
      data: { springH2ConsoleEnabled: false, showSwaggerUILink: false },
    }),
  };
});

describe("MenuItemIndexPage tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MenuItemIndexPage />
      </QueryClientProvider>,
    );

    expect(screen.getByText("Menu Items")).toBeInTheDocument();
    expect(screen.getByTestId("MenuItemTable")).toBeInTheDocument();
  });
});
