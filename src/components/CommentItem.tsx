import type { Comment } from "./CommentSection";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  comment: Comment & {
    children?: Comment[];
  };
  postId: number;
}
const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string,
) => {
  if (!userId || !author) throw new Error("User must be logged in to reply");

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    user_id: userId,
    parent_comment_id: parentCommentId,
    author: author,
  });
  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata.user_name,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyText) return;

    mutate(replyText);
  };
  return (
    <div className="border-l border-white/10 pl-4">
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          {/* name of commenter */}
          <span className="text-sm font-bold text-blue-400">
            {comment.author}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(comment.created_at).toLocaleString()}
          </span>
        </div>
        <p className="text-gray-300">{comment.content}</p>
        <button
          onClick={() => setShowReply((prev) => !prev)}
          className="mt-1 text-sm text-blue-500"
        >
          {showReply ? "Cancel" : "Reply"}
        </button>
      </div>

      {showReply && user && (
        <form onSubmit={handleReplySubmit} className="mb-4">
          <textarea
            value={replyText}
            rows={2}
            placeholder="write a reply..."
            onChange={(e) => setReplyText(e.target.value)}
            className="bg-transperent w-full rounded border border-white/10 p-2"
          />
          <button
            type="submit"
            className="mt-2 cursor-pointer rounded bg-purple-500 px-4 py-2 text-white"
          >
            {isPending ? "Posting..." : "Post Reply"}
          </button>
          {isError && <p className="mt-2 text-red-500">Error posting reply</p>}
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div>
          <button onClick={() => setIsCollapsed((prev) => !prev)}>
            {isCollapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            )}
          </button>

          {isCollapsed && (
            <div className="space-y-2">
              {comment.children.map((child, key) => (
                <CommentItem key={key} comment={child} postId={postId} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
