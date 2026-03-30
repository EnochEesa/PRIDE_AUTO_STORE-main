"use client";

import Link from "next/link";
import { ArrowLeft, Mail, MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/auth/login"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Sign In
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-white/5 bg-dark-800 p-8">
            <p className="section-label mb-3">Account Support</p>
            <h1 className="mb-4 font-display text-5xl tracking-wider text-white">
              PASSWORD HELP
            </h1>
            <p className="max-w-xl text-white/50">
              Self-service password reset is not live yet. Reach out to our team and
              we will help you recover access quickly.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3 border border-white/5 bg-dark-700/50 p-4">
                <Mail className="mt-0.5 h-5 w-5 text-brand-400" />
                <div>
                  <p className="font-semibold text-white">Email support</p>
                  <a
                    href="mailto:prideautostore2000@gmail.com"
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    prideautostore2000@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 border border-white/5 bg-dark-700/50 p-4">
                <PhoneCall className="mt-0.5 h-5 w-5 text-brand-400" />
                <div>
                  <p className="font-semibold text-white">Call us</p>
                  <a
                    href="tel:+919944140272"
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    +91 99441 40272
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 border border-white/5 bg-dark-700/50 p-4">
                <MessageCircle className="mt-0.5 h-5 w-5 text-brand-400" />
                <div>
                  <p className="font-semibold text-white">WhatsApp</p>
                  <a
                    href="https://wa.me/919944140272"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-white/50 transition-colors hover:text-white"
                  >
                    Chat with our support desk
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/5 bg-dark-800 p-8">
            <div className="mb-6 flex h-14 w-14 items-center justify-center border border-brand-500/30 bg-brand-500/10">
              <ShieldCheck className="h-6 w-6 text-brand-400" />
            </div>
            <h2 className="mb-3 font-display text-3xl tracking-wider text-white">
              WHAT TO SEND
            </h2>
            <ul className="space-y-3 text-sm text-white/50">
              <li>Your account email address</li>
              <li>Your last order ID, if available</li>
              <li>A short note that you need password recovery help</li>
            </ul>

            <div className="mt-8 border-t border-white/5 pt-6 text-sm text-white/40">
              <p>
                Response time is usually within one business day during working
                hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
