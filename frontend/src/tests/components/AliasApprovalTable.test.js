import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AliasApprovalTable from "main/components/AliasApprovalTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";

const mockMutate = jest.fn();
const mockInvalidateQueries = jest.fn();
const mockToast = jest.fn();

jest.mock("main/utils/useBackend", () => ({
  useBackendMutation: jest.fn(() => ({
    mutate: mockMutate,
    isLoading: false,
    error: null,
  })),
}));

jest.mock("react-toastify", () => ({
  ...jest.requireActual("react-toastify"),
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
    queryClient.invalidateQueries = mockInvalidateQueries;

    const { useBackendMutation } = require("main/utils/useBackend");

    useBackendMutation.mockImplementation(
      (objectToAxiosParams, { onSuccess }) => ({
        mutate: (variables) => {
          mockMutate(variables);

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

          if (onSuccess && returnedUser) {
            onSuccess(returnedUser, variables);
          }
        },
        isLoading: false,
        error: null,
      }),
    );
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

  test("approve button triggers mutation for first user", async () => {
    renderComponent();

    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[0]);

    expect(mockMutate).toHaveBeenCalledWith({ id: 1, approved: true });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Approved alias: NewAlias");
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith("alias-approval");
  });

  test("reject button triggers mutation for first user", async () => {
    renderComponent();

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[0]);

    expect(mockMutate).toHaveBeenCalledWith({ id: 1, approved: false });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Rejected alias: OldAlias");
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith("alias-approval");
  });

  test("approve button triggers mutation for second user", async () => {
    renderComponent();

    const approveButtons = screen.getAllByRole("button", { name: "Approve" });
    fireEvent.click(approveButtons[1]);

    expect(mockMutate).toHaveBeenCalledWith({ id: 2, approved: true });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Approved alias: ChillDude");
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith("alias-approval");
  });

  test("reject button triggers mutation for second user", async () => {
    renderComponent();

    const rejectButtons = screen.getAllByRole("button", { name: "Reject" });
    fireEvent.click(rejectButtons[1]);

    expect(mockMutate).toHaveBeenCalledWith({ id: 2, approved: false });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith("Rejected alias: CoolGuy");
    });

    expect(mockInvalidateQueries).toHaveBeenCalledWith("alias-approval");
  });

  test("useBackendMutation is called with correct parameters", () => {
    const { useBackendMutation } = require("main/utils/useBackend");
    renderComponent();

    expect(useBackendMutation).toHaveBeenCalledWith(
      expect.any(Function),
      { onSuccess: expect.any(Function) },
      ["alias-approval"],
    );
  });

  test("objectToAxiosParams function works correctly", () => {
    const { useBackendMutation } = require("main/utils/useBackend");
    renderComponent();

    const objectToAxiosParams = useBackendMutation.mock.calls[0][0];

    const result = objectToAxiosParams({ id: 1, approved: true });
    expect(result).toEqual({
      url: "/api/currentUser/updateAliasModeration",
      method: "PUT",
      params: {
        id: 1,
        approved: true,
      },
    });

    const emptyResult = objectToAxiosParams({});
    expect(emptyResult).toEqual({});
  });
});
