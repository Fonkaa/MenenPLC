import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MapPin, Phone, Mail, Award, Clock, Compass } from 'lucide-react';

export const revalidate = 60;

export default async function ContactPage() {
  let config = {
    companyName: 'MENEN Engineering PLC',
    primaryPhone: '+251 920 517 606',
    secondaryPhone: '+251 913 034 623',
    primaryEmail: 'habtamuengr@gmail.com',
    officeAddress: 'Wello Sefer, behind Garad Mall, GS Building, 2nd Floor Office @ Menen Engineering PLC, Addis Ababa, Ethiopia',
  };

  try {
    const dbConfig = await prisma.siteConfig.findUnique({
      where: { id: 'global_config' },
    });
    if (dbConfig) {
      config = {
        companyName: dbConfig.companyName,
        primaryPhone: dbConfig.primaryPhone,
        secondaryPhone: dbConfig.secondaryPhone,
        primaryEmail: dbConfig.primaryEmail,
        officeAddress: dbConfig.officeAddress,
      };
    }
  } catch (e) {
    console.warn('Contact page fallback:', e);
  }

  return (
    <div className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 font-mono">
      <div className="border-b border-neutral-200 pb-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-950 font-bold">
          Headquarters &amp; Inquiries
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-neutral-950 tracking-tight mt-2">
          Connect with MENEN Engineering PLC
        </h1>
        <p className="mt-3 text-sm text-neutral-600 max-w-2xl leading-relaxed font-serif">
          Reach out for project consultations, architectural reviews, structural design packages, or partnership opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-neutral-200 p-8 rounded-[20px] space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-[12px] bg-neutral-50 text-neutral-950 border border-neutral-200">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">Head Office Address</h4>
              <p className="text-sm font-semibold text-neutral-950 mt-1 leading-relaxed font-sans">
                {config.officeAddress}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-[12px] bg-neutral-50 text-neutral-950 border border-neutral-200">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">Direct Phone Lines</h4>
              <p className="text-sm font-mono text-neutral-950 mt-1 font-semibold">
                {config.primaryPhone}
              </p>
              <p className="text-xs font-mono text-neutral-600 mt-0.5">
                {config.secondaryPhone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-[12px] bg-neutral-50 text-neutral-950 border border-neutral-200">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">Direct Corporate Email</h4>
              <p className="text-sm font-mono text-neutral-950 mt-1 font-semibold">
                {config.primaryEmail}
              </p>
              <span className="text-[11px] text-neutral-500 mt-1 block font-serif">
                Contact Person: Eng. Habtamu Getu (CEO &amp; Practicing Professional Structural Engineer)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 p-8 rounded-[20px] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
          <div>
            <h3 className="text-lg font-serif font-black text-neutral-950">Category 1 Engineering Practice</h3>
            <p className="text-xs text-neutral-600 mt-2 leading-relaxed font-serif">
              MENEN Engineering PLC is fully licensed to render consultancy services in design, construction supervision, and contract administration across residential, commercial, industrial, healthcare, and historic conservation sectors throughout Ethiopia.
            </p>
            <div className="mt-6 space-y-2 text-xs font-mono text-neutral-500">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-950" /> Monday – Saturday: 8:30 AM – 5:30 PM (EAT)
              </div>
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-neutral-950" /> Wello Sefer Commercial Corridor
              </div>
            </div>
          </div>

          <Link
            href="/submit-project"
            className="w-full mt-6 py-3.5 rounded-[12px] bg-neutral-950 text-white font-bold font-mono text-xs uppercase tracking-[0.16em] text-center block hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Initiate Project Brief &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}