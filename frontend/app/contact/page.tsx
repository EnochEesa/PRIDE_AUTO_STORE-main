"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from "lucide-react";

const MAP_URL = "https://www.google.com/maps/place/Pride+Auto+Store/@11.0022142,76.9631105,17z/data=!3m1!4b1!4m16!1m9!4m8!1m0!1m6!1m2!1s0x3ba859a91bcf1d83:0xa0a1d19f80957154!2sPride+Auto+Store,+9%2F23,+Dr+Nanjappa+Rd,+Near+Nehru+Stadium,+Grey+Town,+Gopalapuram,+Coimbatore,+Tamil+Nadu+641018!2m2!1d76.9656854!2d11.0022142!3m5!1s0x3ba859a91bcf1d83:0xa0a1d19f80957154!8m2!3d11.0022142!4d76.9656854!16s%2Fg%2F1q6jhkdwq?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D";
const TAWK_URL = "https://dashboard.tawk.to/#/chat";

const CONTACT_INFO = [
  {
    icon: MapPin,
    label: "Address",
    value: "Shop No 9/23, Opposite Nehru Stadium Road, Grey Town Road, Grey Town, Coimbatore-641018, Tamil Nadu",
    href: MAP_URL,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+919944140272",
    href: "tel:+919944140272",
  },
  {
    icon: Mail,
    label: "Email",
    value: "prideautostore2000@gmail.com",
    href: "mailto:prideautostore2000@gmail.com",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon-Sat: 9:00 AM - 9:00 PM",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-20">
      <div className="relative bg-dark-800 border-b border-white/5">
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="section-label mb-3">Get In Touch</p>
          <h1
            className="font-display text-5xl md:text-7xl text-white tracking-wider"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CONTACT US
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2
                className="font-display text-3xl text-white tracking-wider mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                WE'D LOVE TO HEAR FROM YOU
              </h2>
              <p className="text-white/40 text-sm leading-relaxed">
                Have a question about a part, fitment, or availability? Reach out and
                our team will get back to you within one business day.
              </p>
            </div>

            <Link
              href={TAWK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Chat With Us
              <MessageCircle className="w-4 h-4" />
            </Link>

            <div className="space-y-4 mt-8">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 p-4 bg-dark-800 border border-white/5"
                >
                  <div className="w-10 h-10 bg-brand-500/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-500" />
                  </div>
                  <div>
                    <div className="text-white/30 text-xs tracking-widest uppercase mb-0.5">
                      {label}
                    </div>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noreferrer" : undefined}
                        className="text-white/80 text-sm hover:text-brand-400 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <div className="text-white/80 text-sm">{value}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex items-center justify-center bg-dark-800 border border-brand-500/20 p-12 text-center">
                <div>
                  <CheckCircle className="w-16 h-16 text-brand-500 mx-auto mb-4" />
                  <h3
                    className="font-display text-3xl text-white tracking-wider mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    MESSAGE SENT!
                  </h3>
                  <p className="text-white/40">
                    We'll get back to you within one business day.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-dark-800 border border-white/5 p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-dark-700 border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-dark-700 border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-dark-700 border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors"
                    placeholder="Part enquiry / Order support / etc."
                  />
                </div>

                <div>
                  <label className="text-white/40 text-xs tracking-widest uppercase block mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-dark-700 border border-white/10 text-white placeholder-white/20 px-4 py-3 text-sm focus:outline-none focus:border-brand-500 transition-colors resize-none"
                    placeholder="Describe your query or the part you're looking for..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center gap-2 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
