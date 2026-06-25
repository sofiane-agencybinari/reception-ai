const baseUrl = process.env.WEBHOOK_BASE_URL ?? "http://localhost:3000";
const secret = process.env.ORDERS_WEBHOOK_SECRET;

const payload = {
  callId: `test_${Date.now()}`,
  customerName: "Test Webhook",
  customerPhone: process.env.TEST_CUSTOMER_PHONE ?? "+33612345678",
  notes: "Commande de test automatique",
  items: [
    { name: "Burger Classique", quantity: 1, unitPrice: 8.9 },
    { name: "Frites", quantity: 1, unitPrice: 3.5 },
  ],
};

const headers = { "Content-Type": "application/json" };
if (secret) headers["x-webhook-secret"] = secret;

const res = await fetch(`${baseUrl}/api/orders/from-call`, {
  method: "POST",
  headers,
  body: JSON.stringify(payload),
});

const body = await res.text();
console.log(`POST ${baseUrl}/api/orders/from-call`);
console.log(`Status: ${res.status}`);
console.log(body);

if (!res.ok) process.exit(1);
