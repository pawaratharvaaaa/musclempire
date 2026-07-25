import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground">
      <Navbar />
      
      <main className="pt-32 pb-24 bg-[#111111]">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="mb-12 border-b border-white/10 pb-8">
            <h1 className="font-display font-black text-white text-[clamp(2rem,4vw,3rem)] leading-none mb-4">
              Terms & <span className="text-gold-gradient">Conditions</span>
            </h1>
            <p className="text-white/40 text-sm tracking-widest uppercase">Last Updated: July 2026</p>
          </div>

          <div className="prose prose-invert max-w-none text-white/70 prose-headings:text-white prose-a:text-[#C8900A]">
            <p className="lead text-lg text-white/90 font-medium">
              Welcome to Muscle Empire. By accessing our facility, purchasing our memberships, or buying our nutraceutical products, you agree to be bound by the following terms and conditions.
            </p>

            <h2 className="text-2xl font-bold mt-10 mb-4 border-l-4 border-[#C8900A] pl-4">1. Gym Membership & Facility Usage</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-white/90">1.1 Assumption of Risk & Liability Waiver</h3>
            <p>
              By participating in workouts, using our gym equipment, or taking part in personal training sessions at Muscle Empire, you acknowledge that physical exercise involves inherent risks. You agree to assume all risks associated with your participation. Muscle Empire, its owners, trainers, and staff shall not be held liable for any personal injury, death, or property loss sustained on the premises, whether caused by negligence or otherwise.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-white/90">1.2 Medical Clearance</h3>
            <p>
              It is your responsibility to consult with a physician before starting any new exercise program. If you have any pre-existing medical conditions, you must inform our staff. Muscle Empire reserves the right to refuse service or membership to anyone if we believe it may be unsafe for them to train.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-white/90">1.3 Gym Etiquette & Rules</h3>
            <p>
              Members must re-rack their weights after use, wipe down machines, and wear appropriate athletic footwear. Harassment of staff or other members will result in immediate termination of membership without a refund.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4 border-l-4 border-[#C8900A] pl-4">2. Nutraceutical Products & Supplements</h2>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-white/90">2.1 Not Medical Advice</h3>
            <p>
              The dietary supplements, protein powders, and nutraceutical products sold by Muscle Empire are intended to support general fitness and well-being. They are <strong>not</strong> intended to diagnose, treat, cure, or prevent any disease. Information provided on packaging or by our staff does not constitute medical advice.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-white/90">2.2 Dietary Disclaimers</h3>
            <p>
              Results from using our nutraceutical products vary by individual and are highly dependent on diet, training routines, and genetics. Please review all product labels for allergens and ingredients before consumption. If you experience any adverse reactions, discontinue use immediately and consult a healthcare professional. Muscle Empire is not liable for allergic reactions, adverse health effects, or lack of intended results from the use of third-party or in-house supplement brands.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-white/90">2.3 Returns & Refunds (Products)</h3>
            <p>
              Due to health and safety regulations, all sales of nutraceutical products, supplements, and food items are <strong>final</strong>. We do not accept returns or exchanges on unsealed or opened products unless the product was sold past its expiration date or was defective at the time of purchase.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4 border-l-4 border-[#C8900A] pl-4">3. Payments, Cancellations & Refunds</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-2 text-white/90">3.1 Memberships</h3>
            <p>
              Gym memberships (monthly, half-yearly, yearly) are strictly non-transferable and non-refundable. Paid subscription plans cannot be paused or frozen unless specifically stated in a separate agreement (e.g., medical emergencies requiring hospitalization, subject to management approval).
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2 text-white/90">3.2 Personal Dietitian Plans</h3>
            <p>
              Payments made for personalized dietitian plans are final. The plans are delivered digitally and as such, no refunds will be issued once the initial consultation has occurred or the plan has been dispatched.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4 border-l-4 border-[#C8900A] pl-4">4. Privacy Policy</h2>
            <p>
              Muscle Empire respects your privacy. We collect personal data solely for the purpose of managing your membership, delivering orders, and communicating promotional offers. We will never sell your personal information or medical data to third parties. For a complete understanding of how your data is handled, please review our full Privacy Policy.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4 border-l-4 border-[#C8900A] pl-4">5. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra.
            </p>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
