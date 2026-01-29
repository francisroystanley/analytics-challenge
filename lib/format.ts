type DateFormatStyle = "short" | "long" | "chart";

const formatNumber = (num: number | null, options?: { fallback?: string }): string => {
  const fallback = options?.fallback ?? "-";

  if (num === null) return fallback;

  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;

  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;

  return num.toLocaleString();
};

const formatDate = (dateString: string | Date, style: DateFormatStyle = "short"): string => {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  switch (style) {
    case "long":
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    case "chart":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

    case "short":
    default:
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
  }
};

export { formatDate, formatNumber, type DateFormatStyle };
