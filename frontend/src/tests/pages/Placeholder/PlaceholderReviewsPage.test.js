import { render, screen } from "@testing-library/react";
import PlaceholderReviewsPage from "main/pages/Placeholder/PlaceholderReviewsPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("PlaceholderReviewsPage tests", () => {
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

  test("Renders expected content with menu item id", async () => {
    // arrange
    setupUserOnly();

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/reviews/42"]}>
          <Routes>
            <Route
              path="/reviews/:itemid"
              element={<PlaceholderReviewsPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // assert
    expect(
      await screen.findByText("Reviews for Menu Item 42"),
    ).toBeInTheDocument();
    expect(screen.getByText("Coming Soon!")).toBeInTheDocument();
  });
});
