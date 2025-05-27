import { useAuth } from "../context/AuthContext"
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
interface Props {
    postId: number;
}

interface NewComment {
    content: string;
    parent_comment_id?: number | null;
}

const createComment = async (
    newComment: NewComment, 
    postId: number, 
    userId?: string, 
    author?: string
) => {
    if(!userId || !author) throw new Error("User must be logged in to comment");
    const { error } = await supabase
        .from("comments").insert({
            post_id: postId,
            content: newComment.content,
            user_id: userId,
            parent_comment_id: newComment.parent_comment_id || null,
            author: author
        });
    if (error) throw new Error(error.message);  

    
}

 export const CommentSection = ({ postId }: Props) => {
    const[newCommentText, setNewCommentText] = useState<string>("");
    const { user } = useAuth();

    const { mutate, isPending, isError } = useMutation({
        mutationFn:(newComment: NewComment) => 
            createComment(
                newComment,
                postId, 
                user?.id,
                user?.user_metadata.user_name
        ),
    }) 


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if(!newCommentText) return;

        mutate({ content: newCommentText, parent_comment_id: null});
        setNewCommentText("");
    }
    
    return (
    <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-4"> 
            Comments
        </h3>
        {user ? (
            <form 
            onSubmit={handleSubmit}
            className="mb-4"
            >
                 <textarea
                  value={newCommentText}
                  rows={3} 
                  placeholder="write a comment..." 
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="w-full border border-white/10 bg-transperent p-2 rounded"
                />
                 <button 
                    type="submit" 
                    className="mt-2 bg-purple-500 text-white px-4 py-2 rounded cursor-pointer"
                >
                    {isPending ? "Posting..." : "Post Comment"}
                   
                </button>
                {isError && (
                    <p className="text-red-500 mt-2">Error posting comment</p>
                )}
            </form>
        ) : (
            <p className="mb-4 text-gray-600"> please log in to comment</p>)}

    </div>
    );
 }
