import { CommunityList } from "../components/CommunityList";

export const CommunitiesPage = () => {
  return (
    <div className="pt-20">
      <h2 className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-6xl font-bold text-transparent">
        communities
      </h2>
      <CommunityList />
    </div>
  );
};
