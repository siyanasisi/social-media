import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { CommentItem } from "../components/CommentItem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockMutate = vi.fn();
const mockInvalidateQueries = vi.fn();

vi.mock("@tanstack/react-query", async () => {
  const actual = await import("@tanstack/react-query");
  return {
    ...actual,
    useMutation: () => ({
      mutate: mockMutate,
      isPending: false,
      isError: false,
    }),
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries,
    }),
  };
});

vi.mock("../context/AuthContext", () => {
  return {
    useAuth: () => ({
      user: {
        id: "user-123",
        user_metadata: { user_name: "TestUser" },
      },
    }),
  };
});

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe("CommentItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const comment = {
    id: 1,
    post_id: 123,
    user_id: "user-123",
    parent_comment_id: null,
    author: "AuthorName",
    content: "This is a comment",
    created_at: new Date().toISOString(),
    children: [],
  };

  it("renders comment author and content", () => {
    renderWithProviders(<CommentItem comment={comment} postId={123} />);
    expect(screen.getByText("AuthorName")).toBeInTheDocument();
    expect(screen.getByText("This is a comment")).toBeInTheDocument();
  });

  it("toggles reply form visibility when reply button clicked", () => {
    renderWithProviders(<CommentItem comment={comment} postId={123} />);
    const replyButton = screen.getByText("Reply");
    fireEvent.click(replyButton);
    expect(screen.getByPlaceholderText("write a reply...")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByPlaceholderText("write a reply..."),
    ).not.toBeInTheDocument();
  });

  it("calls mutate function when reply form submitted", async () => {
    renderWithProviders(<CommentItem comment={comment} postId={123} />);

    fireEvent.click(screen.getByText("Reply"));

    const textarea = screen.getByPlaceholderText("write a reply...");
    fireEvent.change(textarea, { target: { value: "My reply" } });

    const postButton = screen.getByText("Post Reply");
    fireEvent.click(postButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("My reply");
    });
  });

  it("does not submit empty reply", () => {
    renderWithProviders(<CommentItem comment={comment} postId={123} />);
    fireEvent.click(screen.getByText("Reply"));

    const postButton = screen.getByText("Post Reply");
    fireEvent.click(postButton);

    expect(mockMutate).not.toHaveBeenCalled();
    const childComment = {
      id: 2,
      post_id: 123,
      user_id: "user-456",
      parent_comment_id: 1,
      author: "ChildAuthor",
      content: "Child comment",
      created_at: new Date().toISOString(),
      children: [],
    };

    const commentWithChildren = {
      ...comment,
      children: [childComment],
    };

    renderWithProviders(
      <CommentItem comment={commentWithChildren} postId={123} />,
    );

    const buttons = screen.getAllByRole("button");
    const toggleButton = buttons[buttons.length - 1];

    fireEvent.click(toggleButton);

    expect(screen.getByText("ChildAuthor")).toBeInTheDocument();
    expect(screen.getByText("Child comment")).toBeInTheDocument();
  });
});
