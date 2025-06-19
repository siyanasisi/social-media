import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { useQuery } from "@tanstack/react-query";
import { CommunityDisplay } from "../components/CommunityDisplay"; // Adjust path as needed

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

const mockedUseQuery = useQuery as unknown as ReturnType<typeof vi.fn>;

describe("CommunityDisplay (Vitest)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state", () => {
    mockedUseQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: { communities: [] },
    });

    render(<CommunityDisplay communityId={1} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockedUseQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: "Something went wrong" },
      data: { communities: [] },
    });

    render(<CommunityDisplay communityId={1} />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });
});
