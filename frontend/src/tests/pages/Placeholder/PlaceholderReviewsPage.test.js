import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import PlaceholderReviewsPage from "main/pages/Placeholder/PlaceholderReviewsPage";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    itemid: "1",
  }),
  Link: ({ children }) => <div>{children}</div>,
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
