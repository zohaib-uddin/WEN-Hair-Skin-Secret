import { Resend } from "resend";

export interface EmailOrder {
  id: string;
  order_number: string;
  total_amount: number;
  shipping_address: string;
  city: string;
  phone: string;
  payment_method: string;
  created_at: string;
  order_items?: Array<{
    quantity: number;
    price: number;
    products?: {
      name: string;
    } | null;
  }>;
}

export interface EmailUser {
  id?: string;
  email?: string;
  fullName?: string;
  name?: string;
}

/**
 * Triggers transactional order fulfillment receipt emails using the Resend platform.
 */
export async function sendOrderConfirmationEmail(order: EmailOrder, user?: EmailUser | null) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Resend Email Service] Missing RESEND_API_KEY environment variable. Skipping email transmission.");
    return { success: false, error: "Missing Resend API Key" };
  }

  try {
    const resend = new Resend(apiKey);
    const customerEmail = user?.email || "";
    if (!customerEmail) {
      console.warn("[Resend Email Service] No email coordinates found for user. Skipping.");
      return { success: false, error: "Missing customer email" };
    }

    const customerName = user?.fullName || user?.name || "Valued Client";
    const orderNumber = order.order_number;
    const totalAmount = Number(order.total_amount).toLocaleString();
    const address = order.shipping_address;
    const city = order.city;

    // Build items rows HTML if items exist representation
    let itemsHtml = "";
    if (order.order_items && Array.isArray(order.order_items)) {
      itemsHtml = order.order_items.map((item: any) => `
        <tr style="border-bottom: 1px solid #EAEAEA;">
          <td style="padding: 10px 0; font-family: sans-serif; font-size: 14px; color: #333333;">
            ${item.products?.name || "Premium Formulations Recipe"}
          </td>
          <td style="padding: 10px 0; font-family: sans-serif; font-size: 14px; text-align: center; color: #666666;">
            ${item.quantity}
          </td>
          <td style="padding: 10px 0; font-family: sans-serif; font-size: 14px; text-align: right; color: #333333; font-weight: bold;">
            Rs. ${Number(item.price).toLocaleString()}
          </td>
        </tr>
      `).join("");
    }

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Order Confirmation - Wen Hair & Skin Secret</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FBFBEE; font-family: sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #FBFBEE;">
          <tr>
            <td align="center" style="padding: 30px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #E1DEC5; overflow: hidden; box-shadow: 0 4px 15px rgba(31, 77, 58, 0.04);">
                
                <!-- luxury Header Banner -->
                <tr style="background-color: #1F4D3A; text-align: center;">
                  <td style="padding: 35px 20px;">
                    <h1 style="color: #C9A227; font-family: sans-serif; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
                      Wen Hair & Skin Secret
                    </h1>
                    <p style="color: #ffffff; font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 4px 0 0 0; opacity: 0.9;">
                      Royal Botanical Archives
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <span style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #C9A227; text-transform: uppercase; letter-spacing: 2px;">Order Secured</span>
                    <h2 style="font-family: serif; font-size: 22px; color: #1F4D3A; margin: 5px 0 15px 0; font-weight: bold;">
                      Order Confirmed, ${customerName}!
                    </h2>
                    <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #555555; margin: 0 0 30px 0;">
                      Thank you for choosing Wen Hair & Skin Secret. We have received your order details and our botanists are actively preparing your high-potency formulations.
                    </p>

                    <!-- Receipt Details Box -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; border-bottom: 2px solid #1F4D3A; padding-bottom: 12px;">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 11px; color: #888888; text-transform: uppercase; font-weight: bold; padding-bottom: 4px;">
                          Order Number
                        </td>
                        <td style="font-family: sans-serif; font-size: 11px; color: #888888; text-transform: uppercase; font-weight: bold; text-align: right; padding-bottom: 4px;">
                          Payment Method
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family: monospace; font-size: 16px; color: #1F4D3A; font-weight: bold;">
                          ${orderNumber}
                        </td>
                        <td style="font-family: sans-serif; font-size: 14px; color: #333333; text-align: right; font-weight: bold; text-transform: uppercase;">
                          ${order.payment_method || "COD"}
                        </td>
                      </tr>
                    </table>

                    <!-- Dynamic Item lines if present -->
                    ${itemsHtml ? `
                    <h3 style="font-family: sans-serif; font-size: 14px; color: #1F4D3A; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1F4D3A; padding-bottom: 8px; margin: 25px 0 10px 0;">
                      Itemized Lineup
                    </h3>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                      <thead>
                        <tr>
                          <th align="left" style="font-family: sans-serif; font-size: 12px; color: #666666; padding-bottom: 8px;">Product</th>
                          <th align="center" style="font-family: sans-serif; font-size: 12px; color: #666666; padding-bottom: 8px;">Qty</th>
                          <th align="right" style="font-family: sans-serif; font-size: 12px; color: #666666; padding-bottom: 8px;">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${itemsHtml}
                      </tbody>
                    </table>
                    ` : ""}

                    <!-- Grand Summary -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F8F7F0; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
                      <tr>
                        <td style="font-family: sans-serif; font-size: 14px; color: #555555; font-weight: bold;">
                          Total Order Flow:
                        </td>
                        <td style="font-family: sans-serif; font-size: 18px; color: #1F4D3A; text-align: right; font-weight: bold;">
                          Rs. ${totalAmount}
                        </td>
                      </tr>
                    </table>

                    <!-- Delivery Coordinates -->
                    <div style="border: 1px solid #E1DEC5; border-radius: 8px; padding: 15px; margin-bottom: 30px;">
                      <h4 style="font-family: sans-serif; font-size: 12px; color: #1F4D3A; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: 1px;">
                        Delivery Destination
                      </h4>
                      <p style="font-family: sans-serif; font-size: 13px; color: #555555; margin: 0 0 4px 0;">
                        <strong>Address:</strong> ${address}, ${city}
                      </p>
                      <p style="font-family: sans-serif; font-size: 13px; color: #555555; margin: 0;">
                        <strong>Contact Phone:</strong> ${order.phone}
                      </p>
                    </div>

                    <!-- Luxury CTA Button -->
                    <div style="text-align: center; margin-top: 20px;">
                      <a href="https://wenhairandskin.com/track-order?order=${orderNumber}" style="display: inline-block; background-color: #1F4D3A; color: #C9A227; font-family: sans-serif; font-size: 14px; font-weight: bold; text-decoration: none; padding: 12px 30px; border-radius: 6px; letter-spacing: 1px; text-transform: uppercase; border: 1px solid #C9A227; transition: background-color 0.2s ease;">
                        Track Your Order
                      </a>
                    </div>

                  </td>
                </tr>

                <!-- luxury Brand Footer -->
                <tr style="background-color: #F5F4EA; border-top: 1px solid #E1DEC5; text-align: center;">
                  <td style="padding: 25px 20px; font-family: sans-serif; font-size: 11px; color: #8C9992; line-height: 1.5;">
                    <strong style="color: #1F4D3A; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">
                      Wen Hair & Skin Secret Pakistan
                    </strong>
                    This message is a certified purchase confirmation dispatch receipt. If you have any inquiries, easily connect with our beauty consultants team via WhatsApp Helpline.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Wen Hair & Skin <zohaibuddin376@gmail.com>", // Or verified custom sender on production
      to: [customerEmail],
      subject: `Order Confirmation: ${orderNumber} - Wen Hair & Skin Secret`,
      html: emailContent,
    });

    if (error) {
      console.error("[Resend Email Service] API Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error("[Resend Email Service] Exception:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Triggers an administrative reply to a user inquiry using the Resend platform.
 */
export async function sendAdminReplyEmail(inquiry: { name: string; email: string; subject: string; message: string; date?: string }, replyContent: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Resend Email Service] Missing RESEND_API_KEY environment variable. Skipping email transmission.");
    return { success: false, error: "Missing Resend API Key" };
  }

  try {
    const resend = new Resend(apiKey);
    const customerEmail = inquiry.email;
    if (!customerEmail) {
      console.warn("[Resend Email Service] No email coordinates found for user. Skipping.");
      return { success: false, error: "Missing customer email" };
    }

    const emailContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Response from Wen Hair & Skin Secret</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FBFBEE; font-family: sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #FBFBEE;">
          <tr>
            <td align="center" style="padding: 30px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; border: 1px solid #E1DEC5; overflow: hidden; box-shadow: 0 4px 15px rgba(31, 77, 58, 0.04);">
                
                <!-- luxury Header Banner -->
                <tr style="background-color: #1F4D3A; text-align: center;">
                  <td style="padding: 35px 20px;">
                    <h1 style="color: #C9A227; font-family: sans-serif; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 3px; text-transform: uppercase;">
                      Wen Hair & Skin Secret
                    </h1>
                    <p style="color: #ffffff; font-family: sans-serif; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin: 4px 0 0 0; opacity: 0.9;">
                      Royal Botanical Archives
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <span style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #C9A227; text-transform: uppercase; letter-spacing: 2px;">Inquiry Response</span>
                    <h2 style="font-family: serif; font-size: 22px; color: #1F4D3A; margin: 5px 0 15px 0; font-weight: bold;">
                      Hello ${inquiry.name},
                    </h2>
                    
                    <p style="color: #555555; font-size: 14px; line-height: 1.6; margin-bottom: 25px;">
                      Thank you for contacting Wen Hair &amp; Skin Secret. Please see the response to your inquiry regarding <strong>"${inquiry.subject}"</strong> below.
                    </p>

                    <!-- Reply Content Box -->
                    <div style="background-color: #F5F7F5; border-left: 3px solid #1F4D3A; padding: 20px; border-radius: 4px; margin-bottom: 30px;">
                      <p style="color: #333333; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${replyContent}</p>
                    </div>

                    <!-- Original Message Box -->
                    <div style="background-color: #FAFAFA; border: 1px solid #EAEAEA; padding: 15px; border-radius: 4px; margin-bottom: 30px;">
                      <h4 style="color: #666666; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Your Original Message</h4>
                      <p style="color: #777777; font-size: 13px; line-height: 1.5; margin: 0; font-style: italic;">"${inquiry.message}"</p>
                    </div>

                    <!-- Footer Details -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-top: 20px; border-top: 1px solid #EAEAEA;">
                          <p style="color: #888888; font-size: 12px; line-height: 1.5; margin: 0;">
                            If you require any further assistance, you may reply directly to this email.<br>
                            Warmest regards,<br>
                            <strong>Wen Customer Support Team</strong>
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- luxury Brand Footer -->
                <tr style="background-color: #F5F4EA; border-top: 1px solid #E1DEC5; text-align: center;">
                  <td style="padding: 25px 20px; font-family: sans-serif; font-size: 11px; color: #8C9992; line-height: 1.5;">
                    <strong style="color: #1F4D3A; display: block; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">
                      Wen Hair & Skin Secret Pakistan
                    </strong>
                    This message is a certified dispatch from our beauty consultants team.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Wen Hair & Skin <zohaibuddin376@gmail.com>", // Or verified custom sender on production
      to: [customerEmail],
      subject: `Re: ${inquiry.subject}`,
      html: emailContent,
    });

    if (error) {
      console.error("[Resend API Error]:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: any) {
    console.error("[Resend Email Service] Exception:", err);
    return { success: false, error: err.message };
  }
}

