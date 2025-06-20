import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

export interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}
const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);

  return data as Post[];
};
export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  if (isLoading) return <div>Loading posts...</div>;

  if (error) return <div>Error loading posts: {error.message}</div>;

  console.log(data);
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {data?.map((post, key) => <PostItem post={post} key={key} />)}
    </div>
  );
};
