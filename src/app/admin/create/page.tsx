"use client";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import MarkdownRenderer from "@/components/MarkdownRenderer";


const Create = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    

    const createPostPromise = fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, published }),
    });

    showToast.promise(createPostPromise, {
      loading: "Creating post...",
      success: "Post created successfully!",
      error: "Failed to create post. Please try again.",
    });

    try {
        setLoading(true);
      const response = await createPostPromise;
      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      setLoading(false);
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Create New Post</h1>
            <Button
              variant="outline"
              className="dark:hover:text-white"
              onClick={() => setPreview(!preview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {preview ? "Edit" : "Preview"}
            </Button>
          </div>
          <div
            className={`grid grid-cols-1 ${preview && "lg:grid-cols-2 gap-8"}`}
          >
            <Card>
              <CardHeader>
                <CardTitle>Write Post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter post title..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content (Markdown)</Label>
                    <Textarea
                      id="content"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your post in markdown..."
                      rows={20}
                      required
                      className="min-h-80"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={published}
                      onCheckedChange={setPublished}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || (!title.trim() || !content.trim())}
                  >
                    {loading ? <Loader2 className="animate-spin"/> : "Create blog"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {preview && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold">
                      {title || "Post Title"}
                    </h2>
                    <MarkdownRenderer
                      content={content || "Your content will appear here..."}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
