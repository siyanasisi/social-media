import { PostList } from '../components/PostList';
export const Home = () => {
    return (
    <div>
        <h2>
            recent posts
         </h2>
         <div>
            <PostList/>
         </div>
    </div>
    );
}