interface BrandLogoProps {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  size?: "sm" | "md";
  subtitle?: string;
}

const SIZE_MAP = {
  sm: {
    icon: "h-10 w-10",
    title: "text-[1.15rem] tracking-[0.28em]",
    subtitle: "text-[0.58rem] tracking-[0.26em]",
  },
  md: {
    icon: "h-12 w-12",
    title: "text-[1.35rem] tracking-[0.3em]",
    subtitle: "text-[0.62rem] tracking-[0.28em]",
  },
} as const;

function joinClasses(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={joinClasses("shrink-0", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brandLogoGradient" x1="8" y1="10" x2="56" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB923C" />
          <stop offset="1" stopColor="#EA580C" />
        </linearGradient>
      </defs>
      <path d="M8 12H47L56 21V52H17L8 43V12Z" fill="url(#brandLogoGradient)" />
      <path
        d="M22 17V47M22 17H35.5C42.5 17 48 22.2 48 28.8C48 35.6 42.5 40.8 35.5 40.8H22"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6.5"
      />
      <path d="M13 24H21" stroke="white" strokeLinecap="round" strokeOpacity="0.65" strokeWidth="2.4" />
      <path d="M13 31H19" stroke="white" strokeLinecap="round" strokeOpacity="0.52" strokeWidth="2.4" />
      <path d="M13 38H17" stroke="white" strokeLinecap="round" strokeOpacity="0.38" strokeWidth="2.4" />
    </svg>
  );
}

export default function BrandLogo({
  className,
  iconClassName,
  showText = true,
  size = "md",
  subtitle,
}: BrandLogoProps) {
  const sizeClass = SIZE_MAP[size];

  return (
    <div className={joinClasses("flex items-center gap-3", className)}>
      <BrandMark className={joinClasses(sizeClass.icon, iconClassName)} />
      {showText ? (
        <div className="flex min-w-0 flex-col">
          <span
            className={joinClasses(
              "whitespace-nowrap text-white transition-colors",
              sizeClass.title
            )}
            style={{ fontFamily: "var(--font-display)" }}
          >
            PRIDE AUTO STORE
          </span>
          {subtitle ? (
            <span className={joinClasses("mt-0.5 whitespace-nowrap text-white/35", sizeClass.subtitle)}>
              {subtitle}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
