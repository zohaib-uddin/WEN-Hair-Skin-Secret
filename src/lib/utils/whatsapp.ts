export interface OrderItemType {
  name: string;
  quantity: number;
  variant?: string;
  price: number;
}

export interface OrderType {
  orderId: string;
  totalPrice: number;
  fullName: string;
  phone: string; // The customer's phone number
  address: string;
  city: string;
  items: OrderItemType[];
  couponCode?: string;
  discountPercentage?: number;
  paymentMethod?: string;
  paymentStatus?: string;
}

/**
 * Generates a direct WhatsApp link for the admin to message the CUSTOMER
 * with an order confirmation receipt.
 */
export function generateAdminWhatsAppLink(order: OrderType): string {
  const itemsText = order.items
    .map((item) => `🔹 ${item.name} (${item.variant || "Standard"}) x ${item.quantity} - Rs. ${(Number(item.price) * Number(item.quantity)).toLocaleString()}`)
    .join("\n");

  const couponText = order.couponCode ? `\nCoupon Applied: ${order.couponCode} (${order.discountPercentage}% OFF)` : "";

  const message = `✨ *Order Confirmation - Wen Hair & Skin Secret* ✨

Hi ${order.fullName}, thank you for your order! Your luxury formulations are being prepared.

📦 *Order Details*
Order ID: ${order.orderId}
Payment Method: ${(order.paymentMethod || "COD").toUpperCase()}
Payment Status: ${(order.paymentStatus || "UNPAID").toUpperCase()}${couponText}
*Total Paid/Due: Rs. ${order.totalPrice.toLocaleString()}*

🛍️ *Items Purchased*
${itemsText}

📍 *Shipping & Billing Details*
Address: ${order.address}, ${order.city}

If you have any questions, feel free to reply to this message.
Thank you for choosing Wen Secrets! 🌿`;

  // Clean the customer's phone number (remove spaces, +, etc)
  let customerPhone = order.phone.replace(/[^0-9]/g, "");
  // If local Pakistani number starting with 0, convert to 92
  if (customerPhone.startsWith("0")) {
    customerPhone = "92" + customerPhone.slice(1);
  }

  // Direct deep-link to the CUSTOMER'S phone number
  return `https://wa.me/${customerPhone}?text=${encodeURIComponent(message)}`;
}
