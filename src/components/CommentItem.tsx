import type { Comment } from "./CommentSection";

interface Props {
    comment: Comment & {
        children?: Comment[];
    };
    postId: number;
}

export const CommentItem = ({comment, postId}: Props) => {
    return (
    <div>
        <div>
            <div>
               {/* name of commenter */} 
               <span> {comment.author}</span>
               <span>{new Date(comment.created_at).toLocaleString()}</span>
            </div>
        </div>
    </div>
    )
}