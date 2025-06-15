import { ChangeEvent,  useState } from "react";
import { useMutation } from "@tanstack/react-query"
import { supabase } from "../supabase-client"
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { Community } from "./CommunityList";
import { fetchCommunities} from "./CommunityList"



interface PostInput {
    title: string;
    content: string;
    avatar_url: string | null;
    community_id?: number | null;
}
const createPost = async (post: PostInput, imageFile: File) => {

    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

    const {error: uploadError} = await supabase.storage
        .from("post-image")
        .upload(filePath, imageFile);
    
    if (uploadError) throw new Error(uploadError.message);

    const { data: publicURLData } = supabase.storage
        .from("post-image")
        .getPublicUrl(filePath);

    const {data, error} = await supabase
        .from("posts")
        .insert({...post, image_url: publicURLData.publicUrl});

    if (error) throw new Error(error.message);
    

    return data;
};

export const CreatePost = () => {
        const [title, setTitle] = useState<string>("");
        const [content, setContent] = useState<string>("");  
        const [communityId, setCommunityId] = useState<number | null>(null); 

        const[selectedFile, setSelectedFile] = useState<File | null>(null);

        const { user } = useAuth();
        
        const {data: communities } = useQuery<Community[], Error>({
            queryKey: ["communities"], 
            queryFn: fetchCommunities})

        const {mutate, isPending, isError} = useMutation({
            mutationFn: (data: {post: PostInput, imageFile: File}) => {
             return createPost(data.post, data.imageFile);
        },
    });

        const handleSubmit = (event: React.FormEvent) => {
            event.preventDefault();
            if(!selectedFile) return;
            mutate(
                {
                post: {
                    title,
                    content, 
                    avatar_url: user?.user_metadata.avatar_url || null,
                    community_id: communityId
                },
                imageFile: selectedFile
            }
        );

        };


    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCommunityId(value ? Number(value) : null )
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    return (  
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            <div>
                <label htmlFor="title" className="block mb-2 font-medium">
                     title 
                </label>
                <input 
                  type="text" 
                  id="title" 
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full border border-white/10 bg-transparent p-2 rounded"
                  required
            />
            </div>
            <div>
                <label htmlFor="content" className="block mb-2 font-medium">
                     content 
                </label>
                <textarea  
                  id="content" 
                  value={content}
                  required 
                  rows={5}
                  className="w-full border border-white/10 bg-transparent p-2 rounded"
                  onChange={(event) => setContent(event.target.value)}
            />
            </div>

            <div>
                <label> select community </label>
                <select id="community" onChange={handleCommunityChange}>
                    <option value={""}> --choose a community--</option>
                    {communities?.map((community, key) => (
                        <option key={key} value={community.id}>
                            {community.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="image" className="block mb-2 font-medium"> 
                    upload image 
                </label>
                <input
                  type="file" 
                  id="image" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="w-full text-gray-200"
            />
            </div>
            <button 
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointed transition-colors duration-300 hover:bg-purple-800"
                >
                {isPending ? "Creating..." : "Create Post"}
            </button>
            {isError && <p className="text-red-500">Error creating post</p>}
        </form>
    );
};