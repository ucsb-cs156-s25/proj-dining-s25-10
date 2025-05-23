import { render, screen, fireEvent } from "@testing-library/react";
import AliasApprovalTable from "main/components/AliasApprovalTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

jest.mock("main/utils/useBackend");
jest.mock("react-toastify");

describe("AliasApprovalTable tests", () => {
  let queryClient;

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
    queryClient.invalidateQueries = jest.fn();

    const { useBackendMutation } = require("main/utils/useBackend");
    const { toast } = require("react-toastify");

    const mockMutate = jest.fn();
    mockMutate.mockImplementation((variables) => {
      let returnedUser;
      if (variables.id === 1 && variables.approved) {
        returnedUser = { id: 1, alias: "NewAlias", proposedAlias: null };
      } else if (variables.id === 1 && !variables.approved) {
        returnedUser = { id: 1, alias: "OldAlias", proposedAlias: null };
      } else if (variables.id === 2 && variables.approved) {
        returnedUser = { id: 2, alias: "ChillDude", proposedAlias: null };
      } else if (variables.id === 2 && !variables.approved) {
        returnedUser = { id: 2, alias: "CoolGuy", proposedAlias: null };
      }

      if (returnedUser) {
        toast(
          `${variables.approved ? "Approved" : "Rejected"} alias: ${returnedUser.alias}`,
        );
        queryClient.invalidateQueries("alias-approval");
      }
    });

    useBackendMutation.mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      error: null,
    });
  });

  afterEach(() => {
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

  test("approve button triggers mutation for first user", () => {
    const { toast } = require("react-toastify");
    const { useBackendMutation } = require("main/utils/useBackend");

    renderComponent();

    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[0]);

    const mockMutate = useBackendMutation().mutate;
    expect(mockMutate).toHaveBeenCalledWith({ id: 1, approved: true });
    expect(toast).toHaveBeenCalledWith("Approved alias: NewAlias");
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      "alias-approval",
    );
  });

  test("reject button triggers mutation for first user", () => {
    const { toast } = require("react-toastify");
    const { useBackendMutation } = require("main/utils/useBackend");

    renderComponent();

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[0]);

    const mockMutate = useBackendMutation().mutate;
    expect(mockMutate).toHaveBeenCalledWith({ id: 1, approved: false });
    expect(toast).toHaveBeenCalledWith("Rejected alias: OldAlias");
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      "alias-approval",
    );
  });

  test("approve button triggers mutation for second user", () => {
    const { toast } = require("react-toastify");
    const { useBackendMutation } = require("main/utils/useBackend");

    renderComponent();

    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[1]);

    const mockMutate = useBackendMutation().mutate;
    expect(mockMutate).toHaveBeenCalledWith({ id: 2, approved: true });
    expect(toast).toHaveBeenCalledWith("Approved alias: ChillDude");
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      "alias-approval",
    );
  });

  test("reject button triggers mutation for second user", () => {
    const { toast } = require("react-toastify");
    const { useBackendMutation } = require("main/utils/useBackend");

    renderComponent();

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[1]);

    const mockMutate = useBackendMutation().mutate;
    expect(mockMutate).toHaveBeenCalledWith({ id: 2, approved: false });
    expect(toast).toHaveBeenCalledWith("Rejected alias: CoolGuy");
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      "alias-approval",
    );
  });
});
