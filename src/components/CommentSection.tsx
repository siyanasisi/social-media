import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentItem } from "./CommentItem";

interface Props {
  postId: number;
}

interface NewComment {
  content: string;
  parent_comment_id?: number | null;
}

export interface Comment {
  id: number;
  post_id: number;
  content: string;
  user_id: string;
  parent_comment_id: number | null;
  created_at: string;
  author: string;
}
const createComment = async (
  newComment: NewComment,
  postId: number,
  userId?: string,
  author?: string,
) => {
  if (!userId || !author) throw new Error("User must be logged in to comment");
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: newComment.content,
    user_id: userId,
    parent_comment_id: newComment.parent_comment_id || null,
    author: author,
  });
  if (error) throw new Error(error.message);
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data as Comment[];
};
export const CommentSection = ({ postId }: Props) => {
  const [newCommentText, setNewCommentText] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    refetchInterval: 5000,
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (newComment: NewComment) =>
      createComment(
        newComment,
        postId,
        user?.id,
        user?.user_metadata.user_name,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCommentText) return;

    mutate({ content: newCommentText, parent_comment_id: null });
    setNewCommentText("");
  };

  const buildCommentTree = (
    flatComments: Comment[],
  ): (Comment & { children?: Comment[] })[] => {
    const map = new Map<number, Comment & { children?: Comment[] }>();
    const roots: (Comment & { children?: Comment[] })[] = [];

    flatComments.forEach((comment) => {
      map.set(comment.id, { ...comment, children: [] });
    });

    flatComments.forEach((comment) => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.children!.push(map.get(comment.id)!);
        }
      } else {
        roots.push(map.get(comment.id)!);
      }
    });

    return roots;
  };

  if (isLoading) return <div>Loading comments...</div>;

  if (error) return <div>Error: {error.message}</div>;

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-2xl font-semibold">Comments</h3>

      {/* create comment section */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            value={newCommentText}
            rows={3}
            placeholder="write a comment..."
            onChange={(e) => setNewCommentText(e.target.value)}
            className="bg-transperent w-full rounded border border-white/10 p-2"
          />
          <button
            type="submit"
            className="mt-2 cursor-pointer rounded bg-purple-500 px-4 py-2 text-white"
          >
            {isPending ? "Posting..." : "Post Comment"}
          </button>
          {isError && (
            <p className="mt-2 text-red-500">Error posting comment</p>
          )}
        </form>
      ) : (
        <p className="mb-4 text-gray-600"> please log in to comment</p>
      )}

      {/* comments display section */}
      <div className="space-y-4">
        {commentTree.map((comment, key) => (
          <CommentItem key={key} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
