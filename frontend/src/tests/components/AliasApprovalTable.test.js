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

    axiosMock
      .onPut("/api/currentUser/updateAliasModeration")
      .reply((config) => {
        const params = new URLSearchParams(config.url.split('?')[1]);
        const id = parseInt(params.get('id'));
        const approved = params.get('approved') === 'true';
        
        if (id === 1 && approved) {
          return [200, { id: 1, alias: "NewAlias", proposedAlias: null }];
        } else if (id === 2 && !approved) {
          return [200, { id: 2, alias: "CoolGuy", proposedAlias: null }];
        } else if (id === 1 && !approved) {
          return [200, { id: 1, alias: "OldAlias", proposedAlias: null }];
        } else if (id === 2 && approved) {
          return [200, { id: 2, alias: "ChillDude", proposedAlias: null }];
        }
        return [400, { error: "Invalid request" }];
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
      </QueryClientProvider>
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

  test("approve button triggers mutation", async () => {
    const { toast } = require("react-toastify");
    renderComponent();
    
    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[0]);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Approved alias: NewAlias");
    });
  });

  test("reject button triggers mutation", async () => {
    const { toast } = require("react-toastify");
    renderComponent();
    
    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[1]);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Rejected alias: CoolGuy");
    });
  });

  test("handles approve mutation for second user", async () => {
    const { toast } = require("react-toastify");
    renderComponent();
    
    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[1]);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Approved alias: ChillDude");
    });
  });

  test("handles reject mutation for first user", async () => {
    const { toast } = require("react-toastify");
    renderComponent();
    
    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[0]);

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith("Rejected alias: OldAlias");
    });
  });
});