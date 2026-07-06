import { NextRequest } from "next/server";
import { checkAdmin } from "../../../../src/lib/auth-helpers";
import { getSupabaseAdminClient } from "../../../../src/lib/supabase/server";
import { successResponse, errorResponse } from "../../../../src/lib/utils/apiResponse";

// Dynamic configuration rules
export const dynamic = "force-dynamic";

/**
 * GET Router for gathering business model insights, charts parameters, and operational KPI.
 * Secured only to administrators.
 */
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await checkAdmin();
    if (!adminCheck.isAdmin) {
      return errorResponse(adminCheck.error || "User is not authorized for resource", 401);
    }

    const adminSupabase = getSupabaseAdminClient();

    // 1. Dual-Path logic: Try the lightning-fast RPC option first
    try {
      const { data: rpcRevenue, error: revErr } = await adminSupabase.rpc("get_revenue_stats");
      const { data: rpcProducts, error: prodErr } = await adminSupabase.rpc("get_top_products");
      const { data: rpcCategories, error: catErr } = await adminSupabase.rpc("get_category_distribution");
      const { data: rpcRecent, error: recErr } = await adminSupabase.rpc("get_recent_activity");

      if (!revErr && !prodErr && !catErr && !recErr && rpcRevenue) {
        return successResponse({
          source: "rpc",
          revenue: rpcRevenue,
          topProducts: rpcProducts,
          categoryDistribution: rpcCategories,
          recentActivity: rpcRecent
        });
      }
    } catch (e) {
      console.warn("[Analytics API] RPC fallback to active app query mapping:", e);
    }

    // 2. High-performance direct fallback queries
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const [ordersRes, allOrdersRes, itemsRes, messagesRes, categoriesRes] = await Promise.all([
      // Last 30 days orders
      adminSupabase
        .from("orders")
        .select("created_at, total_amount, status")
        .gte("created_at", thirtyDaysAgo),
      // All time order totals
      adminSupabase
        .from("orders")
        .select("total_amount, status"),
      // Order items mappings
      adminSupabase
        .from("order_items")
        .select(`
          quantity,
          price,
          product_id,
          products (
            id,
            name,
            category_id,
            categories ( id, name )
          )
        `),
      // Message count (last 24h)
      adminSupabase
        .from("messages")
        .select("id")
        .gte("created_at", oneDayAgo),
      // Available Categories
      adminSupabase
        .from("categories")
        .select("id, name")
    ]);

    if (ordersRes.error) throw ordersRes.error;
    if (allOrdersRes.error) throw allOrdersRes.error;
    if (itemsRes.error) throw itemsRes.error;
    if (messagesRes.error) throw messagesRes.error;

    const activeOrders30d = (ordersRes.data || []).filter(o => o.status !== "cancelled");
    const activeOrdersAll = (allOrdersRes.data || []).filter(o => o.status !== "cancelled");

    // Calculate revenue aggregates
    const allTimeRevenue = activeOrdersAll.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const last30DaysRevenue = activeOrders30d.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const last7DaysRevenue = activeOrders30d
      .filter(o => new Date(o.created_at) >= new Date(sevenDaysAgo))
      .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    // Group daily revenue over the last 30 days
    const dailyMap: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      dailyMap[dateStr] = 0;
    }

    activeOrders30d.forEach(o => {
      const dateStr = o.created_at.split("T")[0];
      if (dailyMap[dateStr] !== undefined) {
        dailyMap[dateStr] += Number(o.total_amount || 0);
      }
    });

    const dailyRevenueList = Object.keys(dailyMap).map(day => ({
      day,
      revenue: dailyMap[day]
    }));

    // Group Top Best Sellers & Category Volume distributions
    const productSales: Record<string, { id: string; name: string; total_sold: number; total_revenue: number }> = {};
    const categorySales: Record<string, { id: string; name: string; order_count: number; item_count: number }> = {};

    (categoriesRes.data || []).forEach(c => {
      categorySales[c.id] = { id: c.id, name: c.name, order_count: 0, item_count: 0 };
    });

    (itemsRes.data || []).forEach((item: any) => {
      const p = item.products;
      if (p) {
        // Aggregate product sales
        if (!productSales[p.id]) {
          productSales[p.id] = { id: p.id, name: p.name, total_sold: 0, total_revenue: 0 };
        }
        productSales[p.id].total_sold += item.quantity || 0;
        productSales[p.id].total_revenue += (item.quantity || 0) * (item.price || 0);

        // Aggregate category metrics
        const cat = p.categories || (p.category_id ? { id: p.category_id, name: "Uncategorized" } : null);
        if (cat) {
          if (!categorySales[cat.id]) {
            categorySales[cat.id] = { id: cat.id, name: cat.name, order_count: 0, item_count: 0 };
          }
          categorySales[cat.id].item_count += item.quantity || 0;
          categorySales[cat.id].order_count += 1;
        }
      }
    });

    const topProductsList = Object.values(productSales)
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, 5);

    const categoryDistributionList = Object.values(categorySales)
      .sort((a, b) => b.order_count - a.order_count);

    // Recent 24h counters
    const recentOrdersCount = (ordersRes.data || [])
      .filter(o => new Date(o.created_at) >= new Date(oneDayAgo))
      .length;
    const recentMessagesCount = messagesRes.data?.length || 0;

    return successResponse({
      source: "application",
      revenue: {
        all_time: allTimeRevenue,
        last_7_days: last7DaysRevenue,
        last_30_days: last30DaysRevenue,
        daily_revenue: dailyRevenueList
      },
      topProducts: topProductsList,
      categoryDistribution: categoryDistributionList,
      recentActivity: {
        new_orders_24h: recentOrdersCount,
        new_messages_24h: recentMessagesCount
      }
    });

  } catch (err: any) {
    console.error("[Analytics API Exception]:", err);
    return errorResponse(`Could not fetch admin statistics: ${err.message}`, 500);
  }
}
