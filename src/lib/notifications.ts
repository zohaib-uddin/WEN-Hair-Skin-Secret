/**
 * Automated notifications system helper for Wen Hair & Skin Secret.
 * Includes tools for constructing premium WhatsApp workflows and email compilations.
 */

interface OrderItem {
  id?: string;
  quantity: number;
  price: number;
  products?: {
    name: string;
  } | null;
}

interface UserProfile {
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
}

interface NotificationOrder {
  id: string;
  order_number: string;
  total_amount: number;
  shipping_address: string;
  city: string;
  phone: string;
  payment_method: string;
  tracking_id?: string | null;
  created_at: string;
  order_items?: OrderItem[];
  profiles?: UserProfile | null;
}

const BRAND_CARE_WHATSAPP = "923211234567"; // Wen Secrets official helpline number (international format)

/**
 * Generates a pre-filled WhatsApp click-to-chat hyperlink for CUSTOMERS to message the brand
 * about their order or confirm it directly.
 */
export function generateOrderConfirmationLink(order: NotificationOrder, user?: UserProfile | null) {
  const customerName = user?.fullName || user?.name || order.profiles?.fullName || order.profiles?.name || "Valued Client";
  
  const text = `Assalam-o-Alaikum Wen Secrets Team,\n\nI have registered my order entry inside your botanical archives!\n\n📋 *Order Number:* ${order.order_number}\n💰 *Total Assessment:* Rs. ${Number(order.total_amount).toLocaleString()}\n🏷️ *Payment Method:* ${order.payment_method.toUpperCase()}\n📦 *Shipment Hub:* ${order.city}\n\nPlease verify and dispatch my elixirs. Shukriya!`;

  return `https://wa.me/${BRAND_CARE_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/**
 * Generates a WhatsApp hyperlink for ADMINISTRATORS to review a new incoming invoice trigger instantly.
 */
export function generateAdminAlertLink(order: NotificationOrder, user?: UserProfile | null) {
  const customerName = user?.fullName || user?.name || order.profiles?.fullName || order.profiles?.name || "General Client";
  const itemsSummary = (order.order_items || [])
    .map((item) => ` - ${item.products?.name || "Extraction Block"} (Qty: ${item.quantity})`)
    .join("\n");

  const text = `🚨 *NEW BOTANICAL SHIPMENT BOOKED!* 🚨\n\n⚡ *Order:* #${order.order_number}\n🤝 *Customer:* ${customerName}\n📞 *Phone:* ${order.phone}\n📍 *Destination:* ${order.shipping_address}, ${order.city}\n💰 *Total Flow:* Rs. ${Number(order.total_amount).toLocaleString()}\n💳 *Method:* ${order.payment_method.toUpperCase()}\n\n*Formulation Lineup:*\n${itemsSummary || "No direct items cataloged"}\n\n👉 Review on admin board immediately!`;

  return `https://wa.me/${BRAND_CARE_WHATSAPP}?text=${encodeURIComponent(text)}`;
}

/**
 * Prepares the complete formatted HTML structure ready to connect with Resend
 * or any SMTP mail delivery microservice.
 */
