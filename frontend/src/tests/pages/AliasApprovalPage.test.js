import { render, screen, fireEvent } from "@testing-library/react";
import AliasApprovalTable from "main/components/AliasApprovalTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

describe("AliasApprovalTable tests", () => {
  const queryClient = new QueryClient();
  const axiosMock = new AxiosMockAdapter(axios);

  const sampleUsers = [
    { id: 1, alias: "OldAlias", proposedAlias: "NewAlias" },
    { id: 2, alias: "CoolGuy", proposedAlias: "ChillDude" },
  ];

  beforeEach(() => {
    axiosMock.reset();
    axiosMock
      .onPut("/api/currentUser/updateAliasModeration", {
        params: { id: 1, approved: true },
      })
      .reply(200, {
        id: 1,
        alias: "NewAlias",
        proposedAlias: null,
      });

    axiosMock
      .onPut("/api/currentUser/updateAliasModeration", {
        params: { id: 2, approved: false },
      })
      .reply(200, {
        id: 2,
        alias: "CoolGuy",
        proposedAlias: null,
      });
  });

  function renderComponent() {
    render(
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <AliasApprovalTable users={sampleUsers} />
      </QueryClientProvider>,
    );
  }

  test("renders table with aliases", () => {
    renderComponent();
    expect(screen.getByText("OldAlias")).toBeInTheDocument();
    expect(screen.getByText("NewAlias")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Approve" }).length).toBe(2);
    expect(screen.getAllByRole("button", { name: "Reject" }).length).toBe(2);
  });

  test("approve button triggers mutation", async () => {
    renderComponent();
    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[0]);
    expect(
      await screen.findByText((content) =>
        content.includes("Approved alias: NewAlias"),
      ),
    ).toBeInTheDocument();
  });

  test("reject button triggers mutation", async () => {
    renderComponent();
    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[1]);
    expect(
      await screen.findByText((content) =>
        content.includes("Rejected alias: CoolGuy"),
      ),
    ).toBeInTheDocument();
  });
});
