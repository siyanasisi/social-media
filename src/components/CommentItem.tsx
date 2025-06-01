import type { Comment } from "./CommentSection";
import { useState } from "react";

interface Props {
    comment: Comment & {
        children?: Comment[];
    };
    postId: number;
}

export const CommentItem = ({comment, postId}: Props) => {
    const [showReply, setShowReply] = useState<boolean>(false);
    return (
    <div>
        <div>
            <div>
               {/* name of commenter */} 
               <span> {comment.author}</span>
               <span>{new Date(comment.created_at).toLocaleString()}</span>
            </div>
            <p>{comment.content}</p>
            <button onClick={() => setShowReply((prev) => !prev)}>{showReply ? "Cancel" : "Reply"}</button>
        </div>

    </div>
    )
}