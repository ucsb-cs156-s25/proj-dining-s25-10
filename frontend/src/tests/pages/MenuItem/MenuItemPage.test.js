import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import { QueryClient, QueryClientProvider } from "react-query";

import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import MenuItemPage from "main/pages/MenuItem/MenuItemPage";
import { menuItemFixtures } from "fixtures/menuItemFixtures";
import * as ReactRouter from "react-router";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

jest.mock("react-router", () => {
  const originalModule = jest.requireActual("react-router");
  return {
    __esModule: true,
    ...originalModule,
    useParams: jest.fn(),
  };
});

describe("MenuItemPage", () => {
  let axiosMock;
  let queryClient;

  beforeAll(() => {
    axiosMock = new AxiosMockAdapter(axios);
    queryClient = new QueryClient();
  });

  afterEach(() => {
    axiosMock.reset();
    queryClient.clear();
    jest.clearAllMocks();
  });

  test("MenuItemPage works with no backend", async () => {
    ReactRouter.useParams.mockReturnValue({
      "date-time": "2025-03-11",
      "dining-commons-code": "carrillo",
      meal: "breakfast",
    });

    axiosMock
      .onGet("/api/diningcommons/2025-03-11/carrillo/breakfast")
      .timeout();
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(axiosMock.history.get.length).toBe(3);
    });

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
    expect(
      screen.queryByText("MenuItemTable-cell-header-col-name"),
    ).not.toBeInTheDocument();
  });

  test("shows loading when meal parameter is missing", () => {
    ReactRouter.useParams.mockReturnValue({
      "date-time": "2025-03-11",
      "dining-commons-code": "carrillo",
      meal: "breakfast",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });

  test("shows loading when date parameter is missing", () => {
    ReactRouter.useParams.mockReturnValue({
      "date-time": null,
      "dining-commons-code": "carrillo",
      meal: "breakfast",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });

  test("shows loading when dining commons parameter is missing", () => {
    ReactRouter.useParams.mockReturnValue({
      "date-time": "2025-03-11",
      "dining-commons-code": null,
      meal: "breakfast",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });

  test("shows loading when meal parameter is undefined", () => {
    ReactRouter.useParams.mockReturnValue({
      "date-time": "2025-03-11",
      "dining-commons-code": "carrillo",
      meal: "breakfast",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });

  test("shows loading when date parameter is undefined", () => {
    ReactRouter.useParams.mockReturnValue({
      "date-time": undefined,
      "dining-commons-code": "carrillo",
      meal: "breakfast",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });

  test("shows loading when dining commons parameter is undefined", () => {
    ReactRouter.useParams.mockReturnValue({
      "date-time": "2025-03-11",
      "dining-commons-code": undefined,
      meal: "breakfast",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });

  test("shows loading when all parameters are missing", () => {
    ReactRouter.useParams.mockReturnValue({
      "date-time": null,
      "dining-commons-code": null,
      meal: "breakfast",
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Breakfast")).toBeInTheDocument();
  });
});

describe("MenuItemPage renders table correctly", () => {
  let axiosMock;
  let queryClient;

  beforeAll(() => {
    axiosMock = new AxiosMockAdapter(axios);
    queryClient = new QueryClient();
  });

  afterEach(() => {
    axiosMock.reset();
    queryClient.clear();
    jest.clearAllMocks();
  });

  test("MenuItemPage renders 5 Menu Items Correctly", async () => {
    ReactRouter.useParams.mockReturnValue({
      "date-time": "2025-03-11",
      "dining-commons-code": "carrillo",
      meal: "breakfast",
    });

    axiosMock
      .onGet("/api/diningcommons/2025-03-11/carrillo/breakfast")
      .reply(200, menuItemFixtures.fiveMenuItems);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByTestId("MenuItemTable-cell-row-0-col-name");
    for (let i = 0; i < menuItemFixtures.fiveMenuItems.length; i++) {
      expect(
        screen.getByTestId(`MenuItemTable-cell-row-${i}-col-name`),
      ).toHaveTextContent(menuItemFixtures.fiveMenuItems[i].name);
      expect(
        screen.getByTestId(`MenuItemTable-cell-row-${i}-col-station`),
      ).toHaveTextContent(menuItemFixtures.fiveMenuItems[i].station);
    }
  });
});
