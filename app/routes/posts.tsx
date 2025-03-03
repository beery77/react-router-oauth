import { Link, redirect } from "react-router";
import PostCard from "~/components/PostCard";
import Post, { type PostType } from "~/models/Post";
import { sessionStorage } from "~/services/session.server";
import type { Route } from "./+types/posts";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  const authUserId = session.get("authUserId");
  if (!authUserId) {
    throw redirect("/signin");
  }

  const posts = await Post.find().populate("user");
  return Response.json({ posts });
}

export default function PostsPage({ loaderData }: { loaderData: { posts: PostType[] } }) {
  const { posts } = loaderData;

  return (
    <main className="page">
      <section className="grid">
        {posts.map(post => (
          <Link key={post._id.toString()} className="post-link" to={`/posts/${post._id}`}>
            <PostCard post={post} />
          </Link>
        ))}
      </section>
    </main>
  );
}
