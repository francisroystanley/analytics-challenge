"use client";
"use no memo";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Instagram } from "lucide-react";
import Image from "next/image";
import { TikTokIcon } from "@/components/icons/tiktok-icon";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Post } from "@/lib/database.types";
import { formatDate, formatNumber } from "@/lib/format";
import { PlatformFilter } from "@/lib/stores/ui-store";

interface PostsTableProps {
  posts: Post[];
  isLoading?: boolean;
  onPostClick?: (post: Post) => void;
}

const columns: ColumnDef<Post>[] = [
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

const PostsTable = ({ posts, isLoading = false, onPostClick }: PostsTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([{ id: "posted_at", desc: true }]);
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>(PlatformFilter.All);

  const filteredPosts = useMemo(() => {
    if (platformFilter === PlatformFilter.All) return posts;

    return posts.filter(post => post.platform === platformFilter);
  }, [posts, platformFilter]);

  const table = useReactTable({
    data: filteredPosts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-45" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <p className="text-muted-foreground">No posts found. Start creating content to see your analytics!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-4">
        <Select value={platformFilter} onValueChange={value => setPlatformFilter(value as PlatformFilter)}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={PlatformFilter.All}>All Platforms</SelectItem>
            <SelectItem value={PlatformFilter.Instagram}>Instagram</SelectItem>
            <SelectItem value={PlatformFilter.TikTok}>TikTok</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onPostClick?.(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No posts match the current filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export { PostsTable };
