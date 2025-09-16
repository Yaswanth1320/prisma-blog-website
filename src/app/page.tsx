"use client";
import { useState, useEffect } from "react";
import BlogCard from "@/components/BlogCard";
import BlogCardSkeleton from "@/components/BlogCardSkeleton";
import { FileX2 } from "lucide-react";
interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    image: string;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      // Transform data to match our Post interface
      const transformedPosts = data.map((post: Post) => ({
        ...post,
        author: {
          name: post.author?.name || "Anonymous",
          image: post.author?.image || "/default-avatar.png",
        },
      }));
      setPosts(transformedPosts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4">
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to Blogs</h1>
        <p className="text-lg text-muted-foreground">
          Discover amazing stories and insights from our community.
        </p>
      </section>
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <BlogCardSkeleton key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="flex flex-col items-center text-muted-foreground gap-2">
            <FileX2 className="w-8 h-8" />
            No blogs found
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
