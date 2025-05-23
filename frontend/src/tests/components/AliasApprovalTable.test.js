import { render, screen, fireEvent } from "@testing-library/react";
import AliasApprovalTable from "main/components/AliasApprovalTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

const mockMutate = jest.fn();
const mockToast = jest.fn();

jest.mock("main/utils/useBackend", () => ({
  useBackendMutation: jest.fn(() => ({
    mutate: mockMutate,
    isLoading: false,
    error: null,
  })),
}));

jest.mock("react-toastify", () => ({
  ToastContainer: () => null,
  toast: mockToast,
}));

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
        mockToast(
          `${variables.approved ? "Approved" : "Rejected"} alias: ${returnedUser.alias}`,
        );
        queryClient.invalidateQueries("alias-approval");
      }
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
    renderComponent();

    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[0]);

    expect(mockMutate).toHaveBeenCalledWith({ id: 1, approved: true });
    expect(mockToast).toHaveBeenCalledWith("Approved alias: NewAlias");
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      "alias-approval",
    );
  });

  test("reject button triggers mutation for first user", () => {
    renderComponent();

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[0]);

    expect(mockMutate).toHaveBeenCalledWith({ id: 1, approved: false });
    expect(mockToast).toHaveBeenCalledWith("Rejected alias: OldAlias");
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      "alias-approval",
    );
  });

  test("approve button triggers mutation for second user", () => {
    renderComponent();

    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[1]);

    expect(mockMutate).toHaveBeenCalledWith({ id: 2, approved: true });
    expect(mockToast).toHaveBeenCalledWith("Approved alias: ChillDude");
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      "alias-approval",
    );
  });

  test("reject button triggers mutation for second user", () => {
    renderComponent();

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[1]);

    expect(mockMutate).toHaveBeenCalledWith({ id: 2, approved: false });
    expect(mockToast).toHaveBeenCalledWith("Rejected alias: CoolGuy");
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      "alias-approval",
    );
  });
});
