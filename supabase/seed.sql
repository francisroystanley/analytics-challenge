-- Seed data for Social Media Analytics Dashboard
--
-- INSTRUCTIONS:
-- 1. First create two test users via Supabase Auth (signup in your app or via dashboard)
-- 2. Get their UUIDs from the auth.users table in Supabase
-- 3. Replace the placeholder UUIDs below with actual user UUIDs
-- 4. Run this script in the Supabase SQL Editor

-- Replace these with your actual user UUIDs after creating test accounts
-- User A: Creator focused on lifestyle content
-- User B: Creator focused on tech content

-- ============================================
-- POSTS DATA FOR USER A (replace UUID below)
-- ============================================
-- Replace 'USER_A_UUID_HERE' with actual UUID

INSERT INTO posts (user_id, platform, caption, thumbnail_url, media_type, posted_at, likes, comments, shares, saves, reach, impressions, engagement_rate, permalink) VALUES
('USER_A_UUID_HERE', 'instagram', 'Excited to share our latest product launch! What do you think? #startup #launch', 'https://picsum.photos/seed/post1/400/400', 'image', NOW() - INTERVAL '2 days', 1243, 89, 45, 156, 15420, 18650, 8.93, 'https://instagram.com/p/example1'),
('USER_A_UUID_HERE', 'tiktok', 'Behind the scenes of our creative process #bts #creative', 'https://picsum.photos/seed/post2/400/400', 'video', NOW() - INTERVAL '3 days', 5621, 234, 189, 423, 45000, 52000, 13.43, 'https://tiktok.com/@example/video/123'),
('USER_A_UUID_HERE', 'instagram', 'Monday motivation! How are you starting your week?', 'https://picsum.photos/seed/post3/400/400', 'carousel', NOW() - INTERVAL '5 days', 876, 56, 23, 89, 9800, 11200, 9.74, 'https://instagram.com/p/example3'),
('USER_A_UUID_HERE', 'instagram', 'New recipe alert! This healthy smoothie bowl is perfect for summer', 'https://picsum.photos/seed/post4/400/400', 'image', NOW() - INTERVAL '7 days', 2341, 145, 67, 289, 22100, 26500, 11.54, 'https://instagram.com/p/example4'),
('USER_A_UUID_HERE', 'tiktok', 'Trying the viral coffee trend - did it live up to the hype?', 'https://picsum.photos/seed/post5/400/400', 'video', NOW() - INTERVAL '8 days', 8934, 567, 423, 612, 78000, 92000, 12.72, 'https://tiktok.com/@example/video/124'),
('USER_A_UUID_HERE', 'instagram', 'Sunset vibes from last weekend getaway', 'https://picsum.photos/seed/post6/400/400', 'image', NOW() - INTERVAL '10 days', 1567, 98, 34, 178, 14200, 17800, 11.89, 'https://instagram.com/p/example6'),
('USER_A_UUID_HERE', 'tiktok', 'Day in my life as a content creator', 'https://picsum.photos/seed/post7/400/400', 'video', NOW() - INTERVAL '12 days', 12456, 789, 534, 867, 98000, 115000, 14.06, 'https://tiktok.com/@example/video/125'),
('USER_A_UUID_HERE', 'instagram', 'Home office tour 2024 - finally organized!', 'https://picsum.photos/seed/post8/400/400', 'carousel', NOW() - INTERVAL '14 days', 987, 67, 28, 145, 8900, 10500, 12.26, 'https://instagram.com/p/example8'),
('USER_A_UUID_HERE', 'instagram', 'Quick workout routine you can do anywhere', 'https://picsum.photos/seed/post9/400/400', 'video', NOW() - INTERVAL '16 days', 3421, 234, 112, 398, 31000, 38000, 12.08, 'https://instagram.com/p/example9'),
('USER_A_UUID_HERE', 'tiktok', 'Reacting to my first viral video - 1 year later', 'https://picsum.photos/seed/post10/400/400', 'video', NOW() - INTERVAL '18 days', 15678, 1023, 678, 1234, 125000, 145000, 13.97, 'https://tiktok.com/@example/video/126'),
('USER_A_UUID_HERE', 'instagram', 'Minimalist wardrobe essentials for spring', 'https://picsum.photos/seed/post11/400/400', 'carousel', NOW() - INTERVAL '20 days', 2134, 156, 78, 312, 19500, 24000, 12.14, 'https://instagram.com/p/example11'),
('USER_A_UUID_HERE', 'tiktok', 'POV: You finally organize your life', 'https://picsum.photos/seed/post12/400/400', 'video', NOW() - INTERVAL '22 days', 7823, 456, 289, 567, 62000, 74000, 13.77, 'https://tiktok.com/@example/video/127'),
('USER_A_UUID_HERE', 'instagram', 'Book recommendations for the weekend', 'https://picsum.photos/seed/post13/400/400', 'image', NOW() - INTERVAL '25 days', 1456, 123, 45, 234, 13200, 16000, 12.54, 'https://instagram.com/p/example13'),
('USER_A_UUID_HERE', 'instagram', 'Morning routine that changed my productivity', 'https://picsum.photos/seed/post14/400/400', 'video', NOW() - INTERVAL '28 days', 4567, 345, 167, 489, 42000, 51000, 12.29, 'https://instagram.com/p/example14'),
('USER_A_UUID_HERE', 'tiktok', 'Apartment makeover on a budget', 'https://picsum.photos/seed/post15/400/400', 'video', NOW() - INTERVAL '30 days', 9876, 654, 398, 723, 82000, 96000, 13.32, 'https://tiktok.com/@example/video/128');

