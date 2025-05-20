import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import MenuItemTable from "main/components/MenuItem/MenuItemTable";
import { useNavigate } from "react-router-dom";

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemTable tests", () => {
    const queryClient = new QueryClient();

    // Sample menu items for testing
    const menuItems = [
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
    ];

    test("renders without crashing for empty table", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemTable menuItems={[]} currentUser={{}} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders with menu items", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemTable menuItems={menuItems} currentUser={{}} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText("Pizza")).toBeInTheDocument();
        expect(screen.getByText("Italian")).toBeInTheDocument();
        expect(screen.getByText("Hamburger")).toBeInTheDocument();
        expect(screen.getByText("Grill")).toBeInTheDocument();
    });

    test("renders Review Item button for users with ROLE_USER", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemTable menuItems={menuItems} currentUser={{ root: { user: { id: 1, roles: ["ROLE_USER"] } } }} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const reviewButtons = screen.getAllByText("Review Item");
        expect(reviewButtons.length).toBe(2);
    });

    test("clicking review button navigates to correct URL", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemTable menuItems={menuItems} currentUser={{ root: { user: { id: 1, roles: ["ROLE_USER"] } } }} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const reviewButtons = screen.getAllByText("Review Item");
        fireEvent.click(reviewButtons[0]);

        expect(mockedNavigate).toHaveBeenCalledWith("/reviews/1");

        fireEvent.click(reviewButtons[1]);
        expect(mockedNavigate).toHaveBeenCalledWith("/reviews/2");
    });

    test("does not render review button for users without ROLE_USER", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemTable menuItems={menuItems} currentUser={{ root: { user: { id: 1, roles: [] } } }} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const reviewButtons = screen.queryAllByText("Review Item");
        expect(reviewButtons.length).toBe(0);
    });
});