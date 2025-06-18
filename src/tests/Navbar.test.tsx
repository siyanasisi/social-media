import { describe, it, vi, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "../components/Navbar";
import * as AuthContext from "../context/AuthContext";

vi.mock("react-router", () => ({
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

describe("Navbar (unauthenticated)", () => {
  beforeEach(() => {
    (AuthContext.useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: null,
      signInWithGitHub: vi.fn(),
      signOut: vi.fn(),
    });
  });

  it("renders main links", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("link", { name: /social \.media/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create post/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /communities/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /create community/i }),
    ).toBeInTheDocument();
  });

  it("shows sign-in button when user is not logged in", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("button", { name: /sign in with github/i }),
    ).toBeInTheDocument();
  });

  it("toggles mobile menu on click", () => {
    render(<Navbar />);
    const toggleBtn = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(toggleBtn);

    expect(
      screen.getAllByRole("link", { name: /home/i }).length,
    ).toBeGreaterThan(1);
  });
});

describe("Navbar (authenticated)", () => {
  beforeEach(() => {
    (AuthContext.useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        user_metadata: {
          user_name: "testuser",
          avatar_url: "https://example.com/avatar.jpg",
        },
        email: "testuser@example.com",
      },
      signInWithGitHub: vi.fn(),
      signOut: vi.fn(),
    });
  });

  it("shows user avatar and display name", () => {
    render(<Navbar />);
    const avatar = screen.getByAltText(/user avatar/i);
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", "https://example.com/avatar.jpg");
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });

  it("shows sign out button", () => {
    render(<Navbar />);
    expect(
      screen.getByRole("button", { name: /sign out/i }),
    ).toBeInTheDocument();
  });

  it("calls signOut function when clicking sign out", () => {
    const signOutMock = vi.fn();

    (AuthContext.useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      user: {
        user_metadata: {
          user_name: "testuser",
          avatar_url: "https://example.com/avatar.jpg",
        },
        email: "testuser@example.com",
      },
      signInWithGitHub: vi.fn(),
      signOut: signOutMock,
    });

    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
    expect(signOutMock).toHaveBeenCalled();
  });

  it("toggles mobile menu on click", () => {
    render(<Navbar />);
    const toggleBtn = screen.getByRole("button", { name: /toggle menu/i });
    fireEvent.click(toggleBtn);
    expect(
      screen.getAllByRole("link", { name: /home/i }).length,
    ).toBeGreaterThan(1);
  });
});
