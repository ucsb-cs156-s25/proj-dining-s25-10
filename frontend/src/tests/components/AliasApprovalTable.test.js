import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AliasApprovalTable from "main/components/AliasApprovalTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

jest.mock("react-toastify", () => ({
  ...jest.requireActual("react-toastify"),
  toast: jest.fn(),
}));

describe("AliasApprovalTable tests", () => {
  let queryClient;
  let axiosMock;

  const sampleUsers = [
    { id: 1, alias: "OldAlias", proposedAlias: "NewAlias" },
    { id: 2, alias: "CoolGuy", proposedAlias: "ChillDude" },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    axiosMock = new AxiosMockAdapter(axios);

    axiosMock.onPut().reply((config) => {
      const url = config.url || "";
      const urlObj = new URL(url, "http://localhost");

      if (url.includes("/api/currentUser/updateAliasModeration")) {
        const id = parseInt(urlObj.searchParams.get("id") || "0");
        const approved = urlObj.searchParams.get("approved") === "true";

        console.log(`Mock handling: id=${id}, approved=${approved}`);

        if (id === 1 && approved) {
          return [200, { id: 1, alias: "NewAlias", proposedAlias: null }];
        } else if (id === 1 && !approved) {
          return [200, { id: 1, alias: "OldAlias", proposedAlias: null }];
        } else if (id === 2 && approved) {
          return [200, { id: 2, alias: "ChillDude", proposedAlias: null }];
        } else if (id === 2 && !approved) {
          return [200, { id: 2, alias: "CoolGuy", proposedAlias: null }];
        }
      }

      return [404, { error: "Not found" }];
    });
  });

  afterEach(() => {
    axiosMock.restore();
    jest.clearAllMocks();
  });

  function renderComponent() {
    return render(
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
    expect(screen.getByText("CoolGuy")).toBeInTheDocument();
    expect(screen.getByText("ChillDude")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Approve" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Reject" })).toHaveLength(2);
  });

  test("approve button triggers mutation for first user", async () => {
    const { toast } = require("react-toastify");
    renderComponent();

    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[0]);

    await waitFor(
      () => {
        expect(toast).toHaveBeenCalledWith("Approved alias: NewAlias");
      },
      { timeout: 3000 },
    );
  });

  test("reject button triggers mutation for second user", async () => {
    const { toast } = require("react-toastify");
    renderComponent();

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[1]);

    await waitFor(
      () => {
        expect(toast).toHaveBeenCalledWith("Rejected alias: CoolGuy");
      },
      { timeout: 3000 },
    );
  });

  test("approve button triggers mutation for second user", async () => {
    const { toast } = require("react-toastify");
    renderComponent();

    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[1]);

    await waitFor(
      () => {
        expect(toast).toHaveBeenCalledWith("Approved alias: ChillDude");
      },
      { timeout: 3000 },
    );
  });

  test("reject button triggers mutation for first user", async () => {
    const { toast } = require("react-toastify");
    renderComponent();

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[0]);

    await waitFor(
      () => {
        expect(toast).toHaveBeenCalledWith("Rejected alias: OldAlias");
      },
      { timeout: 3000 },
    );
  });

  test("handles error cases gracefully", async () => {
    const { toast } = require("react-toastify");

    axiosMock.reset();
    axiosMock.onPut().reply(500, { error: "Server error" });

    renderComponent();

    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[0]);

    await waitFor(
      () => {
        expect(toast).toHaveBeenCalled();
      },
      { timeout: 3000 },
    );
  });
});
