import { useMutation } from '@tanstack/react-query';
import { supabase } from '../supabase-client';
import { useAuth } from '../context/AuthContext';

interface Props {
    postId: number;
};
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
export const LikeButton = ({postId}: Props) => {

    const {user} = useAuth();
        
    const { mutate } = useMutation({
        mutationFn: (voteValue: number) =>  {

            if (!user) throw new Error("You must be logged in to vote");
             return vote(voteValue, postId, user.id);
    }});
    
    return (
        <div>
            <button onClick={() => mutate(1)}> Like</button>
            <button onClick={() => mutate(-1)}> Dislike</button>
        </div>
    )
}