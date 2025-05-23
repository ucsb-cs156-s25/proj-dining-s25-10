import { render, screen } from "@testing-library/react";
import AliasApprovalPage from "main/pages/AliasApprovalPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

const mockUsers = [
  { id: 1, alias: "OldAlias", proposedAlias: "NewAlias" },
  { id: 2, alias: "CoolGuy", proposedAlias: "ChillDude" },
];

jest.mock("main/utils/useBackend", () => ({
  useBackend: jest.fn(() => ({
    data: mockUsers,
    isLoading: false,
    error: null,
  })),
  useBackendMutation: jest.fn(() => ({
    mutate: jest.fn(),
    isLoading: false,
    error: null,
  })),
}));

jest.mock("react-toastify", () => ({
  ToastContainer: () => null,
  toast: jest.fn(),
}));

describe("AliasApprovalPage tests", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderComponent() {
    return render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AliasApprovalPage />
        </QueryClientProvider>
      </MemoryRouter>,
    );
  }

  test("renders page title", () => {
    renderComponent();
    expect(screen.getByText("Alias Approval")).toBeInTheDocument();
  });

  test("renders table with users data", () => {
    renderComponent();
    expect(screen.getByText("OldAlias")).toBeInTheDocument();
    expect(screen.getByText("NewAlias")).toBeInTheDocument();
    expect(screen.getByText("CoolGuy")).toBeInTheDocument();
    expect(screen.getByText("ChillDude")).toBeInTheDocument();
  });

  test("renders approve and reject buttons", () => {
    renderComponent();
    expect(screen.getAllByRole("button", { name: "Approve" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Reject" })).toHaveLength(2);
  });
});
