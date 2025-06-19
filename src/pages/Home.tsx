import { PostList } from "../components/PostList";
export const Home = () => {
  return (
    <div className="pt-20">
      <h2 className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-6xl font-bold text-transparent">
        recent posts
      </h2>
      <div>
        <PostList />
      </div>
    </div>
  );
};
