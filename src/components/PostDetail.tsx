import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import type { Post } from "./PostList";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Props {
  postId: number;
}
const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};
export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });
  if (isLoading) return <div>Loading posts...</div>;

  if (error) return <div>Error loading posts: {error.message}</div>;

  return (
    <div className="space-y-6">
      <h2 className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-6xl font-bold text-transparent">
        {data?.title}
      </h2>
      {data?.image_url && (
        <img
          src={data?.image_url}
          alt={data?.title}
          className="mt-4 h-64 w-full rounded object-cover"
        />
      )}
      <p className="text-gray-400"> {data?.content} </p>
      <p className="text-sm text-gray-500">
        posted on {new Date(data!.created_at).toLocaleDateString()}
      </p>
      <LikeButton postId={postId} />
      <CommentSection postId={postId} />
    </div>
  );
};
