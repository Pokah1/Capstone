import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const fetchAnalyticsData = async () => {
  try {
    // Fetch total posts
    const { data: postsData } = await supabase
      .from("posts")
      .select("*");

    // Handle the case where postsData might be null
    const totalPosts = postsData ? postsData.length : 0;

    // Fetch total likes and comments
    const { data: likesData } = await supabase
      .from("post_likes")
      .select("post_id");
    const { data: commentsData } = await supabase
      .from("post_comments")
      .select("post_id");

    // Handle the case where likesData or commentsData might be null
    const totalLikes = likesData ? likesData.length : 0;
    const totalComments = commentsData ? commentsData.length : 0;

    // Fetch total users
    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact" });
    const totalConversions = totalUsers || 0;

    // Calculate and round the conversion rate
    const conversionRate = totalConversions 
      ? parseFloat((totalPosts / totalConversions * 100).toFixed(1)) 
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
