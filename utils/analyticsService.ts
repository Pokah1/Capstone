import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchAnalyticsData = async () => {
  try {
    // Count total posts, likes, comments using exact count
    const { count: totalPostsCount } = await supabase
      .from("posts")
      .select("id", { count: "exact", head: true });
    const totalPosts = totalPostsCount || 0;

    const { count: totalLikesCount } = await supabase
      .from("post_likes")
      .select("id", { count: "exact", head: true });
    const totalLikes = totalLikesCount || 0;

    const { count: totalCommentsCount } = await supabase
      .from("post_comments")
      .select("id", { count: "exact", head: true });
    const totalComments = totalCommentsCount || 0;

    // Count total users
    const { count: totalUsersCount } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true });
    const totalUsers = totalUsersCount || 0;

    // Count unique users who have posted
    const { data: postsData } = await supabase
      .from("posts")
      .select("user_id");
    const usersWithPosts = postsData
      ? new Set(postsData.map((p) => p.user_id)).size
      : 0;

    // Conversion rate = % of users who posted at least once
    const conversionRate = totalUsers
      ? parseFloat(((usersWithPosts / totalUsers) * 100).toFixed(1))
      : 0;

    return {
      totalPosts,
      totalLikes,
      totalComments,
      conversionRate,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return {
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      conversionRate: 0,
    };
  }
};
