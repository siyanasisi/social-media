import { useMutation } from "@tanstack/react-query"
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../supabase-client"


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

    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const navigate = useNavigate()
    
    const { mutate, isPending, isError } = useMutation({
        mutationFn: createCommunity, 
        onSuccess: () => {
          //queryClient.invalidateQueries({ queryKey: ["comments", postId]})
          navigate("/communities")
        },
    }) 


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate({name, description });
    };
    return (
        <form onSubmit={handleSubmit} className="block mb-6 font-medium">
            <h2 className="text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"> 
                create new community 
            </h2>
            <div>
                <label htmlFor="name" className="block mb-2 font-medium"> 
                    community name 
                </label>
                <input 
                    type="text" 
                    id="name" 
                    required
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-while/10 bg-transparent p-2 rounded"
                />
            </div>
            <div>
                <label htmlFor="desciption" className="block mb-2 font-medium"> 
                    description 
                </label>
                <textarea 
                    id="description" 
                    required 
                    rows={3}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-white/10 bg-transperant p-2 rounded"
                />
            </div>
            <button
                type="submit"
                className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
            > {isPending ?  "creating...":"create community"} </button>

            {isError && <p>error creating community</p>}
        </form>
    );
};