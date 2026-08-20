// Replace with your actual Razorpay Key ID from dashboard.razorpay.com
export const RAZORPAY_KEY = "rzp_live_TQ79jJCu8KnJAB";

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export async function openRazorpay(name: string, amountInPaise: number) {
  const loaded = await loadScript();
  if (!loaded) { alert("Could not load payment gateway. Check your connection."); return; }

  const options = {
    key: RAZORPAY_KEY,
    amount: amountInPaise,
    currency: "INR",
    name: "Muscle Empire Gymnasium",
    description: name,
    image: "/favicon.png",
    theme: { color: "#FFD000" },
    handler: (response: { razorpay_payment_id: string }) => {
      alert(`✅ Payment successful!\nID: ${response.razorpay_payment_id}\nWelcome to the Empire!`);
    },
    modal: { ondismiss: () => {} },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.on("payment.failed", (r: any) => alert(`❌ Payment failed: ${r.error.description}`));
  rzp.open();
}
