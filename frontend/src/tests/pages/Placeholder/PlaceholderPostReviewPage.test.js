import { render, screen } from "@testing-library/react";
import PlaceholderPostReviewPage from "main/pages/Placeholder/PlaceholderPostReviewPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("PlaceholderPostReviewPage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  const setupUserOnly = () => {
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  };

  const queryClient = new QueryClient();

  test("renders expected content with menu item id", async () => {
    setupUserOnly();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/reviews/post/42"]}>
          <Routes>
            <Route
              path="/reviews/post/:itemid"
              element={<PlaceholderPostReviewPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      await screen.findByText("Review Posting Page for Menu Item 42"),
    ).toBeInTheDocument();
    expect(screen.getByText("Coming Soon!")).toBeInTheDocument();
  });
});
