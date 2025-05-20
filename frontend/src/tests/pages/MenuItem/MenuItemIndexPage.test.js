import { render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemIndexPage from "main/pages/MenuItem/MenuItemIndexPage";

jest.mock("main/utils/menuItemUtils", () => {
    return {
        fetchMenuItems: jest.fn().mockResolvedValue([
            {
                id: 1,
                name: "Pizza",
                station: "Italian"
            },
            {
                id: 2,
                name: "Hamburger",
                station: "Grill"
            }
        ])
    };
});

describe("MenuItemIndexPage tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText("Menu Items")).toBeInTheDocument();
        
        await waitFor(() => {
            expect(screen.getByText("Pizza")).toBeInTheDocument();
            expect(screen.getByText("Italian")).toBeInTheDocument();
            expect(screen.getByText("Hamburger")).toBeInTheDocument();
            expect(screen.getByText("Grill")).toBeInTheDocument();
        });
    });
});