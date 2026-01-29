"use client";

import { useState } from "react";
import { PostDetailModal } from "@/components/posts/post-detail-modal";
import { PostsTable } from "@/components/posts/posts-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Post } from "@/lib/database.types";

interface DashboardContentProps {
  posts: Post[];
}

const DashboardContent = ({ posts = [] }: DashboardContentProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);

    if (!open) {
      setSelectedPost(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <PostsTable posts={posts} onPostClick={handlePostClick} />
        </CardContent>
      </Card>
      <PostDetailModal post={selectedPost} open={modalOpen} onOpenChange={handleModalClose} />
    </>
  );
};

export { DashboardContent };