export async function sendAdminNewUserNotification(user: { email: string; fullName: string; phone?: string; createdAt: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { success: false, error: "Missing API Key" };
  try {
    const resend = new Resend(apiKey);
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com"; // Replace with actual admin email or from config
    const emailContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2>New Customer Sign Up</h2>
        <p>A new customer has registered on the platform.</p>
        <ul>
          <li><strong>Name:</strong> ${user.fullName}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Phone:</strong> ${user.phone || "N/A"}</li>
          <li><strong>Date:</strong> ${new Date(user.createdAt).toLocaleString()}</li>
        </ul>
      </div>
    `;
    const { data, error } = await resend.emails.send({
      from: "Wen Hair & Skin <zohaibuddin376@gmail.com>",
      to: [adminEmail],
      subject: "Alert: New Customer Registration",
      html: emailContent,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, messageId: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function sendInvoiceEmail(order: EmailOrder, user?: EmailUser | null) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Resend Email Service] Missing RESEND_API_KEY environment variable. Skipping invoice.");
    return { success: false, error: "Missing Resend API Key" };
  }

  try {
    const resend = new Resend(apiKey);
    const customerEmail = user?.email || "";
    if (!customerEmail) {
      console.warn("[Resend Email Service] No email for invoice.");
      return { success: false, error: "Missing customer email" };
    }

    const customerName = user?.fullName || user?.name || "Valued Client";
    
    // Calculate totals
    let subtotal = 0;
    let itemsHtml = "";
    if (order.order_items && Array.isArray(order.order_items)) {
      itemsHtml = order.order_items.map((item: any) => {
        const lineTotal = item.quantity * item.price;
        subtotal += lineTotal;
        return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #EAEAEA;">${item.products?.name || "Product"}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EAEAEA; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #EAEAEA; text-align: right;">Rs. ${Number(item.price).toLocaleString()}</td>
        </tr>
      `}).join("");
    }

    const emailContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #1F4D3A; text-align: center;">WEN SECRETS - OFFICIAL INVOICE</h2>
        <p>Dear ${customerName},</p>
        <p>Your order <strong>${order.order_number}</strong> has been delivered successfully. Here is your invoice:</p>
        
        <table width="100%" style="border-collapse: collapse; margin-top: 20px;">
          <tr style="background: #f8f9fa;">
            <th style="padding: 10px; text-align: left;">Item</th>
            <th style="padding: 10px;">Qty</th>
            <th style="padding: 10px; text-align: right;">Price</th>
          </tr>
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
            <td style="padding: 10px; text-align: right;">Rs. ${subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #1F4D3A;">Total Paid:</td>
            <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px; color: #1F4D3A;">Rs. ${Number(order.total_amount).toLocaleString()}</td>
          </tr>
        </table>
        
        <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
          Thank you for trusting Wen Secrets.<br>
          For any questions, reply to this email.
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "Wen Hair & Skin Invoices <zohaibuddin376@gmail.com>",
      to: [customerEmail],
      subject: `Invoice for Order ${order.order_number}`,
      html: emailContent,
    });

    if (error) return { success: false, error: error.message };
    return { success: true, messageId: data?.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

