import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreatePost } from "../components/CreatePost";
import { useAuth } from "../context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
  useQuery: vi.fn(),
}));

vi.mock("../supabase-client", () => ({
  supabase: {
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn(),
      getPublicUrl: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn(),
  },
}));

import type { Mock } from "vitest";

describe("CreatePost component", () => {
  const mockUser = {
    user_metadata: { avatar_url: "https://avatar.url/image.png" },
    email: "test@example.com",
  };

  const mockCommunities = [
    { id: 1, name: "Community One" },
    { id: 2, name: "Community Two" },
  ];

  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({
      user: mockUser,
    });
    (useQuery as Mock).mockReturnValue({
      data: mockCommunities,
      isLoading: false,
      isError: false,
    });
    (useMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
    });
  });

  it("renders form inputs and communities dropdown", () => {
    render(<CreatePost />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(screen.getByText(/select community/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "--choose a community--" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Community One" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Community Two" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create post/i }),
    ).toBeInTheDocument();
  });

  it("updates title, content, community and file input correctly", () => {
    render(<CreatePost />);

    const titleInput = screen.getByLabelText(/title/i);
    fireEvent.change(titleInput, { target: { value: "My Post Title" } });
    expect(titleInput).toHaveValue("My Post Title");

    const contentInput = screen.getByLabelText(/content/i);
    fireEvent.change(contentInput, { target: { value: "Post content here" } });
    expect(contentInput).toHaveValue("Post content here");

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });
    expect(select).toHaveValue("2");

    const file = new File(["file content"], "test.png", { type: "image/png" });
    const fileInput = screen.getByLabelText(/upload image/i);
    fireEvent.change(fileInput, { target: { files: [file] } });
  });

  it("calls mutate with correct data when form is submitted with file selected", async () => {
    const { container } = render(<CreatePost />);
    const form = container.querySelector("form")!;

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);
    const select = screen.getByRole("combobox");
    const fileInput = screen.getByLabelText(/upload image/i);

    fireEvent.change(titleInput, { target: { value: "My Post Title" } });
    fireEvent.change(contentInput, { target: { value: "My Post Content" } });
    fireEvent.change(select, { target: { value: "1" } });
    const file = new File(["file content"], "test.png", { type: "image/png" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        post: {
          title: "My Post Title",
          content: "My Post Content",
          avatar_url: mockUser.user_metadata.avatar_url,
          community_id: 1,
        },
        imageFile: file,
      });
    });
  });

  it("does not call mutate if no file selected on submit", () => {
    const { container } = render(<CreatePost />);
    const form = container.querySelector("form")!;

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Title" },
    });
    fireEvent.change(screen.getByLabelText(/content/i), {
      target: { value: "Content" },
    });

    fireEvent.submit(form);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("displays loading state when isPending is true", () => {
    (useMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isError: false,
    });

    render(<CreatePost />);

    expect(screen.getByRole("button")).toHaveTextContent(/creating.../i);
  });

  it("displays error message when isError is true", () => {
    (useMutation as Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: true,
    });

    render(<CreatePost />);

    expect(screen.getByText(/error creating post/i)).toBeInTheDocument();
  });
});
