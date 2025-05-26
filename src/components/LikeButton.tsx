import { useMutation } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
 

interface Props {
    postId: number;
};

interface Vote {
    id: number; 
    post_id: number;
    user_id: string;
    vote: number;
}
const vote = async (voteValue: number, postId: number, userId: string) => {

     const { data: existingVote} = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle();

    if (existingVote) {
        if(existingVote.vote === voteValue) {
            const { error } = await supabase
                .from("votes")
                .delete()
                .eq("id", existingVote.id);

                if(error) throw new Error(error.message);
        } else {
            const { error } = await supabase
                .from("votes")
                .update({vote: voteValue})
                .eq("id", existingVote.id);

                if(error) throw new Error(error.message);

        }
    } else {
        const { error } = await supabase
            .from("votes")
            .insert({post_id: postId, user_id: userId, vote: voteValue});
        if(error) throw new Error(error.message);
    }


};

const fetchVotes = async (postId: number) : Promise<Vote[]> => {
const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", postId)

    if (error) throw new Error(error.message);
    return data as Vote[];

};
export const LikeButton = ({postId}: Props) => {

    const { user } = useAuth();

    const queryClient = useQueryClient();

    const { data: votes, isLoading, error } = useQuery<Vote[], Error>({
        queryKey: ["votes", postId],
        queryFn: () => fetchVotes(postId),
        refetchInterval: 500
    });
        
    const { mutate } = useMutation({
        mutationFn: (voteValue: number) =>  {

            if (!user) throw new Error("You must be logged in to vote");
             return vote(voteValue, postId, user.id);
    },

    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["votes", postId] });

    }
});

    if (isLoading) return <div>Loading votes...</div>;

    if(error) return <div>Error: {error.message}</div>;
    
    const likes = votes?.filter((v) => v.vote === 1).length || 0;
    const dislikes = votes?.filter((v) => v.vote === -1).length || 0;

    return (
        <div>
            <button onClick={() => mutate(1)}> Like {likes}</button>
            <button onClick={() => mutate(-1)}> Dislike {dislikes}</button>
        </div>
    )
}