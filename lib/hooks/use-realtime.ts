"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { queryKeys } from "@/lib/queries/keys";

export function useRealtimeSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "daily_metrics" },
        () => {
          queryClient.invalidateQueries({ queryKey: queryKeys.metrics.all });
          queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
