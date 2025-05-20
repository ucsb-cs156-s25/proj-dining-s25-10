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

describe("MenuItemTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemTable
            menuItems={menuItemFixtures.fiveMenuItems}
            currentUser={currentUserFixtures.adminUser}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const expectedHeaders = ["Item Name", "Station"];
    const expectedFields = ["name", "station"];
    const testId = "MenuItemTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-header-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-name`),
    ).toHaveTextContent("Pizza");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-station`),
    ).toHaveTextContent("Italian");

    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-name`),
    ).toHaveTextContent("Hamburger");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-station`),
    ).toHaveTextContent("Grill");
  });

  test("Review button navigates to the review page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemTable
            menuItems={menuItemFixtures.oneMenuItem}
            currentUser={currentUserFixtures.userOnly}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Review Item")).toBeInTheDocument();
    const reviewButton = screen.getByText("Review Item");

    fireEvent.click(reviewButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/reviews/1"),
    );
  });

  test("Review button doesn't show up for regular users", async () => {
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
