import type { Post } from "./PostList";
import { Link } from "react-router";

interface Props {
  post: Post;
}

export const PostItem = ({ post }: Props) => {
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute -inset-1 rounded-[20px] bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 blur-sm transition duration-300 group-hover:opacity-50"></div>

      <Link to={`/post/${post.id}`} className="relative z-10 block">
        <div className="flex h-76 w-80 flex-col overflow-hidden rounded-[20px] border border-[rgb(84,90,106)] bg-[rgb(24,27,32)] p-5 text-white transition-colors duration-300 group-hover:bg-gray-800">
          {/* header - avatar and title */}
          <div className="flex items-center space-x-2">
            {post.avatar_url ? (
              <img
                src={post.avatar_url}
                alt="User Avatar"
                className="h-[35px] w-[35px] rounded-full object-cover"
              />
            ) : (
              <div className="h-[35px] w-[35px] rounded-full bg-gradient-to-tl from-[#8A2BE2] to-[#491F70]" />
            )}
            <div className="flex flex-1 flex-col">
              <div className="mt-2 text-[20px] leading-[22px] font-semibold">
                {post.title}
              </div>
            </div>
          </div>

          {/* image */}
          <div className="mt-2 flex-1">
            <img
              src={post.image_url}
              alt={post.title}
              className="mx-auto max-h-[150px] w-full rounded-[20px] object-cover"
            />
          </div>
          <div className="flex items-center justify-around">
            <span className="flex h-10 w-[50px] cursor-pointer items-center justify-center rounded-lg px-1 font-extrabold">
              ❤️
              <span className="ml-2">{post.like_count ?? 0}</span>
            </span>
            <span className="flex h-10 w-[50px] cursor-pointer items-center justify-center rounded-lg px-1 font-extrabold">
              💬
              <span className="ml-2">{post.comment_count ?? 0}</span>
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
