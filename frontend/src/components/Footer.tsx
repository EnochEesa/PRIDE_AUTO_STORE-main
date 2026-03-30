import Link from "next/link";
import { Zap, MapPin, Phone, Mail, Instagram, Facebook, MessageCircle } from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/fiat_padmini_/",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Premier-padmini-spares/100065099156696/?utm_source=ig&utm_medium=social&utm_content=link_in_bio",
    icon: Facebook,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/c/919944140272",
    icon: MessageCircle,
  },
];

const MAP_URL = "https://www.google.com/maps/place/Pride+Auto+Store/@11.0022142,76.9631105,17z/data=!3m1!4b1!4m16!1m9!4m8!1m0!1m6!1m2!1s0x3ba859a91bcf1d83:0xa0a1d19f80957154!2sPride+Auto+Store,+9%2F23,+Dr+Nanjappa+Rd,+Near+Nehru+Stadium,+Grey+Town,+Gopalapuram,+Coimbatore,+Tamil+Nadu+641018!2m2!1d76.9656854!2d11.0022142!3m5!1s0x3ba859a91bcf1d83:0xa0a1d19f80957154!8m2!3d11.0022142!4d76.9656854!16s%2Fg%2F1q6jhkdwq?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D";

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-white/5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
              </div>
              <span
                className="text-2xl tracking-[0.15em] text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                PRIDE AUTO STORE
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-6">
              Your trusted source for quality automobile spare parts. We carry genuine
              and aftermarket parts for all major makes and models across India.
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="w-9 h-9 bg-dark-700 hover:bg-brand-500 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="w-4 h-4 text-white/60 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold tracking-widest uppercase text-xs mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Track Order", href: "/orders" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/40 hover:text-brand-400 text-sm transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold tracking-widest uppercase text-xs mb-6">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0" />
                <a
                  href={MAP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/40 text-sm hover:text-white transition-colors"
                >
                  Shop No 9/23, Opposite Nehru Stadium Road,<br />Grey Town Road, Grey Town, Coimbatore-641018, Tamil Nadu
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <a href="tel:+919944140272" className="text-white/40 text-sm hover:text-white transition-colors">
                  +919944140272
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <a href="mailto:prideautostore2000@gmail.com" className="text-white/40 text-sm hover:text-white transition-colors">
                  prideautostore2000@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Pride Auto Store. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Shipping Policy"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-white/25 hover:text-white/60 text-xs transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
