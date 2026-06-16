import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { FOOTER_LOGO_SRC, PearlLogo } from "@/components/layout/pearl-logo";
import { SALON_CONTACT } from "@/lib/constants";

function SocialIcon({
  children,
  label,
  href,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
    >
      {children}
    </a>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="max-w-md">
            <PearlLogo
              src={FOOTER_LOGO_SRC}
              width={1084}
              height={1286}
              size="xl"
              href={null}
            />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              A quiet place to feel like yourself again. Thank you for letting us care for you.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Visit us
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground">
              {SALON_CONTACT.address}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">11:00 AM – 7:00 PM</p>
            <a
              href={`tel:${SALON_CONTACT.phone}`}
              className="mt-2 block text-sm text-foreground hover:text-primary"
            >
              {SALON_CONTACT.phoneDisplay}
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Connect
            </p>
            <div className="flex gap-3">
              <SocialIcon label="WhatsApp" href={SALON_CONTACT.whatsappUrl}>
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
              </SocialIcon>
              <SocialIcon label="Instagram" href="#">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Facebook" href="#">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </SocialIcon>
            </div>
            <a
              href={SALON_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-[#128C7E] hover:underline dark:text-[#25D366]"
            >
              <MessageCircle className="h-4 w-4" />
              Message us on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pearl Beauty &amp; Spa Salon. All rights reserved.</p>
          <p className="flex flex-wrap gap-2">
            <span>Crafted with care</span>
            <span>·</span>
            <Link href="#" className="hover:text-primary">
              Privacy
            </Link>
            <span>·</span>
            <Link href="#" className="hover:text-primary">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
