import { Link } from "react-router";

export const Navbar = () => {
    return (
    <nav>
        <div> 
            <div>
                <Link to={"/"}>
                    social<span>media</span>
                </Link>

                {/* dsktop links */}
                <div>   
                    <Link to={"/"}>Home</Link>
                    <Link to={"/create"}> Create Post</Link>
                    <Link to={"/communities"}>Communities</Link>
                    <Link to={"/community/create"}>Create Community</Link>
                </div>
            </div>
        </div>
    </nav>
    );
}