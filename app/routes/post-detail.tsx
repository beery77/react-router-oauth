import { Form } from "react-router";
import Post, { type PostType } from "~/models/Post";
import PostCard from "../components/PostCard";
import type { Route } from "./+types/post-detail";
import { authenticateUser } from "~/services/auth.server";

export function meta({ data }: { data: { post: PostType } }) {
  return [{ title: data.post.caption }];
}

// Server-side loader function
export async function loader({ request, params }: Route.LoaderArgs) {
  const authUser = await authenticateUser(request);

  // Load the post and the user who created it
  const post = await Post.findById(params.id).populate("user");
  return Response.json({ post, authUserId: authUser._id }); // Return the post and user data
}

// React component
export default function PostDetailPage({ loaderData }: { loaderData: { post: PostType; authUserId: String } }) {
  const { post, authUserId } = loaderData;

  function confirmDelete(event: React.FormEvent) {
    const response = confirm("Please confirm you want to delete this post.");
    if (!response) {
      event.preventDefault();
    }
  }

  return (
    <main className="page" id="post-page">
      <div className="container">
        <h1>{post.caption}</h1>
        {/* Render the PostCard with the post details */}
        <PostCard post={post} />
        {authUserId === post.user._id.toString() && ( // Only show the buttons if the user is the author of the post
          <div className="btns">
            {/* Form to delete the post */}
            <Form action="destroy" method="post" onSubmit={confirmDelete}>
              <button type="submit">Delete</button>
            </Form>
            {/* Form to update the post */}
            <Form action="update">
              <button type="submit">Update</button>
            </Form>
          </div>
        )}
      </div>
    </main>
  );
}
