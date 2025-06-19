import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CommentSection } from "../components/CommentSection";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

vi.mock("../context/AuthContext");
vi.mock("@tanstack/react-query");
vi.mock("../supabase-client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({ data: [], error: null })),
        })),
      })),
      insert: vi.fn(() => ({ error: null })),
    })),
  },
}));

const mockUser = { id: "u1", user_metadata: { user_name: "Tester" } };
const mockMutate = vi.fn();
const mockInvalidate = vi.fn();

describe("CommentSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as unknown as Mock).mockReturnValue({
      user: null,
      isLoading: false,
    });
    (useQuery as unknown as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    (useMutation as unknown as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
    });
    (useQueryClient as unknown as Mock).mockReturnValue({
      invalidateQueries: mockInvalidate,
    });
  });

  it("shows loader", () => {
    (useQuery as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    render(<CommentSection postId={1} />);
    expect(screen.getByText("Loading comments...")).toBeInTheDocument();
  });

  it("shows error message", () => {
    const err = new Error("Fail");
    (useQuery as unknown as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: err,
    });
    render(<CommentSection postId={1} />);
    expect(screen.getByText(`Error: ${err.message}`)).toBeInTheDocument();
  });

  it("prompts login when unauthenticated", () => {
    render(<CommentSection postId={1} />);
    expect(screen.getByText(/please log in to comment/i)).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(/write a comment/i),
    ).not.toBeInTheDocument();
  });

  describe("when authenticated", () => {
    beforeEach(() => {
      (useAuth as unknown as Mock).mockReturnValue({
        user: mockUser,
        isLoading: false,
      });
    });

    it("renders form", () => {
      render(<CommentSection postId={1} />);
      expect(
        screen.getByPlaceholderText(/write a comment/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/post comment/i)).toBeInTheDocument();
    });

    it("submits comment", () => {
      render(<CommentSection postId={1} />);
      fireEvent.change(screen.getByPlaceholderText(/write a comment/i), {
        target: { value: "Hi" },
      });
      fireEvent.click(screen.getByText("Post Comment"));
      expect(mockMutate).toHaveBeenCalledWith({
        content: "Hi",
        parent_comment_id: null,
      });
    });

    it("shows posting state", () => {
      (useMutation as unknown as Mock).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
        isError: false,
      });
      render(<CommentSection postId={1} />);
      expect(screen.getByText("Posting...")).toBeInTheDocument();
    });

    it("shows error on post fail", () => {
      (useMutation as unknown as Mock).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
        isError: true,
      });
      render(<CommentSection postId={1} />);
      expect(screen.getByText("Error posting comment")).toBeInTheDocument();
    });
  });
});
