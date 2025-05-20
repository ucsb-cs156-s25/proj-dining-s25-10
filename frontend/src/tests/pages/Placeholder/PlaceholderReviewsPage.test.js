import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PlaceholderReviewsPage from "main/pages/Placeholder/PlaceholderReviewsPage";

describe("PlaceholderReviewsPage tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={["/reviews/1"]}>
                    <Routes>
                        <Route path="/reviews/:itemid" element={<PlaceholderReviewsPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText(/Reviews for Menu Item 1/)).toBeInTheDocument();
        expect(screen.getByText(/Coming Soon!/)).toBeInTheDocument();
    });

    test("renders correct item id from URL", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={["/reviews/42"]}>
                    <Routes>
                        <Route path="/reviews/:itemid" element={<PlaceholderReviewsPage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );

        expect(screen.getByText(/Reviews for Menu Item 42/)).toBeInTheDocument();
    });
});