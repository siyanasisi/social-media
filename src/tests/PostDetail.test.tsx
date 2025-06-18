import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { PostDetail } from "../components/PostDetail";
import { useQuery } from "@tanstack/react-query";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: {
      email: "test@example.com",
      user_metadata: {
        avatar_url: "https://example.com/avatar.png",
      },
    },
  }),
}));


vi.mock("../components/LikeButton", () => ({
  LikeButton: () => <div data-testid="like-button">LikeButton</div>,
}));
vi.mock("../components/CommentSection", () => ({
  CommentSection: () => <div data-testid="comment-section">CommentSection</div>,
}));

const mockPost = {
  id: 1,
  title: "Test Post",
  content: "This is the post content.",
  image_url: "https://example.com/image.jpg",
  created_at: new Date().toISOString(),
};


vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

describe("PostDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<PostDetail postId={1} />);
    expect(screen.getByText(/loading posts/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Fetch failed"),
    });

    render(<PostDetail postId={1} />);
    expect(screen.getByText(/error loading posts/i)).toBeInTheDocument();
    expect(screen.getByText(/fetch failed/i)).toBeInTheDocument();
  });

  it("renders post data successfully", async () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: mockPost,
      isLoading: false,
      error: null,
    });

    render(<PostDetail postId={1} />);

    expect(screen.getByRole("heading", { name: /test post/i })).toBeInTheDocument();
    expect(screen.getByText(/this is the post content/i)).toBeInTheDocument();
    expect(screen.getByAltText(/test post/i)).toHaveAttribute("src", mockPost.image_url);
    expect(screen.getByTestId("like-button")).toBeInTheDocument();
    expect(screen.getByTestId("comment-section")).toBeInTheDocument();
  });

  it("includes LikeButton and CommentSection", () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: mockPost,
      isLoading: false,
      error: null,
    });

    render(<PostDetail postId={1} />);
    expect(screen.getByTestId("like-button")).toBeInTheDocument();
    expect(screen.getByTestId("comment-section")).toBeInTheDocument();
  });
});
