import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { CommunityList } from "../components/CommunityList";
import { MemoryRouter } from "react-router";

vi.mock("@tanstack/react-query");
vi.mock("../supabase-client");

type Community = {
  id: number;
  name: string;
  description: string;
  created_at: string;
};

const mockCommunities: Community[] = [
  {
    id: 1,
    name: "Test Community 1",
    description: "This is a test community",
    created_at: "2023-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Test Community 2",
    description: "Another test community",
    created_at: "2023-01-02T00:00:00Z",
  },
];

describe("CommunityList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <CommunityList />
      </MemoryRouter>,
    );
    expect(screen.getByText("loading communities...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    const errorMessage = "Failed to fetch communities";
    (useQuery as unknown as Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: errorMessage },
    });

    render(
      <MemoryRouter>
        <CommunityList />
      </MemoryRouter>,
    );
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(screen.getByText(`Error: ${errorMessage}`)).toHaveClass(
      "text-red-500",
    );
  });

  it("renders list of communities when data is loaded", () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: mockCommunities,
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <CommunityList />
      </MemoryRouter>,
    );

    expect(screen.getByText("Test Community 1")).toBeInTheDocument();
    expect(screen.getByText("Test Community 2")).toBeInTheDocument();

    expect(screen.getByText("This is a test community")).toBeInTheDocument();
    expect(screen.getByText("Another test community")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/community/1");
    expect(links[1]).toHaveAttribute("href", "/community/2");

    expect(links[0]).toHaveClass("text-purple-500");
    expect(links[0]).toHaveClass("hover:underline");
  });

  it("renders empty state when no communities are found", () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <CommunityList />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Test Community 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Test Community 2")).not.toBeInTheDocument();
  });
});
