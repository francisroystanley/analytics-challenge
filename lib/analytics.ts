const getDateRange = (days: number): { startDate: string; endDate: string } => {
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  return { startDate, endDate };
};

export { getDateRange };
