import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostList } from "../components/PostList";
import { useQuery } from "@tanstack/react-query";

vi.mock("../components/PostItem", () => ({
  PostItem: ({ post }: any) => <div data-testid="post-item">{post.title}</div>,
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe("PostList", () => {
  const mockPosts = [
    {
      id: 1,
      title: "Post One",
      content: "Content for post one",
      image_url: "https://image.one",
      created_at: "2023-01-01",
    },
    {
      id: 2,
      title: "Post Two",
      content: "Content for post two",
      image_url: "https://image.two",
      created_at: "2023-01-02",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    (useQuery as unknown as Mock).mockReturnValue({
      isLoading: true,
      error: null,
      data: null,
    });

    render(<PostList />);
    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    (useQuery as unknown as Mock).mockReturnValue({
      isLoading: false,
      error: new Error("Failed to fetch"),
      data: null, 
    });

    render(<PostList />);
    expect(screen.getByText(/error loading posts/i)).toBeInTheDocument();
    expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
  });

  it("renders posts", async () => {
    (useQuery as unknown as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockPosts,
    });

    render(<PostList />);
    const items = await screen.findAllByTestId("post-item");
    expect(items).toHaveLength(2);
    expect(screen.getByText("Post One")).toBeInTheDocument();
    expect(screen.getByText("Post Two")).toBeInTheDocument();
  });
});