-- ============================================
-- POSTS DATA FOR USER B (replace UUID below)
-- ============================================
-- Replace 'USER_B_UUID_HERE' with actual UUID

INSERT INTO posts (user_id, platform, caption, thumbnail_url, media_type, posted_at, likes, comments, shares, saves, reach, impressions, engagement_rate, permalink) VALUES
('USER_B_UUID_HERE', 'instagram', 'New tech setup complete! Rate my desk 1-10', 'https://picsum.photos/seed/tech1/400/400', 'image', NOW() - INTERVAL '1 day', 2345, 178, 89, 234, 21000, 25500, 12.71, 'https://instagram.com/p/tech1'),
('USER_B_UUID_HERE', 'tiktok', 'This AI tool changed how I work forever', 'https://picsum.photos/seed/tech2/400/400', 'video', NOW() - INTERVAL '4 days', 18934, 1234, 867, 1456, 156000, 182000, 13.48, 'https://tiktok.com/@techexample/video/001'),
('USER_B_UUID_HERE', 'instagram', 'Honest review: Is the new MacBook worth it?', 'https://picsum.photos/seed/tech3/400/400', 'carousel', NOW() - INTERVAL '6 days', 3456, 289, 145, 398, 32000, 39000, 12.28, 'https://instagram.com/p/tech3'),
('USER_B_UUID_HERE', 'tiktok', 'Coding tutorial: Build this in 60 seconds', 'https://picsum.photos/seed/tech4/400/400', 'video', NOW() - INTERVAL '9 days', 25678, 1567, 1123, 1987, 198000, 234000, 14.37, 'https://tiktok.com/@techexample/video/002'),
('USER_B_UUID_HERE', 'instagram', 'My favorite VS Code extensions in 2024', 'https://picsum.photos/seed/tech5/400/400', 'carousel', NOW() - INTERVAL '11 days', 4123, 345, 178, 567, 38000, 46000, 12.40, 'https://instagram.com/p/tech5'),
('USER_B_UUID_HERE', 'tiktok', 'You are using ChatGPT wrong - here is why', 'https://picsum.photos/seed/tech6/400/400', 'video', NOW() - INTERVAL '13 days', 45678, 2345, 1789, 2876, 345000, 412000, 14.80, 'https://tiktok.com/@techexample/video/003'),
('USER_B_UUID_HERE', 'instagram', 'Mechanical keyboard collection update', 'https://picsum.photos/seed/tech7/400/400', 'image', NOW() - INTERVAL '15 days', 1876, 134, 56, 289, 17200, 21000, 12.50, 'https://instagram.com/p/tech7'),
('USER_B_UUID_HERE', 'tiktok', 'This programming language will dominate 2024', 'https://picsum.photos/seed/tech8/400/400', 'video', NOW() - INTERVAL '17 days', 12345, 876, 534, 923, 102000, 118000, 13.49, 'https://tiktok.com/@techexample/video/004'),
('USER_B_UUID_HERE', 'instagram', 'Cable management tips for clean setup', 'https://picsum.photos/seed/tech9/400/400', 'video', NOW() - INTERVAL '19 days', 2678, 198, 89, 345, 24500, 29800, 12.37, 'https://instagram.com/p/tech9'),
('USER_B_UUID_HERE', 'instagram', 'My coding journey: 0 to software engineer', 'https://picsum.photos/seed/tech10/400/400', 'carousel', NOW() - INTERVAL '21 days', 5432, 456, 234, 678, 49000, 58000, 12.73, 'https://instagram.com/p/tech10'),
('USER_B_UUID_HERE', 'tiktok', '5 websites every developer should know', 'https://picsum.photos/seed/tech11/400/400', 'video', NOW() - INTERVAL '23 days', 34567, 1987, 1345, 2456, 278000, 325000, 13.98, 'https://tiktok.com/@techexample/video/005'),
('USER_B_UUID_HERE', 'instagram', 'Budget gaming PC build guide', 'https://picsum.photos/seed/tech12/400/400', 'carousel', NOW() - INTERVAL '26 days', 3234, 267, 123, 456, 29800, 36000, 12.31, 'https://instagram.com/p/tech12'),
('USER_B_UUID_HERE', 'tiktok', 'React vs Vue vs Angular in 2024', 'https://picsum.photos/seed/tech13/400/400', 'video', NOW() - INTERVAL '29 days', 8765, 567, 345, 789, 72000, 85000, 13.45, 'https://tiktok.com/@techexample/video/006');

