import { CreatePost } from "../components/CreatePost";

export const CreatePostPage = () => {
  return (
    <div className="pt-20">
      <h2 className="mb-8 flex flex-col items-center gap-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-center text-5xl font-extrabold text-transparent drop-shadow-lg md:text-6xl">
        <span>
          <span className="mr-2 inline-block align-middle">🚀</span>
          <span className="inline-block align-middle">create a new post</span>
          <span className="ml-2 inline-block align-middle">💻</span>
        </span>
        <span className="mt-2 font-mono text-base text-white/70 md:text-lg">
          mnogo wajen tekst
        </span>
      </h2>
      <CreatePost />
    </div>
  );
};
