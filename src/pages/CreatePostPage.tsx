import { CreatePost } from "../components/CreatePost";

export const CreatePostPage = () => {
    return (
        <div className="pt-20">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg flex flex-col items-center gap-2">
                <span>
                    <span className="inline-block align-middle mr-2">🚀</span>
                    <span className="inline-block align-middle">create a new post</span>
                    <span className="inline-block align-middle ml-2">💻</span>
                </span>
                <span className="text-base md:text-lg font-mono text-white/70 mt-2">
                    mnogo wajen tekst
                </span>
            </h2>
            <CreatePost />
        </div>
    );
};