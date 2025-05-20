import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import PlaceholderReviewsPage from "main/pages/Placeholder/PlaceholderReviewsPage";

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

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    itemid: "1",
  }),
  useNavigate: () => jest.fn(),
}));

describe("PlaceholderReviewsPage tests", () => {
  const queryClient = new QueryClient();

  test("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PlaceholderReviewsPage />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Reviews for Menu Item 1/)).toBeInTheDocument();
    expect(screen.getByText(/Coming Soon!/)).toBeInTheDocument();
  });
});
