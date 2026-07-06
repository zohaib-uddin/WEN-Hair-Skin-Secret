import { NextRequest, NextResponse } from "next/server";
import { checkUser, checkAdmin } from "../../../../src/lib/auth-helpers";
import { getSupabaseAdminClient } from "../../../../src/lib/supabase/server";
import { jsPDF } from "jspdf";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("order_id");
    if (!orderId) {
      return NextResponse.json({ error: "Order ID (order_id) parameter is required" }, { status: 400 });
    }

    // 1. Authenticate user context
    const userCheck = await checkUser();
    let isAuthorized = false;
    let loggedInProfileId = "";

    if (userCheck.authenticated) {
      loggedInProfileId = userCheck.profileId;
      // We'll verify if user owns this order OR is admin
      if (userCheck.role === "admin") {
        isAuthorized = true;
      }
    } else {
      // Check if admin directly
      const adminCheck = await checkAdmin();
      if (adminCheck.isAdmin) {
        isAuthorized = true;
      } else {
        return NextResponse.json({ error: "Unauthorized: Sign-in required" }, { status: 401 });
      }
    }

    // 2. Fetch order metadata details
    const adminSupabase = getSupabaseAdminClient();
    const query = adminSupabase
      .from("orders")
      .select(`
        *,
        profiles (
          id,
          email,
          full_name,
          phone
        ),
        order_items (
          id,
          quantity,
          price,
          products (
            id,
            name,
            slug
          )
        )
      `);

    // Allow search by UUID id or standard string order_number
    if (orderId.includes("-") && orderId.length === 36) {
      query.eq("id", orderId);
    } else {
      query.eq("order_number", orderId);
    }

    const { data: order, error } = await query.maybeSingle();

    if (error) {
      console.error("[Invoice API Fetch Error]:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify ownership if not already explicitly authorized as admin
    if (!isAuthorized) {
      if (order.user_id === loggedInProfileId) {
        isAuthorized = true;
      } else {
        return NextResponse.json({ error: "Forbidden: You do not have permission to view this invoice" }, { status: 403 });
      }
    }

    // 3. Generate high-quality luxury invoice PDF using jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Brand Palette Values
    const colorDarkGreen = [31, 77, 58]; // #1F4D3A
    const colorGold = [201, 162, 39]; // #C9A227
    const colorCharcoal = [51, 51, 51]; // #333333
    const colorLightBg = [251, 251, 238]; // #FBFBEE

    // Draw deep classic luxury header banner background rectangle
    doc.setFillColor(colorDarkGreen[0], colorDarkGreen[1], colorDarkGreen[2]);
    doc.rect(0, 0, 210, 42, "F");

    // Golden accent border line below banner
    doc.setDrawColor(colorGold[0], colorGold[1], colorGold[2]);
    doc.setLineWidth(1.5);
    doc.line(0, 42, 210, 42);

    // Header Branding Text
    doc.setTextColor(colorGold[0], colorGold[1], colorGold[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("WEN HAIR & SKIN SECRET", 15, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("ROYAL BOTANICAL ELIXIRS & ORGANIC APOTHECARY", 15, 23);
    doc.text("Lahore, Pakistan | info@wen.com.pk | www.wen.com.pk", 15, 33);

    // Invoice Meta Header (date, order #, invoice text)
    doc.setTextColor(colorGold[0], colorGold[1], colorGold[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("INVOICE", 150, 18);

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Order: ${order.order_number}`, 150, 25);
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 150, 30);
    doc.text(`Status: ${order.status.toUpperCase()}`, 150, 35);

    // Reset settings for Body
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);

    // Draw "Bill To" section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(colorDarkGreen[0], colorDarkGreen[1], colorDarkGreen[2]);
    doc.text("CLIENT DISPATCH COORDINATES:", 15, 55);

    // Coordinates boundary box
    doc.setDrawColor(colorDarkGreen[0], colorDarkGreen[1], colorDarkGreen[2]);
    doc.setLineWidth(0.2);
    doc.rect(14, 58, 182, 32);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    
    const clientName = order.profiles?.full_name || "Valued Customer";
    const clientEmail = order.profiles?.email || "No Email Coordinate";
    const clientAddress = order.shipping_address || "No Delivery address";
    const clientCity = order.city || "Pakistan";
    const clientPhone = order.phone || "No Contact Phone";

    doc.setFont("helvetica", "bold");
    doc.text(`Name:`, 18, 64);
    doc.setFont("helvetica", "normal");
    doc.text(clientName, 35, 64);

    doc.setFont("helvetica", "bold");
    doc.text(`Email:`, 18, 70);
    doc.setFont("helvetica", "normal");
    doc.text(clientEmail, 35, 70);

    doc.setFont("helvetica", "bold");
    doc.text(`Address:`, 18, 76);
    doc.setFont("helvetica", "normal");
    doc.text(`${clientAddress}, ${clientCity}`, 35, 76);

    doc.setFont("helvetica", "bold");
    doc.text(`Phone:`, 18, 82);
    doc.setFont("helvetica", "normal");
    doc.text(clientPhone, 35, 82);

    // Draw Itemized Lineup Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(colorDarkGreen[0], colorDarkGreen[1], colorDarkGreen[2]);
    doc.text("ITEMIZED BATCH BILL LINEUP", 15, 100);

    // Draw Lineup table headers
    doc.setFillColor(colorDarkGreen[0], colorDarkGreen[1], colorDarkGreen[2]);
    doc.rect(14, 104, 182, 8, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("PRODUCT BATCH DESCRIPTION", 18, 109);
    doc.text("QTY", 120, 109);
    doc.text("UNIT PRICE (Rs.)", 140, 109);
    doc.text("LINE TOTAL (Rs.)", 170, 109);

    // Render items
    let currentY = 112;
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);

    const items = order.order_items || [];
    let itemsTotal = 0;

    items.forEach((item: any, idx: number) => {
      currentY += 8;
      
      // Zebra striping backgrounds
      if (idx % 2 === 0) {
        doc.setFillColor(colorLightBg[0], colorLightBg[1], colorLightBg[2]);
        doc.rect(14, currentY - 5, 182, 8, "F");
      }

      // Draw horizontal line separator
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.1);
      doc.line(14, currentY + 3, 196, currentY + 3);

      doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
      const prodName = item.products?.name || "Premium Custom Formulation";
      
      // Ensure product name is within safe layout boundaries
      doc.text(prodName.substring(0, 48), 18, currentY);
      doc.text(String(item.quantity), 122, currentY);
      
      const priceVal = Number(item.price);
      const lineTotal = priceVal * Number(item.quantity);
      itemsTotal += lineTotal;

      doc.text(priceVal.toLocaleString(), 141, currentY);
      doc.text(lineTotal.toLocaleString(), 171, currentY);
    });

    // Draw Summary pricing boxes at bottom of table
    currentY += 15;
    doc.setDrawColor(colorGold[0], colorGold[1], colorGold[2]);
    doc.setLineWidth(0.5);
    doc.line(120, currentY, 196, currentY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(colorCharcoal[0], colorCharcoal[1], colorCharcoal[2]);
    doc.text("Subtotal Flow:", 120, currentY + 6);
    doc.text(`Rs. ${itemsTotal.toLocaleString()}`, 170, currentY + 6);

    doc.text("Shipping & Packing Fee:", 120, currentY + 12);
    doc.text("Rs. 0 (Complimentary)", 170, currentY + 12);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(colorDarkGreen[0], colorDarkGreen[1], colorDarkGreen[2]);
    doc.text("Grand Confirmed Total:", 120, currentY + 19);
    doc.text(`Rs. ${Number(order.total_amount).toLocaleString()}`, 170, currentY + 19);

    // Decorative botanical wax stamp placeholder / signature section
    doc.setDrawColor(colorLightBg[0], colorLightBg[1], colorLightBg[2]);
    doc.setFillColor(colorLightBg[0], colorLightBg[1], colorLightBg[2]);
    doc.rect(15, currentY + 18, 70, 20, "F");

    // Add borders to decorative wax stamp or signature lines
    doc.setDrawColor(colorGold[0], colorGold[1], colorGold[2]);
    doc.setLineWidth(0.2);
    doc.rect(15, currentY + 18, 70, 20);
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(colorGold[0], colorGold[1], colorGold[2]);
    doc.text("Certified Botanical Formulation Dispatch", 18, currentY + 24);
    doc.text("WEN Pakistan Quality Control", 18, currentY + 30);

    // Invoice footer note
    doc.setDrawColor(colorDarkGreen[0], colorDarkGreen[1], colorDarkGreen[2]);
    doc.setLineWidth(0.5);
    doc.line(14, 272, 196, 272);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(colorDarkGreen[0], colorDarkGreen[1], colorDarkGreen[2]);
    doc.text("WEN HAIR & SKIN SECRET - BRIDGING SCIENCE AND NATURE", 15, 278);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(110, 110, 110);
    doc.text("This transaction record serves as an official proof of invoice dispatch. All formulas are packed following strict organic procedures.", 15, 283);

    // Output PDF binary representation payload
    const pdfOutputBuffer = doc.output("arraybuffer");

    return new Response(pdfOutputBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="WEN-Invoice-${order.order_number}.pdf"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });

  } catch (err: any) {
    console.error("[Invoice Generation Failed]:", err);
    return NextResponse.json({ error: `Internal Server Error generating PDF: ${err.message}` }, { status: 500 });
  }
}
