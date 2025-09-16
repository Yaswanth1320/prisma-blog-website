"use client";

import CommentSection from "@/components/comment-section";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Heart, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function PostPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [likeLoading, setLikeLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [params.id]);

  useEffect(() => {
    if (post) {
      setLikeCount(post._count.likes);
      fetchLikeStatus();
    }
  }, [post, session?.user?.id]);

  const fetchPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      }
    } catch (error) {
      console.error("Failed to fetch post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeStatus = async () => {
    if (!session?.user?.id || !post) {
      setLikeLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post.id}/like-status`);
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error("Failed to fetch like status:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleLike = async () => {
    if (!session || !post) return;

    try {
      setIsLiking(true);
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
      });
      const data = await response.json();

      setIsLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading post...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Image
                  src={post.author.image}
                  alt={`${post.author.name}'s avatar`}
                  width={48}
                  height={48}
                  className="rounded-full ring-2 ring-background"
                />
                <div>
                  <p className="font-semibold text-lg">{post.author.name}</p>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isLiking || !session || likeLoading}
                  onClick={handleLike}
                  className={`flex items-center space-x-2 transition-all duration-200 ${
                    isLiked
                      ? "text-red-500 hover:text-red-600"
                      : "text-muted-foreground hover:text-red-500"
                  }`}
                  aria-label={isLiked ? "Unlike this post" : "Like this post"}
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-200 ${
                      isLiked ? "fill-current scale-110" : "scale-100"
                    }`}
                  />
                  <span className="text-sm font-medium">{likeCount}</span>
                </Button>

                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {post._count.comments}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
            <MarkdownRenderer content={post.content} />
          </div>

          {/* Comments Section */}
          <CommentSection postId={post.id} />
        </article>
      </main>
    </div>
  );
}
