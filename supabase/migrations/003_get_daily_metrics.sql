-- Function to fetch daily metrics for the authenticated user.
-- Called via supabase.rpc('get_daily_metrics', { days_count: N }) from the API route.
-- RLS + auth.uid() ensure the function only sees the calling user's data.
CREATE OR REPLACE FUNCTION get_daily_metrics(days_count INTEGER DEFAULT 30)
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  result JSON;
  _start_date DATE;
  _end_date DATE;
BEGIN
  _end_date := CURRENT_DATE;
  _start_date := CURRENT_DATE - days_count;

  SELECT json_build_object(
    'metrics', COALESCE((
      SELECT json_agg(row_to_json(m) ORDER BY m.date ASC)
      FROM daily_metrics m
      WHERE m.user_id = auth.uid()
        AND m.date >= _start_date
        AND m.date <= _end_date
    ), '[]'::json),
    'dateRange', json_build_object(
      'start', _start_date,
      'end', _end_date
    )
  ) INTO result;

  RETURN result;
END;
$$;
