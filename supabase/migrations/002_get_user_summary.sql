-- Function to compute analytics summary for the authenticated user.
-- Called via supabase.rpc('get_user_summary') from the API route.
-- RLS + auth.uid() ensure the function only sees the calling user's data.
CREATE OR REPLACE FUNCTION get_user_summary()
RETURNS JSON
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  result JSON;
  _total_engagement BIGINT;
  _average_engagement_rate NUMERIC;
  _top_post JSON;
  _trend_percentage NUMERIC;
  _post_count BIGINT;
  _recent_engagement BIGINT;
  _prior_engagement BIGINT;
BEGIN
  -- Get total engagement and post count
  SELECT
    COALESCE(SUM(COALESCE(likes, 0) + COALESCE(comments, 0) + COALESCE(shares, 0)), 0),
    COUNT(*)
  INTO _total_engagement, _post_count
  FROM posts
  WHERE user_id = auth.uid();

  -- Early return if no posts
  IF _post_count = 0 THEN
    RETURN json_build_object(
      'totalEngagement', 0,
      'averageEngagementRate', NULL,
      'topPost', NULL,
      'trendPercentage', NULL,
      'postCount', 0
    );
  END IF;

  -- Average engagement rate (only non-null values)
  SELECT ROUND(AVG(engagement_rate)::numeric, 2)
  INTO _average_engagement_rate
  FROM posts
  WHERE user_id = auth.uid()
    AND engagement_rate IS NOT NULL;

  -- Top post (highest likes + comments + shares)
  SELECT row_to_json(t)
  INTO _top_post
  FROM (
    SELECT *
    FROM posts
    WHERE user_id = auth.uid()
    ORDER BY (COALESCE(likes, 0) + COALESCE(comments, 0) + COALESCE(shares, 0)) DESC
    LIMIT 1
  ) t;

  -- Trend: last 7 days vs prior 7 days
  SELECT COALESCE(SUM(COALESCE(likes, 0) + COALESCE(comments, 0) + COALESCE(shares, 0)), 0)
  INTO _recent_engagement
  FROM posts
  WHERE user_id = auth.uid()
    AND posted_at >= NOW() - INTERVAL '7 days';

  SELECT COALESCE(SUM(COALESCE(likes, 0) + COALESCE(comments, 0) + COALESCE(shares, 0)), 0)
  INTO _prior_engagement
  FROM posts
  WHERE user_id = auth.uid()
    AND posted_at >= NOW() - INTERVAL '14 days'
    AND posted_at < NOW() - INTERVAL '7 days';

  IF _prior_engagement > 0 THEN
    _trend_percentage := ROUND(((_recent_engagement - _prior_engagement)::numeric / _prior_engagement) * 100, 1);
  ELSIF _recent_engagement > 0 THEN
    _trend_percentage := 100;
  ELSE
    _trend_percentage := NULL;
  END IF;

  result := json_build_object(
    'totalEngagement', _total_engagement,
    'averageEngagementRate', _average_engagement_rate,
    'topPost', _top_post,
    'trendPercentage', _trend_percentage,
    'postCount', _post_count
  );

  RETURN result;
END;
$$;
