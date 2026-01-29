import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Instagram } from "lucide-react";
import Image from "next/image";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
import type { Post } from "@/lib/database.types";
import { formatDate, formatNumber } from "@/lib/format";

export const createPostsColumns = (): ColumnDef<Post>[] => [
  {
    accessorKey: "thumbnail_url",
    header: "",
    cell: ({ row }) => (
      <div className="w-10 h-10">
        {row.original.thumbnail_url ? (
          <Image
            src={row.original.thumbnail_url}
            alt="Thumbnail"
            width={40}
            height={40}
            className="w-10 h-10 rounded object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">N/A</span>
          </div>
        )}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "caption",
    header: "Caption",
    cell: ({ row }) => (
      <div className="max-w-50 truncate" title={row.original.caption ?? ""}>
        {row.original.caption?.slice(0, 50) ?? "No caption"}
        {(row.original.caption?.length ?? 0) > 50 ? "..." : ""}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "platform",
    header: "Platform",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {row.original.platform === "instagram" ? <Instagram className="h-4 w-4" /> : <TikTokIcon className="h-4 w-4" />}
        <span className="capitalize">{row.original.platform}</span>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "likes",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Likes
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => formatNumber(row.original.likes),
  },
  {
    accessorKey: "comments",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Comments
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => formatNumber(row.original.comments),
  },
  {
    accessorKey: "shares",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Shares
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => formatNumber(row.original.shares),
  },
  {
    accessorKey: "engagement_rate",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Eng. Rate
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) =>
      row.original.engagement_rate !== null ? `${Number(row.original.engagement_rate).toFixed(2)}%` : "-",
  },
  {
    accessorKey: "posted_at",
    header: ({ column }) => (
      <button
        className="flex items-center gap-1 hover:text-foreground cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Posted
        <ArrowUpDown className="h-3 w-3" />
      </button>
    ),
    cell: ({ row }) => formatDate(row.original.posted_at),
  },
];
