import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { PostItem } from "../components/PostItem";
import type { Post } from "../components/PostList";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

const basePost: Post = {
  id: 1,
  title: "Test Post",
  content: "Example content",
  image_url: "https://example.com/image.png",
  created_at: "2024-01-01T00:00:00Z",
  avatar_url: "https://example.com/avatar.png",
  like_count: 10,
  comment_count: 5,
};

describe("PostItem", () => {
  it("renders post title and image", () => {
    renderWithRouter(<PostItem post={basePost} />);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByAltText("Test Post")).toHaveAttribute(
      "src",
      basePost.image_url,
    );
  });

  it("renders avatar if avatar_url exists", () => {
    renderWithRouter(<PostItem post={basePost} />);

    const avatar = screen.getByAltText("User Avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", basePost.avatar_url);
  });

  it("renders fallback avatar when avatar_url is missing", () => {
    const postWithoutAvatar: Post = { ...basePost, avatar_url: undefined };

    renderWithRouter(<PostItem post={postWithoutAvatar} />);

    expect(screen.queryByAltText("User Avatar")).toBeNull();

    const fallbackAvatar = screen.getByRole("img", { hidden: true });
    expect(fallbackAvatar).toBeInTheDocument();
  });

  it("displays like and comment counts", () => {
    renderWithRouter(<PostItem post={basePost} />);

    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("defaults like/comment count to 0 if undefined", () => {
    const postNoCounts: Post = {
      ...basePost,
      like_count: undefined,
      comment_count: undefined,
    };

    renderWithRouter(<PostItem post={postNoCounts} />);

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it("wraps entire card with link to post details", () => {
    renderWithRouter(<PostItem post={basePost} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/post/${basePost.id}`);
  });
});
