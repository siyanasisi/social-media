import type { Post } from "./PostList";
import { Link } from "react-router"

interface Props {
    post: Post;
}

export const PostItem =( {post}: Props) => {
    return (
    <div> 
        <div/>  
        <Link to="/post">
            <div>
                {/*headere - avatar and title*/}
                <div>
                    </div>
                <div>
                    <div>{post.title}</div>
                </div>
            </div>
            {/*image*/}
            <div>
                <img src={post.image_url} alt={post.title}  />
            </div>
            
        </Link>
    </div>
    )
}