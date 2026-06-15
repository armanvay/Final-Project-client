import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createSubscription } from "@/lib/actions/subscriptions";

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams;

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)");
  }

  const {
    status,
    customer_details: { email: customerEmail },
    metadata,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (status === "open") {
    return redirect("/");
  }

  if (status === "complete") {


//update the newplan for the user in the database


const subsInfo ={
    email: customerEmail,
    planId: metadata.planId
}


const result =await createSubscription(subsInfo);
console.log("Subscription creation result:", result);


    return (
      <div className="w-full min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-black">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle top ambient light effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

          {/* Animated Success Icon Checkmark Container */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl shadow-inner shadow-emerald-500/5 animate-pulse">
            ✓
          </div>

          {/* Header Texts */}
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-sm text-zinc-400">
              Thank you for your purchase. Your account features have been
              provisioned.
            </p>
          </div>

          <hr className="border-zinc-800 my-6" />

          {/* Order Meta Info Box */}
          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl p-4 text-left space-y-3 mb-8">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase font-semibold tracking-wider text-zinc-500">
                Confirmation Email
              </span>
              <span className="text-sm font-medium text-zinc-200 truncate">
                {customerEmail}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed pt-1 border-t border-zinc-800/40">
              We appreciate your business! A receipt and onboarding instructions
              have been sent to your email.
            </p>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/jobs"
              className="w-full py-3 px-4 rounded-xl text-sm font-semibold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
            >
              Go to Dashboard &rarr;
            </Link>

            <p className="text-xs text-zinc-500 mt-2">
              Have questions? Email us at{" "}
              <a
                href="mailto:orders@example.com"
                className="text-zinc-400 hover:text-emerald-400 transition-colors font-medium underline underline-offset-2"
              >
                orders@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
