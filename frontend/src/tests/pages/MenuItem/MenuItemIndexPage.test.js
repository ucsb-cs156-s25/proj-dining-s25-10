import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import MenuItemIndexPage from "main/pages/MenuItem/MenuItemIndexPage";

const queryClient = new QueryClient();

describe("MenuItemIndexPage", () => {
  test("renders all five menu items and headings", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemIndexPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("Menu Items")).toBeInTheDocument();
    expect(
      screen.getByText(/Click on "Review Item" to see or add reviews/i),
    ).toBeInTheDocument();

    expect(screen.getByText("Oatmeal (vgn)")).toBeInTheDocument();
    expect(
      screen.getByText("Blintz with Strawberry Compote (v)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Cage Free Scrambled Eggs (v)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Cage Free Scrambled Egg Whites (v)"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Sliced Potato with Onions (vgn)"),
    ).toBeInTheDocument();
  });
});
