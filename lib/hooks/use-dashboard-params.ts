"use client";

import { useCallback } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ChartViewType, PlatformFilter, SortDirection } from "@/lib/stores/ui-store";

const VALID_PLATFORMS = new Set<string>(Object.values(PlatformFilter));
const VALID_SORT_DIRECTIONS = new Set<string>(Object.values(SortDirection));
const VALID_CHART_TYPES = new Set<string>(Object.values(ChartViewType));
const VALID_PAGE_SIZES = new Set([10, 20, 50]);
const DEFAULTS = {
  platform: PlatformFilter.All,
  sortBy: "posted_at",
  sortOrder: SortDirection.Desc,
  page: 1,
  limit: 10,
  chart: ChartViewType.Area,
} as const;

const parsePlatform = (value: string | null): PlatformFilter => {
  if (value && VALID_PLATFORMS.has(value)) return value as PlatformFilter;

  return DEFAULTS.platform;
};

const parseSortDirection = (value: string | null): SortDirection => {
  if (value && VALID_SORT_DIRECTIONS.has(value)) return value as SortDirection;

  return DEFAULTS.sortOrder;
};

const parseChartViewType = (value: string | null): ChartViewType => {
  if (value && VALID_CHART_TYPES.has(value)) return value as ChartViewType;

  return DEFAULTS.chart;
};

const parsePageNumber = (value: string | null): number => {
  if (!value) return DEFAULTS.page;

  const n = parseInt(value, 10);

  return Number.isFinite(n) && n >= 1 ? n : DEFAULTS.page;
};

const parsePageSize = (value: string | null): number => {
  if (!value) return DEFAULTS.limit;

  const n = parseInt(value, 10);

  return VALID_PAGE_SIZES.has(n) ? n : DEFAULTS.limit;
};

const useDashboardParams = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read values
  const platformFilter = parsePlatform(searchParams.get("platform"));
  const sortColumn = searchParams.get("sortBy") ?? DEFAULTS.sortBy;
  const sortDirection = parseSortDirection(searchParams.get("sortOrder"));
  const page = parsePageNumber(searchParams.get("page"));
  const pageSize = parsePageSize(searchParams.get("limit"));
  const chartViewType = parseChartViewType(searchParams.get("chart"));

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        // Omit params that match defaults to keep URLs clean
        const defaultValue = DEFAULTS[key as keyof typeof DEFAULTS];

        if (String(defaultValue) === value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const qs = params.toString();
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
    },
    [searchParams, pathname],
  );

  const setPlatformFilter = useCallback(
    (filter: PlatformFilter) => {
      updateParams({ platform: filter, page: String(DEFAULTS.page) });
    },
    [updateParams],
  );

  const setSorting = useCallback(
    (column: string, direction: SortDirection) => {
      updateParams({ sortBy: column, sortOrder: direction, page: String(DEFAULTS.page) });
    },
    [updateParams],
  );

  const setPage = useCallback(
    (p: number) => {
      updateParams({ page: String(p) });
    },
    [updateParams],
  );

  const setPageSize = useCallback(
    (size: number) => {
      updateParams({ limit: String(size), page: String(DEFAULTS.page) });
    },
    [updateParams],
  );

  const setChartViewType = useCallback(
    (type: ChartViewType) => {
      updateParams({ chart: type });
    },
    [updateParams],
  );

  return {
    platformFilter,
    sortColumn,
    sortDirection,
    page,
    pageSize,
    chartViewType,
    setPlatformFilter,
    setSorting,
    setPage,
    setPageSize,
    setChartViewType,
  };
};

export { useDashboardParams };
