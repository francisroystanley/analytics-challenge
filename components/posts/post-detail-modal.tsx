"use client";

import { motion } from "framer-motion";
import { Bookmark, ExternalLink, Eye, Heart, Instagram, MessageCircle, Share2, Users } from "lucide-react";
import Image from "next/image";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Post } from "@/lib/database.types";
import { formatDate, formatNumber } from "@/lib/format";

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

interface PostDetailModalProps {
  post: Post | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MetricItem = ({ icon: Icon, label, value }: MetricItemProps) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
};

const PostDetailModal = ({ post, open, onOpenChange }: PostDetailModalProps) => {
  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0 *:data-[slot=dialog-close]:cursor-pointer">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-h-[calc(90vh-2rem)] overflow-y-auto p-6"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {post.platform === "instagram" ? <Instagram className="h-5 w-5" /> : <TikTokIcon className="h-5 w-5" />}
              <span className="capitalize">{post.platform} Post</span>
              <span className="text-muted-foreground font-normal text-sm capitalize">• {post.media_type}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Thumbnail */}
            {post.thumbnail_url && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Image
                  src={post.thumbnail_url}
                  alt="Post thumbnail"
                  width={400}
                  height={400}
                  className="w-full max-h-75 object-cover rounded-lg"
                />
              </motion.div>
            )}

            {/* Caption */}
            {post.caption && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Caption</h4>
                <p className="text-sm">{post.caption}</p>
              </motion.div>
            )}

            {/* Posted Date */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-sm text-muted-foreground">Posted on {formatDate(post.posted_at, "long")}</p>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              <MetricItem icon={Heart} label="Likes" value={formatNumber(post.likes)} />
              <MetricItem icon={MessageCircle} label="Comments" value={formatNumber(post.comments)} />
              <MetricItem icon={Share2} label="Shares" value={formatNumber(post.shares)} />
              <MetricItem icon={Bookmark} label="Saves" value={formatNumber(post.saves)} />
              <MetricItem icon={Eye} label="Impressions" value={formatNumber(post.impressions)} />
              <MetricItem icon={Users} label="Reach" value={formatNumber(post.reach)} />
            </motion.div>

            {/* Engagement Rate */}
            {post.engagement_rate !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 rounded-lg bg-primary/10 border border-primary/20"
              >
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold text-primary">{Number(post.engagement_rate).toFixed(2)}%</p>
              </motion.div>
            )}

            {/* View on Platform Button */}
            {post.permalink && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Button asChild className="w-full">
                  <a href={post.permalink} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on {post.platform === "instagram" ? "Instagram" : "TikTok"}
                  </a>
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export { PostDetailModal };
