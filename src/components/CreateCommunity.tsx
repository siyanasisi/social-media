import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client";

interface CommunityInput {
  name: string;
  description: string;
}

const createCommunity = async (community: CommunityInput) => {
  const { error, data } = await supabase.from("communities").insert(community);
  if (error) throw new Error(error.message);

  return data;
};
export const CreateCommunity = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      navigate("/communities");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, description });
  };
  return (
    <form onSubmit={handleSubmit} className="mb-6 block font-medium">
      <h2 className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-6xl font-bold text-transparent">
        create new community
      </h2>
      <div>
        <label htmlFor="name" className="mb-2 block font-medium">
          community name
        </label>
        <input
          type="text"
          id="name"
          required
          onChange={(e) => setName(e.target.value)}
          className="border-while/10 w-full rounded border bg-transparent p-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="mb-2 block font-medium">
          description
        </label>
        <textarea
          id="description"
          required
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-transperant w-full rounded border border-white/10 p-2"
        />
      </div>
      <button
        type="submit"
        className="cursor-pointer rounded bg-purple-500 px-4 py-2 text-white"
      >
        {" "}
        {isPending ? "creating..." : "create community"}{" "}
      </button>

      {isError && <p>error creating community</p>}
    </form>
  );
};
