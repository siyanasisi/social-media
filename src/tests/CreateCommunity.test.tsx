import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateCommunity } from "../components/CreateCommunity";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

// --- MOCKS ---

vi.mock("react-router", async () => {
  const actual: any = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../supabase-client", () => {
  return {
    supabase: {
      from: vi.fn(),
    },
  };
});

// --- TESTS ---

describe("CreateCommunity", () => {
  const mockInsert = vi.fn();
  const mockNavigate = vi.fn();

  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();

    // mock supabase.from().insert()
    (supabase.from as any).mockReturnValue({
      insert: mockInsert,
    });

    // mock navigate
    (useNavigate as unknown as vi.Mock).mockReturnValue(mockNavigate);
  });

  function renderComponent() {
    return render(
      <QueryClientProvider client={queryClient}>
        <CreateCommunity />
      </QueryClientProvider>
    );
  }

  it("submits form and navigates on success", async () => {
    mockInsert.mockResolvedValueOnce({
      error: null,
      data: [{ id: 1 }],
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/community name/i), {
      target: { value: "My Test Community" },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "A nice little test community" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create community/i }));

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith({
        name: "My Test Community",
        description: "A nice little test community",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/communities");
    });
  });

  it("shows error message when creation fails", async () => {
    mockInsert.mockResolvedValueOnce({
      error: { message: "Database error" },
      data: null,
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/community name/i), {
      target: { value: "Bad Community" },
    });

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "This will fail" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create community/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/error creating community/i)
      ).toBeInTheDocument();
    });
  });
});
