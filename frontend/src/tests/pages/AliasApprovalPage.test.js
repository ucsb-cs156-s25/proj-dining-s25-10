import { render, screen, waitFor } from "@testing-library/react";
import AliasApprovalPage from "main/pages/AliasApprovalPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("AliasApprovalPage tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  const sampleUsers = [
    { id: 1, alias: "Foo", proposedAlias: "Bar" },
    { id: 2, alias: "Boo", proposedAlias: "Baz" },
  ];

  beforeEach(() => {
    axiosMock.reset();
    axiosMock.onGet("/api/admin/usersWithProposedAlias").reply(200, sampleUsers);
  });

  test("renders AliasApprovalPage and loads users", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AliasApprovalPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(screen.getByText("Alias Approval")).toBeInTheDocument());
    expect(screen.getByText("Foo")).toBeInTheDocument();
    expect(screen.getByText("Bar")).toBeInTheDocument();
  });
});
