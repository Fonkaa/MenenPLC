import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CeoInteractiveDossier from '@/components/team/CeoInteractiveDossier';
import { 
  Users, 
  Building2, 
  Linkedin, 
  Facebook,
  Mail, 
  Phone, 
  GraduationCap, 
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TeamPage() {
  let teamMembers: any[] = [];

  try {
    teamMembers = await prisma.teamMember.findMany({
      orderBy: [{ isExecutive: 'desc' }, { order: 'asc' }],
    });
  } catch (error) {
    console.error('Failed to load team from database:', error);
  }

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 font-mono">
      
      {/* 1. Header Banner */}
      <div className="border-b border-neutral-200 pb-8">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-950 font-bold flex items-center gap-1.5">
          <Users className="w-4 h-4 text-neutral-900" /> Technical Leadership &amp; Consultative Board
        </span>
        <h1 className="text-3xl sm:text-5xl font-serif font-black text-neutral-950 tracking-tight mt-2">
          Specialists, Engineers &amp; Architects
        </h1>
        <p className="mt-3 text-xs sm:text-sm text-neutral-600 max-w-3xl leading-relaxed font-serif">
          MENEN Engineering PLC deploys a multi-disciplinary team combining advanced postgraduate research from Chalmers University of Technology (Sweden), Università degli Studi di Messina (Italy), and Addis Ababa Institute of Technology with extensive domestic and international engineering practice.
        </p>
      </div>

      {/* 2. Flagship Interactive Executive AI Dossier (Eng. Habtamu Getu) */}
      <section id="ceo-dossier" className="scroll-mt-24">
        <CeoInteractiveDossier />
      </section>

      {/* 3. Section Title for Full Team Directory */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-950 font-bold">
            Personnel Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-neutral-950 mt-1">
            Registered Specialists &amp; Executives
          </h2>
        </div>
        <p className="text-xs font-mono text-neutral-500">
          Category 1 Certified Board &amp; Technical Leads
        </p>
      </div>

      {/* 4. Team Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => {
            const isCeo = member.name?.toLowerCase().includes('habtamu');

            return (
              <div
                key={member.id}
                className={`bg-white border rounded-[16px] p-6 flex flex-col justify-between transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${
                  isCeo 
                    ? 'border-neutral-950 ring-1 ring-neutral-950/20 shadow-[0_8px_30px_rgba(0,0,0,0.08)]' 
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div>
                  {/* Photo / CAD Avatar Container */}
                  <div className="w-full h-64 rounded-[12px] bg-neutral-50 border border-neutral-200 mb-5 overflow-hidden flex items-center justify-center relative">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="text-center p-6 select-none">
                        <div className="w-14 h-14 rounded-full border border-neutral-300 bg-white flex items-center justify-center mx-auto mb-2 text-neutral-900 shadow-inner">
                          <Building2 className="w-7 h-7 stroke-1" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                          Certified Practice Profile
                        </span>
                      </div>
                    )}

                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-[6px] text-[10px] font-mono text-neutral-900 border border-neutral-200 font-bold uppercase tracking-wider">
                      {isCeo ? 'General Manager / CEO' : (member.department || 'Executive')}
                    </span>
                  </div>

                  {/* Identity & Role */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-black text-neutral-950">
                      {member.name}
                    </h3>
                    {isCeo && (
                      <span className="text-[9px] font-mono uppercase bg-neutral-950 text-white px-2 py-0.5 rounded-[4px] font-bold tracking-wider" title="Verified General Manager">
                        CEO
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-mono text-neutral-600 font-semibold mt-1">
                    {member.roleTitle}
                  </p>

                  {/* Academic Qualifications */}
                  <div className="mt-3 p-3 rounded-[10px] bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 font-mono flex items-start gap-2">
                    <GraduationCap className="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" />
                    <span className="leading-snug">{member.credentials}</span>
                  </div>

                  {/* Narrative Bio */}
                  <p className="mt-4 text-xs text-neutral-600 leading-relaxed font-serif whitespace-pre-line">
                    {member.bio}
                  </p>
                </div>

                {/* Footer Toolbar: Contacts, Social & AI Assistant Trigger */}
                <div className="mt-6 pt-4 border-t border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {/* LinkedIn */}
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-[6px] bg-neutral-50 text-neutral-600 hover:text-[#0a66c2] border border-neutral-200 transition-colors"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {/* Facebook (For CEO) */}
                      {isCeo && (
                        <a
                          href="https://www.facebook.com/habtamu.getu.984"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-[6px] bg-neutral-50 text-neutral-600 hover:text-[#1877f2] border border-neutral-200 transition-colors"
                          title="Personal Facebook"
                        >
                          <Facebook className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {/* Email */}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 rounded-[6px] bg-neutral-50 text-neutral-600 hover:text-neutral-950 border border-neutral-200 transition-colors"
                          title={member.email}
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {/* Phone */}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          className="p-2 rounded-[6px] bg-neutral-50 text-neutral-600 hover:text-neutral-950 border border-neutral-200 transition-colors"
                          title={member.phone}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <Link
                      href="/submit-project"
                      className="text-neutral-950 hover:underline flex items-center gap-1 font-bold text-xs uppercase tracking-wider"
                    >
                      Consult <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Interactive AI Shortcut for CEO */}
                  {isCeo && (
                    <a
                      href="#ceo-dossier"
                      className="block w-full text-center py-2.5 rounded-[8px] bg-neutral-950 text-white hover:bg-neutral-800 border border-neutral-900 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition-colors"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Consult Executive AI Dossier &uarr;
                      </span>
                    </a>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-24 bg-white border border-dashed border-neutral-300 rounded-[16px] text-neutral-500 space-y-3 font-mono">
            <Award className="w-12 h-12 text-neutral-400 mx-auto stroke-1" />
            <p className="text-sm font-bold text-neutral-950">
              No team profiles found in database.
            </p>
            <p className="text-xs">
              Add personnel from the Admin Portal or run database seeds.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}