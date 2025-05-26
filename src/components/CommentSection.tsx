import { useAuth } from "../context/AuthContext"
import { useState } from "react";

interface Props {
    postId: number;
}

 export const CommentSection = ({ postId }: Props) => {
      const[newCommentText, setNewCommentText] = useState<string>("");
    const { user } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if(!newCommentText) return;

    }
    
    return (
    <div>
        <h3>
            Comments
        </h3>
        {user ? (
            <form onSubmit={handleSubmit}>
                 <textarea
                  value={newCommentText}
                  rows={3} 
                  placeholder="write a comment..." 
                  onChange={(e) => setNewCommentText(e.target.value)}
                />
                 <button type="submit" disabled={!newCommentText}> Post Comment </button>
            </form>
        ) : (
            <p> please log in to comment</p>)}

    </div>
    );
 }
