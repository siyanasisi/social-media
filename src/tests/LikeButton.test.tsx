import { describe, it, beforeEach, expect, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LikeButton } from "../components/LikeButton";
import { useAuth } from "../context/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

vi.mock("../context/AuthContext");
vi.mock("@tanstack/react-query");

const mockMutate = vi.fn();
const mockInvalidate = vi.fn();
const mockVotes = [
  { id: 1, post_id: 1, user_id: "u1", vote: 1 },
  { id: 2, post_id: 1, user_id: "u2", vote: -1 },
];

beforeEach(() => {
  vi.clearAllMocks();
  (useQueryClient as Mock).mockReturnValue({
    invalidateQueries: mockInvalidate,
  });
  (useMutation as Mock).mockReturnValue({
    mutate: mockMutate,
    isPending: false,
    isError: false,
  });
});

describe("<LikeButton />", () => {
  it("shows loading state", () => {
    (useQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    (useAuth as Mock).mockReturnValue({ user: null });

    render(<LikeButton postId={1} />);
    expect(screen.getByText(/loading votes/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    const err = new Error("Failed");
    (useQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: err,
    });
    (useAuth as Mock).mockReturnValue({ user: null });

    render(<LikeButton postId={1} />);
    expect(screen.getByText(`Error: ${err.message}`)).toBeInTheDocument();
  });

  it("shows vote counts and highlights user vote", () => {
    (useQuery as Mock).mockReturnValue({
      data: mockVotes,
      isLoading: false,
      error: null,
    });
    (useAuth as Mock).mockReturnValue({
      user: { id: "u1", user_metadata: { user_name: "Alice" } },
    });

    render(<LikeButton postId={1} />);

    const likeBtn = screen.getByText(/👍 1/i);
    const dislikeBtn = screen.getByText(/👎 1/i);

    expect(likeBtn).toBeInTheDocument();
    expect(dislikeBtn).toBeInTheDocument();
    expect(likeBtn).toHaveClass("bg-green-500");
    expect(dislikeBtn).toHaveClass("bg-gray-200");
  });

  it("calls mutate with +1 when 👍 is clicked", () => {
    (useQuery as Mock).mockReturnValue({
      data: mockVotes,
      isLoading: false,
      error: null,
    });
    (useAuth as Mock).mockReturnValue({ user: { id: "u1" } });

    render(<LikeButton postId={1} />);
    fireEvent.click(screen.getByText(/👍 1/i));
    expect(mockMutate).toHaveBeenCalledWith(1);
  });

  it("calls mutate with -1 when 👎 is clicked", () => {
    (useQuery as Mock).mockReturnValue({
      data: mockVotes,
      isLoading: false,
      error: null,
    });
    (useAuth as Mock).mockReturnValue({ user: { id: "u1" } });

    render(<LikeButton postId={1} />);
    fireEvent.click(screen.getByText(/👎 1/i));
    expect(mockMutate).toHaveBeenCalledWith(-1);
  });

  it("throws error when unauthenticated user tries to vote", () => {
    (useQuery as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
    (useAuth as Mock).mockReturnValue({ user: null });
    (useMutation as Mock).mockImplementation(({ mutationFn }) => ({
      mutate: () => {
        try {
          mutationFn(1);
        } catch (e) {
          expect(e).toBeInstanceOf(Error);
          if (e instanceof Error) {
            expect(e.message).toBe("You must be logged in to vote");
          }
        }
      },
    }));

    render(<LikeButton postId={1} />);
    fireEvent.click(screen.getByText(/👍 0/i));
  });
});
