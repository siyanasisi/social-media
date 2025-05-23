import { useState } from "react";

export const CreatePost = () => {
        const [title, setTitle] = useState<string>("");
        const [content, setContent] = useState<string>("");
    return (  
        <form>
            <div>
                <label> titile </label>
                <input 
                  type="text" 
                  id="title" 
                  required 
                  onChange={(event) => setTitle(event.target.value)}
            />
            </div>
            <div>
                <label> content </label>
                <textarea  
                  id="content" 
                  required rows={5}
                  onChange={(event) => setContent(event.target.value)}
            />
            </div>

            <button type="submit">create post</button>
        </form>
    );
};