import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import { MapPin, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MENEN Engineering PLC | Category One Architectural & Engineering Firm',
  description: "It's all about commitment! Delivering well-targeted, unique architectural, structural, and masterplan solutions in Addis Ababa and beyond.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const primaryPhone = '+251 920 517 606';
  const secondaryPhone = '+251 913 034 623';
  const primaryEmail = 'habtamuengr@gmail.com';
  const officeAddress = 'Wello Sefer, behind Garad Mall, GS Building, 2nd Floor Office @ Menen Engineering PLC, Addis Ababa, Ethiopia';
  const googleMapsUrl = 'https://maps.app.goo.gl/aZi46d5GYwmFY3BD9';

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-white text-neutral-900 min-h-screen flex flex-col selection:bg-neutral-950 selection:text-white font-sans antialiased overflow-x-hidden w-full">
        
        {/* The ONLY Navbar instance in the entire project */}
        <Navbar 
          primaryPhone={primaryPhone}
          primaryEmail={primaryEmail}
        />

        {/* Dynamic page content */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Global Architectural Footer — Always rendered across all pages */}
        <footer id="firm-footer" className="border-t border-neutral-200 bg-white py-14 px-6 sm:px-12 text-xs text-neutral-600 font-sans w-full">
          <div className="max-w-[108rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="space-y-3.5">
              <h4 className="font-serif font-black text-base text-neutral-950 tracking-tight uppercase">
                MENEN Engineering PLC
              </h4>
              <p className="text-[12px] leading-relaxed text-neutral-500">
                Category One Architectural and Engineering Consultancy Firm established in 2021 by Eng. Habtamu Getu and Arch. Samiel Musolino.
              </p>
              
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-950 hover:underline pt-1"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" /> Open Office in Google Maps &rarr;
              </a>
            </div>

            <div>
              <h5 className="font-mono font-bold text-[11px] text-neutral-950 uppercase tracking-[0.2em] mb-4">
                Key Services
              </h5>
              <ul className="space-y-2 text-[12px] text-neutral-500 font-mono">
                <li>Preliminary &amp; Working Designs</li>
                <li>Design Permitting &amp; Approvals</li>
                <li>Historic &amp; Heritage Conservation</li>
                <li>BOQ &amp; Contract Administration</li>
                <li>3D Visualization, VR &amp; Animations</li>
              </ul>
            </div>

            <div>
              <h5 className="font-mono font-bold text-[11px] text-neutral-950 uppercase tracking-[0.2em] mb-4">
                Disciplines
              </h5>
              <ul className="space-y-2 text-[12px] text-neutral-500 font-mono">
                <li>Architecture &amp; Towers</li>
                <li>Civic Heritage &amp; Culture</li>
                <li>Academic &amp; Education</li>
                <li>Hospitality &amp; Resorts</li>
                <li>Infrastructure &amp; Border Sites</li>
              </ul>
            </div>

            <div>
              <h5 className="font-mono font-bold text-[11px] text-neutral-950 uppercase tracking-[0.2em] mb-4">
                Head Office
              </h5>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[12px] text-neutral-500 hover:text-neutral-950 transition leading-relaxed group"
              >
                <span className="group-hover:underline flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-neutral-900 shrink-0 mt-0.5" />
                  {officeAddress}
                </span>
              </a>

              <div className="mt-4 space-y-2 font-mono text-[12px]">
                <p>
                  <a
                    href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
                    className="text-neutral-950 font-bold hover:underline flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> {primaryPhone}
                  </a>
                </p>
                <p>
                  <a
                    href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}
                    className="text-neutral-500 hover:text-neutral-950 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> {secondaryPhone}
                  </a>
                </p>
                <p className="pt-1">
                  <a
                    href={`mailto:${primaryEmail}`}
                    className="text-neutral-500 hover:text-neutral-950 flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" /> {primaryEmail}
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-[108rem] mx-auto pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-neutral-400 gap-3">
            <p>&copy; 2026 MENEN Engineering PLC. All rights reserved.</p>
            <p>Architectural Monograph Editorial Framework</p>
          </div>
        </footer>

      </body>
    </html>
  );
}