export function sendOrderEmail(order: NotificationOrder, user?: UserProfile | null): string {
  const customerName = user?.fullName || user?.name || order.profiles?.fullName || order.profiles?.name || "Valued Customer";
  const itemsHtml = (order.order_items || [])
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #EAEAEA;">
        <td style="padding: 12px 0; font-family: sans-serif; font-size: 14px; color: #333333;">
          <strong>${item.products?.name || "Premium Botanical Extract"}</strong>
        </td>
        <td style="padding: 12px 0; text-align: center; font-family: sans-serif; font-size: 14px; color: #666666;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 0; text-align: right; font-family: sans-serif; font-size: 14px; color: #333333; font-weight: bold;">
          Rs. ${Number(item.price).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Your Botanical Recipe Received</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #FCFBEE; font-family: sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #FCFBEE;">
        <tr>
          <td align="center" style="padding: 40px 0;">
            <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 16px; border: 1px solid #E1DEC5; overflow: hidden; box-shadow: 0 4px 12px rgba(31, 77, 58, 0.04);">
              
              <!-- Brand Banner Header -->
              <tr style="background-color: #1F4D3A; text-align: center;">
                <td style="padding: 40px 20px;">
                  <h1 style="color: #C9A227; font-family: serif; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
                    Wen Hair & Skin Secret
                  </h1>
                  <p style="color: #ffffff; font-family: sans-serif; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 3px; margin: 5px 0 0 0;">
                    Royal Heritage formulations
                  </p>
                </td>
              </tr>

              <!-- Greeting Body -->
              <tr>
                <td style="padding: 40px 30px;">
                  <span style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #C9A227; text-transform: uppercase; letter-spacing: 2px;">Receipt Statement</span>
                  <h2 style="font-family: serif; font-size: 22px; color: #1F4D3A; margin: 5px 0 15px 0; font-weight: bold;">
                    Thank You for Your Order, ${customerName}!
                  </h2>
                  <p style="font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #555555; margin: 0 0 30px 0;">
                    Your elixirs have been secured inside our storage vault. Our formulations master is custom packing your recipe with protective golden velvet wrapping.
                  </p>

                  <!-- Order Specifications Table -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; border-bottom: 2px solid #1F4D3A; padding-bottom: 10px;">
                    <tr>
                      <td style="font-family: sans-serif; font-size: 12px; color: #999999; text-transform: uppercase; font-weight: bold; padding-bottom: 5px;">
                        Order Receipt #
                      </td>
                      <td style="font-family: sans-serif; font-size: 12px; color: #999999; text-transform: uppercase; font-weight: bold; text-align: right; padding-bottom: 5px;">
                        Shipped via
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family: monospace; font-size: 16px; color: #1F4D3A; font-weight: bold;">
                        ${order.order_number}
                      </td>
                      <td style="font-family: sans-serif; font-size: 14px; color: #333333; text-align: right; font-weight: bold;">
                        TCS Pakistan (COD)
                      </td>
                    </tr>
                  </table>

                  <!-- Composition Title -->
                  <h3 style="font-family: serif; font-size: 16px; color: #1F4D3A; border-bottom: 1px solid #1F4D3A; padding-bottom: 8px; margin: 0 0 10px 0;">
                    Formula Composition
                  </h3>

                  <!-- Line items list -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <thead>
                      <tr style="border-bottom: 1px solid #1F4D3A;">
                        <th align="left" style="font-family: sans-serif; font-size: 12px; color: #666666; font-weight: bold; padding-bottom: 8px;">Product Formulation</th>
                        <th align="center" style="font-family: sans-serif; font-size: 12px; color: #666666; font-weight: bold; padding-bottom: 8px;">Qty</th>
                        <th align="right" style="font-family: sans-serif; font-size: 12px; color: #666666; font-weight: bold; padding-bottom: 8px;">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                      <tr>
                        <td colspan="2" style="padding: 20px 0 10px 0; font-family: sans-serif; font-size: 14px; color: #333333; font-weight: bold;">
                          Grand Total Assessment:
                        </td>
                        <td style="padding: 20px 0 10px 0; text-align: right; font-family: sans-serif; font-size: 18px; color: #1F4D3A; font-weight: bold;">
                          Rs. ${Number(order.total_amount).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- Shipping Coordinates -->
                  <div style="background-color: #FBFBF6; border: 1px solid #EAE9D4; border-radius: 12px; padding: 20px; margin-top: 30px;">
                    <h4 style="font-family: serif; font-size: 14px; color: #1F4D3A; margin: 0 0 10px 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                      Shipment Coordinates
                    </h4>
                    <p style="font-family: sans-serif; font-size: 13px; color: #555555; margin: 0 0 5px 0;">
                      <strong>Address:</strong> ${order.shipping_address}, ${order.city}
                    </p>
                    <p style="font-family: sans-serif; font-size: 13px; color: #555555; margin: 0;">
                      <strong>Recipient Contact:</strong> ${order.phone}
                    </p>
                  </div>

                </td>
              </tr>

              <!-- Legal / Brand Footer -->
              <tr style="background-color: #F8F7EE; text-align: center; border-top: 1px solid #E1DEC5;">
                <td style="padding: 30px; font-family: sans-serif; font-size: 11px; color: #8E9C95; line-height: 1.5;">
                  <strong style="color: #1F4D3A; display: block; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">
                    Wen Hair & Skin Secret Pakistan
                  </strong>
                  This is a certified purchase statement compiled inside our organic logistics node. For immediate customer support, reach on WhatsApp helpline +${BRAND_CARE_WHATSAPP}.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
