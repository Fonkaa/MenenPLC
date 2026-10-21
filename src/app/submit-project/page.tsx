'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Video, 
  Volume2, 
  ShieldCheck, 
  Send, 
  Loader2, 
  GraduationCap, 
  Briefcase,
  FileText,
  Upload,
  X,
  FileCheck2
} from 'lucide-react';

export default function SubmitProjectPage() {
  const [submissionType, setSubmissionType] = useState<'PROJECT' | 'INTERNSHIP'>('PROJECT');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // PDF Document Upload State
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfName, setPdfName] = useState<string>('');
  const [uploadingPdf, setUploadingPdf] = useState(false);

  async function handleFileUpload(file: File) {
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      alert('Document exceeds 25MB limit. Please upload a compressed PDF or file.');
      return;
    }

    setUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to upload document.');
        return;
      }

      const uploadedUrl = data.url || data.secure_url;
      setPdfUrl(uploadedUrl);
      setPdfName(file.name);
    } catch (err: any) {
      alert('Error uploading document: ' + err.message);
    } finally {
      setUploadingPdf(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploadingPdf) {
      alert('Please wait until your document finishes uploading.');
      return;
    }

    setLoading(true);
    const form = new FormData(e.currentTarget);
    const isInternship = submissionType === 'INTERNSHIP';

    const payload = {
      type: submissionType,
      fullName: form.get('fullName'),
      email: form.get('email'),
      phone: form.get('phone'),
      organization: form.get('organization') || form.get('university') || null,
      projectType: isInternship ? `INTERNSHIP_${form.get('academicDepartment')}` : form.get('projectType'),
      location: form.get('location') || null,
      plotSize: form.get('plotSize') || null,
      scope: isInternship 
        ? `[STUDENT INTERNSHIP APPLICATION]\nUniversity: ${form.get('university')}\nDepartment: ${form.get('academicDepartment')}\nYear of Study: ${form.get('yearOfStudy')}\nCGPA: ${form.get('cgpa')}\nPortfolio/CV Link: ${form.get('portfolioUrl') || 'N/A'}\nAttached Document: ${pdfUrl ? `${pdfName} (${pdfUrl})` : 'None'}\n\nStatement of Purpose:\n${form.get('scope')}`
        : form.get('scope'),
      referenceVideo: form.get('referenceVideo') || null,
      referenceAudio: form.get('referenceAudio') || null,
      documentPdfUrl: pdfUrl || null,
      documentPdfName: pdfName || null,
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        alert(err.error || 'Submission failed. Please try again or contact the office directly.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="py-24 px-4 max-w-lg mx-auto text-center space-y-6 font-mono">
        <div className="w-16 h-16 rounded-full bg-neutral-950 text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-serif font-black text-neutral-950">
          {submissionType === 'INTERNSHIP' ? 'Application Transmitted' : 'Project Brief Transmitted'}
        </h2>
        <p className="text-sm text-neutral-600 leading-relaxed font-serif">
          {submissionType === 'INTERNSHIP'
            ? 'Your internship application profile and attached documents have been received by the review panel. You will receive an official decision letter via email.'
            : 'Thank you for submitting your architectural & engineering brief. Eng. Habtamu Getu and our lead engineers have received your dossier, PDF specifications, and details.'}
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 rounded-[12px] bg-neutral-950 text-white font-bold text-xs uppercase font-mono tracking-[0.16em] hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 max-w-3xl mx-auto px-4 sm:px-6 space-y-8 font-mono">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-950 font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-neutral-900" /> Official Intake Portal
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-black text-neutral-950 tracking-tight mt-1">
          {submissionType === 'INTERNSHIP' 
            ? 'Student Internship & Apprenticeship Application' 
            : 'Submit Project Brief & Engineering Requirements'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 mt-2 font-serif">
          {submissionType === 'INTERNSHIP'
            ? 'Apply for practical internships and mentorship under Category 1 structural engineers and architects at MENEN Engineering PLC.'
            : 'From schematic concept and municipal permit navigation to complete structural analysis, tender BOQs, and 3D architectural animation.'}
        </p>
      </div>

      {/* Switcher Tab */}
      <div className="flex rounded-[14px] bg-neutral-50 p-1.5 border border-neutral-200 gap-2">
        <button
          type="button"
          onClick={() => {
            setSubmissionType('PROJECT');
            setPdfUrl('');
            setPdfName('');
          }}
          className={`flex-1 py-3 px-4 rounded-[10px] text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            submissionType === 'PROJECT'
              ? 'bg-neutral-950 text-white shadow-xs font-bold'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          <Briefcase className="w-4 h-4" /> Commercial Project Brief
        </button>
        <button
          type="button"
          onClick={() => {
            setSubmissionType('INTERNSHIP');
            setPdfUrl('');
            setPdfName('');
          }}
          className={`flex-1 py-3 px-4 rounded-[10px] text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
            submissionType === 'INTERNSHIP'
              ? 'bg-neutral-950 text-white shadow-xs font-bold'
              : 'text-neutral-600 hover:text-neutral-950'
          }`}
        >
          <GraduationCap className="w-4 h-4" /> Student Internship Application
        </button>
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-[20px] space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
        
        {/* Basic Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
              Full Name *
            </label>
            <input
              required
              name="fullName"
              placeholder={submissionType === 'INTERNSHIP' ? 'e.g. Sara Tesfaye' : 'e.g. Ato Bekele / Developer'}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
              {submissionType === 'INTERNSHIP' ? 'University / Institute *' : 'Company / Organization Name'}
            </label>
            <input
              required={submissionType === 'INTERNSHIP'}
              name={submissionType === 'INTERNSHIP' ? 'university' : 'organization'}
              placeholder={submissionType === 'INTERNSHIP' ? 'e.g. AAiT, ASTU, Bahir Dar University' : 'e.g. KK PLC, KANMAX'}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
              Contact Email Address (For Direct Decision Letters) *
            </label>
            <input
              required
              type="email"
              name="email"
              placeholder="applicant@domain.com"
              className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
              Active Phone Number *
            </label>
            <input
              required
              name="phone"
              placeholder="+251 9..."
              className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
            />
          </div>
        </div>

        {/* CONDITION 1: COMMERCIAL PROJECT FIELDS */}
        {submissionType === 'PROJECT' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
                  Typology *
                </label>
                <select
                  name="projectType"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
                >
                  <option value="MXD">Mixed Use (MXD)</option>
                  <option value="APT">Apartment Tower (APT)</option>
                  <option value="HSP">Hospitality &amp; Hotel (HSP)</option>
                  <option value="RLS">Real Estate Masterplan (RLS)</option>
                  <option value="RES">Private Luxury Residence (RES)</option>
                  <option value="INT">Interior Architecture (INT)</option>
                  <option value="LND">Landscape Design (LND)</option>
                  <option value="STR">Institutional / Structural (STR)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
                  Site Location
                </label>
                <input
                  name="location"
                  placeholder="Addis Ababa, Hawassa..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
                  Plot Size (m²)
                </label>
                <input
                  name="plotSize"
                  placeholder="e.g. 1,200 m²"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
                Detailed Scope of Work &amp; Architectural Program *
              </label>
              <textarea
                required
                name="scope"
                rows={4}
                placeholder="Describe number of basements/floors (e.g., 2B+G+M+15), municipal permit status, structural systems needed..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
              />
            </div>

            {/* DEDICATED PDF & SPECIFICATION UPLOADER */}
            <div className="p-4 rounded-[14px] bg-neutral-50 border border-neutral-200 space-y-3">
              <label className="block text-xs font-mono uppercase text-neutral-950 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-neutral-900" /> 
                  Upload Project Brief / Technical Specifications (PDF / DOC)
                </span>
                <span className="text-[10px] text-neutral-400 font-normal">Max 25MB</span>
              </label>

              {!pdfUrl ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-[12px] p-5 cursor-pointer bg-white transition group text-center shadow-2xs">
                  {uploadingPdf ? (
                    <div className="flex flex-col items-center gap-2 text-xs font-mono text-neutral-950">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Transmitting document to secure cloud...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-neutral-400 group-hover:text-neutral-950 transition mb-1" />
                      <span className="text-xs font-medium text-neutral-900">
                        Click or tap to choose PDF drawing or brief
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        Accepts PDF, DWG, DOCX, ZIP files
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.dwg,.zip,application/pdf"
                    disabled={uploadingPdf}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-[10px] bg-neutral-900 text-white border border-neutral-800">
                  <div className="flex items-center gap-2 text-xs font-mono truncate">
                    <FileCheck2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="font-bold truncate">{pdfName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfUrl('');
                      setPdfName('');
                    }}
                    className="p-1 rounded-[6px] hover:bg-neutral-800 text-neutral-300 transition-colors"
                    title="Remove attached file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 flex items-center gap-1 mb-1 font-bold">
                  <Video className="w-3.5 h-3.5 text-neutral-900" /> Reference Video / Site Footage
                </label>
                <input
                  name="referenceVideo"
                  placeholder="YouTube / Vimeo link"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 flex items-center gap-1 mb-1 font-bold">
                  <Volume2 className="w-3.5 h-3.5 text-neutral-900" /> Audio Note / Brief Link
                </label>
                <input
                  name="referenceAudio"
                  placeholder="Voice note / Cloud audio URL"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
                />
              </div>
            </div>
          </>
        )}

        {/* CONDITION 2: STUDENT INTERNSHIP FIELDS */}
        {submissionType === 'INTERNSHIP' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
                  Field / Department *
                </label>
                <select
                  required
                  name="academicDepartment"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
                >
                  <option value="Civil_Structural_Engineering">Civil / Structural Engineering</option>
                  <option value="Architecture_Urban_Design">Architecture &amp; Urban Planning</option>
                  <option value="Construction_Management">Construction Technology &amp; Mgmt</option>
                  <option value="Sanitary_Electro_Mechanical">Sanitary &amp; Mechanical (MEP)</option>
                  <option value="Software_BIM_Drafting">BIM, GIS &amp; Technical CAD</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
                  Current Year of Study *
                </label>
                <select
                  name="yearOfStudy"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
                >
                  <option value="3rd_Year">3rd Year (Junior)</option>
                  <option value="4th_Year">4th Year (Internship Semester)</option>
                  <option value="5th_Year_Graduating">5th Year (Graduating Class)</option>
                  <option value="Postgraduate_MSc">Postgraduate (MSc / MArch)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
                  Cumulative GPA (CGPA) *
                </label>
                <input
                  required
                  name="cgpa"
                  placeholder="e.g. 3.75 / 4.00"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
                />
              </div>
            </div>

            {/* DEDICATED RESUME / CV PDF UPLOADER */}
            <div className="p-4 rounded-[14px] bg-neutral-50 border border-neutral-200 space-y-3">
              <label className="block text-xs font-mono uppercase text-neutral-950 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-neutral-900" /> 
                  Upload Resume / CV / Academic Transcript (PDF)
                </span>
                <span className="text-[10px] text-neutral-400 font-normal">Max 25MB</span>
              </label>

              {!pdfUrl ? (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-[12px] p-5 cursor-pointer bg-white transition group text-center shadow-2xs">
                  {uploadingPdf ? (
                    <div className="flex flex-col items-center gap-2 text-xs font-mono text-neutral-950">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Uploading resume to cloud...</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-neutral-400 group-hover:text-neutral-950 transition mb-1" />
                      <span className="text-xs font-medium text-neutral-900">
                        Click or tap to upload CV / Portfolio PDF
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono mt-0.5">
                        Accepts PDF documents
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    disabled={uploadingPdf}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-[10px] bg-neutral-900 text-white border border-neutral-800">
                  <div className="flex items-center gap-2 text-xs font-mono truncate">
                    <FileCheck2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="font-bold truncate">{pdfName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfUrl('');
                      setPdfName('');
                    }}
                    className="p-1 rounded-[6px] hover:bg-neutral-800 text-neutral-300 transition-colors"
                    title="Remove attached PDF"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
                Portfolio / GitHub / Behance Link (Optional)
              </label>
              <input
                name="portfolioUrl"
                placeholder="https://drive.google.com/... or https://behance.net/..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-1 font-bold">
                Statement of Purpose &amp; Technical Skills *
              </label>
              <textarea
                required
                name="scope"
                rows={4}
                placeholder="Detail software proficiencies (ETABS, SAP2000, Revit, AutoCAD), desired duration, and what you aim to achieve at MENEN Engineering PLC..."
                className="w-full bg-neutral-50 border border-neutral-300 rounded-[10px] px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-sans"
              />
            </div>
          </>
        )}

        {/* Submit Action */}
        <button
          type="submit"
          disabled={loading || uploadingPdf}
          className="w-full py-3.5 rounded-[12px] bg-neutral-950 text-white font-bold font-mono text-xs uppercase tracking-[0.16em] hover:bg-neutral-800 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 border-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Processing Transmission...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-white" /> 
              {submissionType === 'INTERNSHIP' 
                ? 'Transmit Internship Profile to MENEN Board' 
                : 'Transmit Project Dossier & PDF to MENEN Board'}
            </>
          )}
        </button>
      </form>
    </div>
  );
}