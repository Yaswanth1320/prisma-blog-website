"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { showToast } from "@/lib/toast";
import MarkdownRenderer from "./MarkdownRenderer";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

const BlogCard = ({ post }: { post: Post }) => {
  const { data: session } = useSession();

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [isLiking, setIsLiking] = useState(false);
  const [likeLoading, setLikeLoading] = useState(true);

  const { title, content, createdAt, author, _count } = post;

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!session?.user?.id) {
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

    fetchLikeStatus();
  }, [post.id, session?.user?.id]);

  const handleLike = async () => {
    if (!session) return;

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
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

    const displayContent = content.slice(0, 100) + (content.length > 100 ? "..." : "");

  return (
    <Card className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 group cursor-pointer">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl md:text-2xl group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          <Link href={`/blogs/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <span className="whitespace-nowrap">{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Image
                src={author.image}
                alt={`${author.name}'s avatar`}
                width={24}
                height={24}
                className="rounded-full ring-2 ring-background"
              />
            </div>
            <span className="font-medium truncate max-w-[120px] sm:max-w-none">
              {author.name}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <MarkdownRenderer content={displayContent} />

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            disabled={isLiking || !session}
            onClick={handleLike}
            className={`flex items-center space-x-2 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 ${
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

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center space-x-2 text-muted-foreground hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 transition-all duration-200"
            aria-label="View comments"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{_count.comments}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