-- ============================================
-- DAILY METRICS FOR USER A (last 30 days)
-- ============================================

INSERT INTO daily_metrics (user_id, date, engagement, reach) VALUES
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '0 days', 2450, 28500),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '1 days', 3120, 35200),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '2 days', 2890, 32100),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '3 days', 4560, 48900),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '4 days', 3780, 41200),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '5 days', 2340, 26800),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '6 days', 1980, 22400),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '7 days', 3450, 38700),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '8 days', 5670, 62300),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '9 days', 4230, 46500),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '10 days', 2890, 31800),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '11 days', 3120, 34500),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '12 days', 6780, 74200),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '13 days', 4560, 49800),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '14 days', 2340, 25600),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '15 days', 1890, 20800),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '16 days', 3450, 37900),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '17 days', 2780, 30400),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '18 days', 7890, 86500),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '19 days', 5430, 59200),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '20 days', 3210, 35100),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '21 days', 2560, 28000),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '22 days', 4320, 47300),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '23 days', 3670, 40100),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '24 days', 2450, 26800),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '25 days', 2890, 31600),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '26 days', 1780, 19500),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '27 days', 3120, 34200),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '28 days', 4560, 49900),
('USER_A_UUID_HERE', CURRENT_DATE - INTERVAL '29 days', 3890, 42500);

-- ============================================
-- DAILY METRICS FOR USER B (last 30 days)
-- ============================================

INSERT INTO daily_metrics (user_id, date, engagement, reach) VALUES
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '0 days', 5670, 62400),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '1 days', 4890, 53700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '2 days', 6230, 68500),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '3 days', 8920, 98100),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '4 days', 7340, 80700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '5 days', 5120, 56300),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '6 days', 4560, 50100),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '7 days', 6780, 74500),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '8 days', 9870, 108500),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '9 days', 7650, 84100),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '10 days', 5430, 59700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '11 days', 4890, 53700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '12 days', 6120, 67300),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '13 days', 12340, 135700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '14 days', 8760, 96300),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '15 days', 5670, 62300),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '16 days', 4230, 46500),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '17 days', 7890, 86700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '18 days', 6540, 71900),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '19 days', 4890, 53700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '20 days', 5430, 59700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '21 days', 15670, 172300),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '22 days', 11230, 123500),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '23 days', 7890, 86700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '24 days', 5670, 62300),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '25 days', 4560, 50100),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '26 days', 6780, 74500),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '27 days', 5120, 56300),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '28 days', 8340, 91700),
('USER_B_UUID_HERE', CURRENT_DATE - INTERVAL '29 days', 6890, 75700);
