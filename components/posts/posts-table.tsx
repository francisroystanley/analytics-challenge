"use client";

import { useCallback, useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable, type SortingState } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePosts } from "@/lib/hooks/use-posts";
import { SortDirection, useModalState, usePostsTableState } from "@/lib/stores/ui-store";
import { createPostsColumns } from "./posts-table-columns";
import { PostsTableEmpty } from "./posts-table-empty";
import { PostsTableError } from "./posts-table-error";
import { PostsTableFilters } from "./posts-table-filters";
import { PostsTablePagination } from "./posts-table-pagination";
import { PostsTableSkeleton } from "./posts-table-skeleton";

const PostsTable = () => {
  // UI state from Zustand
  const { page, pageSize, platformFilter, sortColumn, sortDirection, setSorting } = usePostsTableState();
  const { openModal } = useModalState();

  // Sorting state for TanStack Table
  const sorting: SortingState = useMemo(
    () => [{ id: sortColumn, desc: sortDirection === SortDirection.Desc }],
    [sortColumn, sortDirection],
  );

  // Server state from TanStack Query
  const { data, isLoading, isFetching, isError, error, refetch } = usePosts({
    page,
    limit: pageSize,
    sortBy: sortColumn,
    sortOrder: sortDirection,
    platform: platformFilter,
  });
  const posts = data?.posts ?? [];
  const pagination = data?.pagination ?? { page: 1, limit: 10, total: 0, totalPages: 0 };

  // Handlers
  const handleSortingChange = useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      if (newSorting.length > 0) {
        const { id, desc } = newSorting[0];
        setSorting(id, desc ? SortDirection.Desc : SortDirection.Asc);
      }
    },
    [sorting, setSorting],
  );

  // Memoized columns
  const columns = useMemo(() => createPostsColumns(), []);

  const table = useReactTable({
    data: posts,
    columns,
    state: { sorting },
    onSortingChange: handleSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: pagination.totalPages,
  });

  // Display range calculation
  const startItem = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endItem = Math.min(pagination.page * pagination.limit, pagination.total);

  // Loading state
  if (isLoading) {
    return <PostsTableSkeleton />;
  }

  // Error state
  if (isError) {
    return <PostsTableError error={error instanceof Error ? error : null} onRetry={refetch} />;
  }

  // Empty state
  if (pagination.total === 0 && !isFetching) {
    return <PostsTableEmpty />;
  }

  return (
    <div className="space-y-4">
      <PostsTableFilters startItem={startItem} endItem={endItem} total={pagination.total} isFetching={isFetching} />

      {/* Table */}
      <div className="relative rounded-md border">
        {isFetching && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
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
                  onClick={() => openModal(row.original)}
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

      <PostsTablePagination totalPages={pagination.totalPages} isFetching={isFetching} />
    </div>
  );
};

export { PostsTable };
