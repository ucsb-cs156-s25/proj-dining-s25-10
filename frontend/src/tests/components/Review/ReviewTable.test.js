import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { reviewFixtures } from "../../../fixtures/reviewFixtures";
import ReviewTable from "../../../main/components/Review/ReviewTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import {
  onDeleteSuccess,
  onApproveSuccess,
  onDenySuccess,
  cellToAxiosParamsDelete,
} from "main/utils/reviewUtils";

import { toast } from "react-toastify";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

beforeEach(() => {
  toast.mockClear();
});

describe("ReviewTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "id",
    "Stars",
    "Comments",
    "Date Served",
    "Item Name",
  ];
  const expectedFields = [
    "id",
    "itemStars",
    "comments",
    "dateServed",
    "itemName",
  ];
  const testId = "ReviewTable";

  test("renders empty table correctly", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable reviews={[]} userOptions={true} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      expect(
        screen.queryByTestId(`${testId}-cell-row-0-col-${field}`),
      ).not.toBeInTheDocument();
    });
  });

  test("Has expected content and buttons for admin user", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={reviewFixtures.threeReviews}
            userOptions={true}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expectedHeaders.forEach((headerText) => {
      expect(screen.getByText(headerText)).toBeInTheDocument();
    });

    // Row 0 (id 2)
    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-itemStars`),
    ).toHaveTextContent("5");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-comments`),
    ).toHaveTextContent("It was ok");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateServed`),
    ).toHaveTextContent("2022-01-02T12:00:00");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-itemName`),
    ).toHaveTextContent("Pizza");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-status`),
    ).toHaveTextContent("Approved");

    // Buttons
    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    expect(deleteButton).toHaveClass("btn-danger");

    // Check that moderator buttons don't exist

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Approve-button`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Deny-button`),
    ).not.toBeInTheDocument();
  });

  test("Has expected content for ordinary user (no buttons or itemName)", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable reviews={reviewFixtures.threeReviews} />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    // Should NOT render itemName or buttons
    expect(screen.queryByText("Item Name")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();

    // Still renders main columns
    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText("Stars")).toBeInTheDocument();

    expect(screen.getByText("Status")).toBeInTheDocument();

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2",
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3",
    );
  });

  test("Edit button navigates to the edit page", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={reviewFixtures.threeReviews}
            userOptions={true}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const editButton = await screen.findByTestId(
      `${testId}-cell-row-0-col-Edit-button`,
    );
    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith("/reviews/edit/2"),
    );
  });

  test("Delete button calls delete callback", async () => {
    const axiosMock = new AxiosMockAdapter(axios);
    axiosMock
      .onDelete("/api/reviews")
      .reply(200, { message: "Review deleted" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={reviewFixtures.threeReviews}
            userOptions={true}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const deleteButton = await screen.findByTestId(
      `${testId}-cell-row-0-col-Delete-button`,
    );
    fireEvent.click(deleteButton);

    await waitFor(() => expect(axiosMock.history.delete.length).toBe(1));
    expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
  });

  test("Has Approve and Deny buttons when moderatorOptions is true", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={reviewFixtures.threeReviews}
            moderatorOptions={true}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const approveButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Approve-button`,
    );
    expect(approveButton).toHaveClass("btn-primary");
    const denyButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Deny-button`,
    );
    expect(denyButton).toHaveClass("btn-danger");
  });

  test("Approve and Deny buttons are NOT shown when moderatorOptions is false", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={reviewFixtures.threeReviews}
            moderatorOptions={false}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Approve-button`),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId(`${testId}-cell-row-0-col-Deny-button`),
    ).not.toBeInTheDocument();
  });

  test("Clicking Approve and Deny triggers backend mutation", async () => {
    const axiosMock = new AxiosMockAdapter(axios);

    axiosMock.onPut("/api/reviews/2").reply(200, { message: "Approved" });
    axiosMock.onPut("/api/reviews/3").reply(200, { message: "Denied" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ReviewTable
            reviews={reviewFixtures.threeReviews}
            moderatorOptions={true}
          />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const approveButton = await screen.findByTestId(
      `${testId}-cell-row-0-col-Approve-button`,
    );
    fireEvent.click(approveButton);

    await waitFor(() => {
      expect(axiosMock.history.put.length).toBe(1);
    });

    await waitFor(() => {
      expect(axiosMock.history.put[0].url).toBe("/api/reviews/2");
    });

    await waitFor(() => {
      expect(JSON.parse(axiosMock.history.put[0].data)).toMatchObject({
        status: "Approved",
      });
    });

    const denyButton = await screen.findByTestId(
      `${testId}-cell-row-1-col-Deny-button`,
    );
    fireEvent.click(denyButton);

    await waitFor(() => {
      expect(axiosMock.history.put.length).toBe(2);
    });

    await waitFor(() => {
      expect(axiosMock.history.put[1].url).toBe("/api/reviews/3");
    });

    await waitFor(() => {
      expect(JSON.parse(axiosMock.history.put[1].data)).toMatchObject({
        status: "Denied",
      });
    });
  });
});

describe("reviewUtils function coverage", () => {
  beforeEach(() => {
    toast.mockClear();
  });

  test("onDeleteSuccess calls toast with correct message", () => {
    onDeleteSuccess("Review deleted");
    expect(toast).toHaveBeenCalledWith("Review deleted");
  });

  test("onApproveSuccess calls toast with correct message", () => {
    onApproveSuccess("Review approved");
    expect(toast).toHaveBeenCalledWith("Review approved");
  });

  test("onDenySuccess calls toast with correct message", () => {
    onDenySuccess("Review denied");
    expect(toast).toHaveBeenCalledWith("Review denied");
  });

  test("cellToAxiosParamsDelete returns correct delete config", () => {
    const cell = {
      row: {
        values: {
          id: 42,
        },
      },
    };

    const result = cellToAxiosParamsDelete(cell);
    expect(result).toEqual({
      url: "/api/reviews",
      method: "DELETE",
      params: { id: 42 },
    });
  });
});
