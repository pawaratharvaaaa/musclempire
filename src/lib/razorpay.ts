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

function showPaymentPopup(success: boolean, paymentId?: string, errorMsg?: string) {
  // Remove existing popup if any
  const existing = document.getElementById("rzp-result-popup");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "rzp-result-popup";
  overlay.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    display:flex;align-items:center;justify-content:center;
    background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  `;

  const box = document.createElement("div");
  box.style.cssText = `
    background:#fff;border-radius:24px;padding:40px 36px;
    max-width:380px;width:90%;text-align:center;
    box-shadow:0 30px 80px rgba(0,0,0,0.4);
    animation:rzp-pop 0.35s cubic-bezier(0.16,1,0.3,1);
  `;

  const style = document.createElement("style");
  style.textContent = `@keyframes rzp-pop{from{opacity:0;transform:scale(0.88) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`;
  document.head.appendChild(style);

  if (success) {
    box.innerHTML = `
      <div style="width:72px;height:72px;background:#dcfce7;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style="font-size:1.4rem;font-weight:900;color:#111;margin:0 0 8px;letter-spacing:-0.5px;">Payment Successful!</h2>
      <p style="color:#555;font-size:0.9rem;margin:0 0 6px;">Welcome to Muscle Empire! 💪</p>
      <p style="color:#999;font-size:0.75rem;margin:0 0 28px;">Payment ID: <strong style="color:#333;">${paymentId || ""}</strong></p>
      <p style="color:#555;font-size:0.85rem;margin:0 0 28px;background:#f0fdf4;border-radius:12px;padding:12px;">Our team will contact you shortly to confirm your membership. Please check your WhatsApp / phone.</p>
      <button id="rzp-close-btn" style="background:#16a34a;color:#fff;border:none;border-radius:12px;padding:14px 32px;font-size:0.9rem;font-weight:800;cursor:pointer;width:100%;">Done</button>
    `;
  } else {
    box.innerHTML = `
      <div style="width:72px;height:72px;background:#fee2e2;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </div>
      <h2 style="font-size:1.4rem;font-weight:900;color:#111;margin:0 0 8px;letter-spacing:-0.5px;">Payment Failed</h2>
      <p style="color:#555;font-size:0.9rem;margin:0 0 6px;">Something went wrong with your payment.</p>
      <p style="color:#999;font-size:0.8rem;margin:0 0 28px;">${errorMsg || "Please try again or use a different payment method."}</p>
      <button id="rzp-close-btn" style="background:#dc2626;color:#fff;border:none;border-radius:12px;padding:14px 32px;font-size:0.9rem;font-weight:800;cursor:pointer;width:100%;">Try Again</button>
    `;
  }

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const closeBtn = document.getElementById("rzp-close-btn");
  if (closeBtn) closeBtn.onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

export async function openRazorpay(name: string, amountInPaise: number) {
  const loaded = await loadScript();
  if (!loaded) {
    showPaymentPopup(false, undefined, "Could not load payment gateway. Please check your internet connection.");
    return;
  }

  const options = {
    key: RAZORPAY_KEY,
    amount: amountInPaise,
    currency: "INR",
    name: "Muscle Empire Gymnasium",
    description: name,
    image: "/favicon.png",
    theme: { color: "#FFD000" },
    handler: (response: { razorpay_payment_id: string }) => {
      showPaymentPopup(true, response.razorpay_payment_id);
    },
    modal: { ondismiss: () => {} },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.on("payment.failed", (r: any) => {
    showPaymentPopup(false, undefined, r?.error?.description || "Payment was declined.");
  });
  rzp.open();
}
