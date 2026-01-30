"use client";

import { PostDetailModal } from "@/components/posts/post-detail-modal";
import { PostsTable } from "@/components/posts/posts-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeSubscription } from "@/lib/hooks/use-realtime";
import { useModalState } from "@/lib/stores/ui-store";

const DashboardContent = () => {
  useRealtimeSubscription();

  // Get modal state from Zustand store
  const { selectedPost, isModalOpen, closeModal } = useModalState();

  const handleModalClose = (open: boolean) => {
    if (!open) {
      closeModal();
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <PostsTable />
        </CardContent>
      </Card>
      <PostDetailModal post={selectedPost} open={isModalOpen} onOpenChange={handleModalClose} />
    </>
  );
};

export { DashboardContent };
