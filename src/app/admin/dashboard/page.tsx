'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  Settings, 
  Key, 
  FileText, 
  Inbox, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  ExternalLink, 
  LogOut, 
  CheckCircle2, 
  Video, 
  Volume2, 
  Image as ImageIcon, 
  Upload, 
  Loader2, 
  Mail, 
  FileCheck2,
  Layers,
  ArrowUp,
  ArrowDown,
  Tag,
  Compass
} from 'lucide-react';

export interface ProjectPlateItem {
  id: string;
  type: 'image' | 'description' | 'composite';
  imageUrl?: string;
  caption?: string;
  narrative?: string;
}

const DEFAULT_CLASSIFICATIONS = [
  'Architecture',
  'Culture',
  'Education',
  'Work',
  'Hospitality',
  'Residential',
  'Infrastructure',
  'Space',
  'Sports',
  'Health',
  'Interiors',
  'Landscape',
  'Planning',
  'Product',
];

export default function MasterAdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'team' | 'classifications' | 'config' | 'cms' | 'security' | 'inquiries'>('projects');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Core Database States
  const [projects, setProjects] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>({});
  const [cmsContent, setCmsContent] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Dynamic Classifications State
  const [classifications, setClassifications] = useState<string[]>(DEFAULT_CLASSIFICATIONS);
  const [newClassificationInput, setNewClassificationInput] = useState('');

  // Modal & Selection States
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [isNewProjectModal, setIsNewProjectModal] = useState(false);
  const [isNewMemberModal, setIsNewMemberModal] = useState(false);

  // Dynamic Flexible Project Plates
  const [dynamicPlates, setDynamicPlates] = useState<ProjectPlateItem[]>([]);
  const [memberImageUrl, setMemberImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Security Credentials State
  const [currentPassword, setCurrentPassword] = useState('');
  const [securityEmail, setSecurityEmail] = useState('');
  const [securityPassword, setSecurityPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('menen_admin_auth');
    if (!isAuth) {
      router.push('/admin/login');
      return;
    }
    loadAllData();
  }, [router]);

  function triggerToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function loadAllData() {
    setLoading(true);
    try {
      const fetchOpts: RequestInit = {
        cache: 'no-store',
        headers: { Pragma: 'no-cache', 'Cache-Control': 'no-cache' },
      };

      const [projRes, teamRes, configRes, cmsRes, inqRes] = await Promise.all([
        fetch('/api/admin/projects', fetchOpts),
        fetch('/api/admin/team', fetchOpts),
        fetch('/api/admin/config', fetchOpts),
        fetch('/api/admin/content', fetchOpts),
        fetch('/api/inquiries', fetchOpts),
      ]);

      if (projRes.ok) setProjects(await projRes.json());
      if (teamRes.ok) setTeamMembers(await teamRes.json());
      if (configRes.ok) {
        const conf = await configRes.json();
        setSiteConfig(conf || {});
        if (conf?.classifications && Array.isArray(conf.classifications) && conf.classifications.length > 0) {
          setClassifications(conf.classifications);
        }
      }
      if (cmsRes.ok) setCmsContent(await cmsRes.json());
      if (inqRes.ok) setInquiries(await inqRes.json());
    } catch (e) {
      console.error('Error synchronizing admin data:', e);
    } finally {
      setLoading(false);
    }
  }

  // Log out directly to projects archive without showing intro splash
  function handleLogout() {
    localStorage.removeItem('menen_admin_auth');
    localStorage.removeItem('menen_admin_email');
    router.push('/#projects-archive');
  }

  // Universal File Upload Handler
  async function uploadFileToServer(file: File): Promise<string | null> {
    if (!file) return null;
    if (file.size > 25 * 1024 * 1024) {
      alert(`File "${file.name}" exceeds 25MB limit. Please choose a smaller file.`);
      return null;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert(`Upload error: ${data.error || 'Server rejected file upload.'}`);
        return null;
      }

      return data.url || data.secure_url || null;
    } catch (err: any) {
      alert('Network error connecting to media server.');
      return null;
    }
  }

  // Classification Handlers
  async function handleAddClassification() {
    const trimmed = newClassificationInput.trim();
    if (!trimmed) return;
    if (classifications.map((c) => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      alert('This classification already exists.');
      return;
    }

    const updated = [...classifications, trimmed];
    setClassifications(updated);
    setNewClassificationInput('');

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...siteConfig, classifications: updated }),
      });
      if (res.ok) {
        triggerToast(`Added classification: "${trimmed}"`);
      }
    } catch {
      alert('Failed to save classification to server.');
    }
  }

  async function handleRemoveClassification(name: string) {
    if (!confirm(`Are you sure you want to remove "${name}"?`)) return;

    const updated = classifications.filter((c) => c !== name);
    setClassifications(updated);

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...siteConfig, classifications: updated }),
      });
      if (res.ok) {
        triggerToast(`Classification "${name}" removed.`);
      }
    } catch {
      alert('Failed to update classifications list.');
    }
  }

  // Dynamic Plates Builder Helpers
  function addPlateItem(type: 'image' | 'description' | 'composite') {
    const newItem: ProjectPlateItem = {
      id: `plate_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      imageUrl: '',
      caption: '',
      narrative: '',
    };
    setDynamicPlates((prev) => [...prev, newItem]);
  }

  function updatePlateItem(id: string, updates: Partial<ProjectPlateItem>) {
    setDynamicPlates((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }

  function removePlateItem(id: string) {
    setDynamicPlates((prev) => prev.filter((item) => item.id !== id));
  }

  function movePlateItem(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= dynamicPlates.length) return;
    const cloned = [...dynamicPlates];
    const temp = cloned[index];
    cloned[index] = cloned[targetIndex];
    cloned[targetIndex] = temp;
    setDynamicPlates(cloned);
  }

  // Project Actions
  async function handleSaveProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const isEditing = Boolean(editingProject?.id);

    const extractedImages = dynamicPlates
      .map((p) => p.imageUrl)
      .filter((url): url is string => Boolean(url && url.trim().length > 0));

    const payload = {
      id: editingProject?.id,
      title: form.get('title'),
      client: form.get('client'),
      category: form.get('category'),
      status: form.get('status'),
      location: form.get('location'),
      scopeOfWork: form.get('scopeOfWork'),
      awards: form.get('awards'),
      featuredImage: extractedImages[0] || null,
      galleryImages: extractedImages,
      descriptionSteps: dynamicPlates,
      featuredVideo: form.get('featuredVideo') || null,
      audioNarrative: form.get('audioNarrative') || null,
      creativeDirector: form.get('creativeDirector') || null,
      partnerInCharge: form.get('partnerInCharge') || null,
      projectManager: form.get('projectManager') || null,
      projectTeam: form.get('projectTeam') || null,
      mapCoordinates: form.get('mapCoordinates') || null,
      isFeatured: form.get('isFeatured') === 'on',
      order: editingProject?.order ?? 0,
    };

    try {
      const res = await fetch('/api/admin/projects', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedProject = await res.json();
        setProjects((prev) => {
          if (isEditing) {
            return prev.map((p) => (p.id === savedProject.id ? savedProject : p));
          } else {
            return [savedProject, ...prev];
          }
        });

        triggerToast(isEditing ? 'Project details updated!' : 'Project published successfully!');
        setEditingProject(null);
        setIsNewProjectModal(false);
        setDynamicPlates([]);
        loadAllData();
      } else {
        const err = await res.json();
        alert(`Failed to save project: ${err.error || 'Server error'}`);
      }
    } catch (error) {
      alert('Network error while saving project.');
    }
  }

  async function handleDeleteProject(id: string, title: string) {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast('Project removed.');
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error('Error deleting project:', e);
    }
  }

  // Team Actions
  async function handleSaveMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const isEditing = Boolean(editingMember?.id);

    let finalAvatarUrl = memberImageUrl.trim() || (form.get('avatarUrl') as string)?.trim() || null;
    if (finalAvatarUrl && finalAvatarUrl.startsWith('/uploads/')) {
      finalAvatarUrl = null;
    }

    const payload = {
      id: editingMember?.id,
      name: form.get('name'),
      roleTitle: form.get('roleTitle'),
      department: form.get('department'),
      credentials: form.get('credentials'),
      bio: form.get('bio'),
      avatarUrl: finalAvatarUrl,
      linkedinUrl: form.get('linkedinUrl') || null,
      email: form.get('email') || null,
      phone: form.get('phone') || null,
      isExecutive: form.get('isExecutive') === 'on',
      order: editingMember?.order ?? 0,
    };

    try {
      const res = await fetch('/api/admin/team', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const savedMember = await res.json();
        setTeamMembers((prev) => {
          if (isEditing) {
            return prev.map((m) => (m.id === savedMember.id ? savedMember : m));
          } else {
            return [savedMember, ...prev];
          }
        });

        triggerToast(isEditing ? 'Specialist profile updated!' : 'New specialist registered!');
        setEditingMember(null);
        setIsNewMemberModal(false);
        setMemberImageUrl('');
        loadAllData();
      } else {
        const err = await res.json();
        alert(`Failed to save specialist: ${err.error || 'Server error'}`);
      }
    } catch (error) {
      alert('Network error while saving specialist profile.');
    }
  }

  async function handleDeleteMember(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete profile for ${name}?`)) return;
    try {
      const res = await fetch(`/api/admin/team?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast('Profile deleted.');
        setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (e) {
      console.error('Error deleting member:', e);
    }
  }

  // Config Actions
  async function handleSaveConfig(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      ...siteConfig,
      companyName: form.get('companyName'),
      legalCategory: form.get('legalCategory'),
      motto: form.get('motto'),
      primaryPhone: form.get('primaryPhone'),
      secondaryPhone: form.get('secondaryPhone'),
      primaryEmail: form.get('primaryEmail'),
      officeAddress: form.get('officeAddress'),
      classifications: classifications,
    };

    try {
      const res = await fetch('/api/admin/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedConfig = await res.json();
        setSiteConfig(updatedConfig);
        triggerToast('Office configuration & notification email saved!');
        loadAllData();
      }
    } catch (e) {
      alert('Failed to save configuration settings.');
    }
  }

  // CMS Content
  async function handleSaveCmsText(key: string, value: string, label: string) {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, label }),
      });
      if (res.ok) {
        triggerToast(`Updated "${label}"!`);
        loadAllData();
      }
    } catch (e) {
      console.error('CMS save error:', e);
    }
  }

  // Security: Allows independent email or password change with verified database persistence
  async function handleSaveSecurity(e: React.FormEvent) {
    e.preventDefault();

    const hasNewEmail = Boolean(securityEmail.trim());
    const hasNewPassword = Boolean(securityPassword.trim());

    if (!hasNewEmail && !hasNewPassword) {
      alert('Please provide a new email address or a new password to update.');
      return;
    }

    if (hasNewPassword) {
      if (securityPassword !== confirmPassword) {
        alert('New password and confirmation do not match.');
        return;
      }
      if (securityPassword.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
      }
    }

    setSecurityLoading(true);
    try {
      const res = await fetch('/api/admin/auth/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: currentPassword || undefined,
          newEmail: hasNewEmail ? securityEmail.trim() : undefined,
          newPassword: hasNewPassword ? securityPassword.trim() : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        // Invalidate stale login session storage & sync new email
        if (hasNewEmail) {
          localStorage.setItem('menen_admin_email', securityEmail.trim());
        }
        triggerToast('Admin credentials updated! Please use these credentials on next login.');
        setCurrentPassword('');
        setSecurityPassword('');
        setConfirmPassword('');
      } else {
        alert(data.error || 'Failed to update credentials. Please check your current password.');
      }
    } catch (e) {
      alert('Network error updating security credentials.');
    } finally {
      setSecurityLoading(false);
    }
  }

  // Inquiries Actions
  async function handleInquiryDecision(inquiryId: string, applicantEmail: string, newStatus: 'APPROVED' | 'REJECTED') {
    const actionLabel = newStatus === 'APPROVED' ? 'Approve' : 'Reject';
    const note = prompt(`Optional remarks or interview scheduling note to include in the ${actionLabel} email to ${applicantEmail}:`);

    try {
      const res = await fetch('/api/admin/inquiries/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inquiryId,
          newStatus,
          feedbackNote: note || '',
        }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiryId ? { ...item, status: newStatus } : item))
        );
        triggerToast(`Marked as ${newStatus} & decision email sent!`);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to dispatch decision.');
      }
    } catch (e) {
      alert('Network failure sending decision email.');
    }
  }

  return (
    <div className="py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 font-sans">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-[9999] bg-white text-neutral-950 border border-neutral-300 px-4 py-2.5 rounded-xl font-mono text-xs font-bold shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-200 pb-6 gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold">
            MENEN Engineering PLC &bull; Category 1
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
            Master Dynamic Administration Engine
          </h1>
          <p className="text-xs text-neutral-500 mt-1 font-mono">
            Full Dynamic CMS &bull; Dynamic Classifications &bull; Modular Plate Sequencer
          </p>
        </div>

        {/* Live Site & Logout with zero-intro bypass */}
        <div className="flex items-center gap-3">
          <Link
            href="/#projects-archive"
            className="px-4 py-2 rounded-lg border border-neutral-300 bg-white text-xs font-mono font-bold text-neutral-800 hover:bg-neutral-950 hover:text-white transition-colors duration-200"
          >
            Live Site &rarr;
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-300 bg-white text-xs font-mono font-bold text-rose-600 hover:bg-rose-600 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* QUICK CLASSIFICATION JUMP BAR (Direct Admin Live Navigation) */}
      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-600 font-bold flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-neutral-900" /> Live Discipline Navigator (Click to inspect section on site)
          </span>
          <span className="text-[10px] font-mono text-neutral-400">
            {classifications.length} Recognized Disciplines
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {classifications.map((cat) => (
            <Link
              key={cat}
              href={`/#classification-${cat.toLowerCase()}`}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-950 hover:text-white text-xs font-serif uppercase tracking-wider transition-colors duration-200 shadow-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
        {[
          { id: 'projects', label: `Projects & Media (${projects.length})`, icon: Building2 },
          { id: 'classifications', label: `Classifications (${classifications.length})`, icon: Tag },
          { id: 'team', label: `Team (${teamMembers.length})`, icon: Users },
          { id: 'config', label: 'Office & Contact Settings', icon: Settings },
          { id: 'cms', label: 'Live Text CMS', icon: FileText },
          { id: 'security', label: 'Admin Security', icon: Key },
          { id: 'inquiries', label: `Briefs (${inquiries.length})`, icon: Inbox },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono transition-colors duration-200 cursor-pointer ${
                isActive
                  ? 'bg-neutral-950 text-white font-bold shadow-md'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-950 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROJECTS & DYNAMIC MEDIA PLATES */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-neutral-200">
            <div>
              <h3 className="text-sm font-bold text-neutral-950">
                Landmark Projects Directory ({projects.length})
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every project supports unlimited media and descriptions in any sequence.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingProject(null);
                setDynamicPlates([]);
                setIsNewProjectModal(true);
              }}
              className="px-4 py-2.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => {
              const displayImage = p.featuredImage || p.galleryImages?.[0] || p.descriptionSteps?.[0]?.image || null;
              const stepCount = p.descriptionSteps?.length || (p.galleryImages?.length || (displayImage ? 1 : 0));

              return (
                <div
                  key={p.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-950 transition-colors shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200 font-bold uppercase">
                        {p.category}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {p.status ? p.status.replace(/_/g, ' ') : ''}
                      </span>
                    </div>

                    <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center relative">
                      {displayImage ? (
                        <>
                          <img src={displayImage} alt={p.title} className="w-full h-full object-cover" />
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/80 text-white font-bold border border-white/20 flex items-center gap-1">
                            <Layers className="w-3 h-3" /> {stepCount} Media Plate{stepCount === 1 ? '' : 's'}
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-neutral-400 p-4 text-center">
                          <Building2 className="w-8 h-8 opacity-40 mb-1" />
                          <span className="text-[10px] font-mono">No Image Uploaded</span>
                        </div>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-neutral-950 mt-3 font-serif">
                      {p.title}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-1">
                      Client: <strong className="text-neutral-950">{p.client}</strong>
                    </p>
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                      {p.scopeOfWork}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(p);
                          if (Array.isArray(p.descriptionSteps) && p.descriptionSteps.length > 0) {
                            setDynamicPlates(
                              p.descriptionSteps.map((step: any, idx: number) => ({
                                id: step.id || `plate_${idx}`,
                                type: step.type || (step.image && step.narrative ? 'composite' : step.image ? 'image' : 'description'),
                                imageUrl: step.image || step.imageUrl || '',
                                caption: step.caption || '',
                                narrative: step.narrative || '',
                              }))
                            );
                          } else if (Array.isArray(p.galleryImages) && p.galleryImages.length > 0) {
                            setDynamicPlates(
                              p.galleryImages.map((url: string, idx: number) => ({
                                id: `plate_${idx}`,
                                type: 'image',
                                imageUrl: url,
                                caption: `Perspective 0${idx + 1}`,
                                narrative: '',
                              }))
                            );
                          } else if (p.featuredImage) {
                            setDynamicPlates([
                              {
                                id: 'plate_0',
                                type: 'composite',
                                imageUrl: p.featuredImage,
                                caption: p.title,
                                narrative: p.scopeOfWork || '',
                              },
                            ]);
                          } else {
                            setDynamicPlates([]);
                          }
                          setIsNewProjectModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-800 hover:bg-neutral-950 hover:text-white border border-neutral-200 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id, p.title)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>

                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="text-neutral-400 hover:text-neutral-950 transition-colors"
                      title="Preview Dossier"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PROJECT CREATE / EDIT MODAL */}
          {isNewProjectModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <div className="w-full max-w-3xl bg-white border border-neutral-300 rounded-2xl p-5 sm:p-8 space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-4 sticky top-0 bg-white z-10">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-950 font-serif">
                      {editingProject ? 'Edit Project Details' : 'Add New Project'}
                    </h3>
                    <p className="text-[11px] font-mono text-neutral-500">
                      Configuring project metadata and dynamic content plates
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setIsNewProjectModal(false);
                      setDynamicPlates([]);
                    }}
                    className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-200 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                        Project Title *
                      </label>
                      <input
                        required
                        name="title"
                        defaultValue={editingProject?.title || ''}
                        placeholder="e.g. 4B+G+M+23 MXD Tower"
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                        Client / Commissioning Developer *
                      </label>
                      <input
                        required
                        name="client"
                        defaultValue={editingProject?.client || ''}
                        placeholder="e.g. KK PLC / KANMAX"
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                        Discipline / Classification *
                      </label>
                      <select
                        name="category"
                        defaultValue={editingProject?.category || classifications[0] || 'Architecture'}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
                      >
                        {classifications.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                        Status *
                      </label>
                      <select
                        name="status"
                        defaultValue={editingProject?.status || 'UNDER_CONSTRUCTION'}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
                      >
                        <option value="UNDER_CONSTRUCTION">Under Construction</option>
                        <option value="DESIGN_PERMIT_PROCESS">Design Permit Process</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="DESIGN_PHASE">Design Phase</option>
                        <option value="LAND_ACQUISITION_PROCESS">Land Acquisition</option>
                        <option value="BOQ_AND_TENDER">BoQ &amp; Tender</option>
                        <option value="PROPOSAL">Proposal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                        Location / City
                      </label>
                      <input
                        name="location"
                        defaultValue={editingProject?.location || 'Addis Ababa'}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                      Scope of Work *
                    </label>
                    <textarea
                      required
                      name="scopeOfWork"
                      defaultValue={editingProject?.scopeOfWork || ''}
                      rows={2}
                      placeholder="e.g. 1st Prize Awarded Schematic Design & Complete Structural Services"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  {/* Dynamic Modular Content Plates */}
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-neutral-200 pb-3">
                      <div>
                        <label className="text-xs font-mono uppercase text-neutral-950 font-bold flex items-center gap-1.5">
                          <Layers className="w-4 h-4" /> Modular Content Plates
                        </label>
                        <p className="text-[11px] text-neutral-500 font-mono">
                          Add images, descriptions, or paired plates in any order.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => addPlateItem('image')}
                          className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-950 hover:text-white text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Image Only
                        </button>
                        <button
                          type="button"
                          onClick={() => addPlateItem('description')}
                          className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-950 hover:text-white text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Text Only
                        </button>
                        <button
                          type="button"
                          onClick={() => addPlateItem('composite')}
                          className="px-3 py-1.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 font-bold text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3 h-3" /> Image + Text
                        </button>
                      </div>
                    </div>

                    {dynamicPlates.length === 0 ? (
                      <div className="text-center py-6 text-xs text-neutral-400 font-mono border-2 border-dashed border-neutral-200 rounded-lg">
                        No content plates added yet. Use the buttons above to build the monograph narrative.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {dynamicPlates.map((plate, index) => (
                          <div
                            key={plate.id}
                            className="p-3.5 rounded-xl bg-white border border-neutral-200 space-y-3 relative shadow-sm"
                          >
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                              <span className="text-[10px] font-mono uppercase text-neutral-900 font-bold">
                                Plate #{index + 1} &bull; {plate.type.toUpperCase()}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => movePlateItem(index, 'up')}
                                  className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 cursor-pointer"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === dynamicPlates.length - 1}
                                  onClick={() => movePlateItem(index, 'down')}
                                  className="p-1 rounded bg-neutral-100 hover:bg-neutral-200 disabled:opacity-30 cursor-pointer"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removePlateItem(plate.id)}
                                  className="p-1 rounded bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition cursor-pointer ml-1"
                                  title="Delete plate"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {(plate.type === 'image' || plate.type === 'composite') && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                  <label className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-neutral-800 hover:bg-neutral-950 hover:text-white text-xs font-mono cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                                    <Upload className="w-3.5 h-3.5" /> Upload File
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const url = await uploadFileToServer(file);
                                          if (url) updatePlateItem(plate.id, { imageUrl: url });
                                        }
                                      }}
                                    />
                                  </label>
                                  <input
                                    placeholder="Or paste image URL (Cloudinary / CDN)..."
                                    value={plate.imageUrl || ''}
                                    onChange={(e) => updatePlateItem(plate.id, { imageUrl: e.target.value })}
                                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-950 font-mono"
                                  />
                                </div>

                                {plate.imageUrl && (
                                  <div className="h-24 w-36 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                                    <img src={plate.imageUrl} alt="Plate preview" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            )}

                            {(plate.type === 'description' || plate.type === 'composite') && (
                              <div className="space-y-2">
                                <input
                                  placeholder="Plate Caption / Headline (Optional)"
                                  value={plate.caption || ''}
                                  onChange={(e) => updatePlateItem(plate.id, { caption: e.target.value })}
                                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-950 font-serif"
                                />
                                <textarea
                                  placeholder="Plate Narrative / Architectural Description..."
                                  rows={2}
                                  value={plate.narrative || ''}
                                  onChange={(e) => updatePlateItem(plate.id, { narrative: e.target.value })}
                                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-1.5 text-xs text-neutral-950"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-lg bg-neutral-950 text-white font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition cursor-pointer"
                    >
                      Save Project ({dynamicPlates.length} Content Plate{dynamicPlates.length === 1 ? '' : 's'})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setIsNewProjectModal(false);
                        setDynamicPlates([]);
                      }}
                      className="py-3.5 px-6 rounded-lg bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300 font-mono text-xs uppercase tracking-wider transition cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CLASSIFICATIONS (ADD / REMOVE DYNAMICALLY) */}
      {activeTab === 'classifications' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-neutral-950">
              Dynamic Architectural Classifications
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              Add new disciplines or remove existing ones. Updates automatically sync across the Navbar, Sidebar, and Homepage.
            </p>
          </div>

          <div className="flex items-center gap-3 max-w-md">
            <input
              type="text"
              placeholder="e.g. Renovation, Aviation, Retail..."
              value={newClassificationInput}
              onChange={(e) => setNewClassificationInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddClassification();
                }
              }}
              className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
            />
            <button
              type="button"
              onClick={handleAddClassification}
              className="px-4 py-2 rounded-lg bg-neutral-950 text-white font-mono font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-neutral-800 transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
            {classifications.map((item) => (
              <div
                key={item}
                className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-2 group hover:border-neutral-950 transition"
              >
                <span className="text-xs font-serif font-bold text-neutral-900 truncate uppercase">
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveClassification(item)}
                  className="p-1 rounded text-neutral-400 hover:text-rose-600 transition cursor-pointer"
                  title={`Delete ${item}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TEAM & PROFILES */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-neutral-950">
                Team Specialists &amp; Founders ({teamMembers.length})
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Manage executive leadership, upload photos directly to Cloudinary, and update credentials.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMember(null);
                setMemberImageUrl('');
                setIsNewMemberModal(true);
              }}
              className="px-4 py-2.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 font-mono font-bold text-xs uppercase flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Specialist
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((m) => {
              const displayAvatar = m.avatarUrl && !m.avatarUrl.startsWith('/uploads/') ? m.avatarUrl : null;
              return (
                <div
                  key={m.id}
                  className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-950 transition shadow-sm"
                >
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
                      {m.department}
                    </span>

                    <div className="mt-3 w-16 h-16 rounded-full overflow-hidden bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                      {displayAvatar ? (
                        <img src={displayAvatar} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <Users className="w-7 h-7 text-neutral-400" />
                      )}
                    </div>

                    <h4 className="text-base font-bold text-neutral-950 mt-2 font-serif">
                      {m.name}
                    </h4>
                    <p className="text-xs font-mono text-neutral-600 mt-0.5">{m.roleTitle}</p>
                    <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
                      {m.bio}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingMember(m);
                          setMemberImageUrl(displayAvatar || '');
                          setIsNewMemberModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-800 hover:bg-neutral-950 hover:text-white border border-neutral-200 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id, m.name)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MEMBER MODAL */}
          {isNewMemberModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <div className="w-full max-w-xl bg-white border border-neutral-300 rounded-2xl p-5 sm:p-8 space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-neutral-200 pb-4 sticky top-0 bg-white z-10">
                  <h3 className="text-base sm:text-lg font-bold text-neutral-950 font-serif">
                    {editingMember ? 'Edit Profile' : 'Add Team Specialist'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(null);
                      setIsNewMemberModal(false);
                      setMemberImageUrl('');
                    }}
                    className="p-2 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-500 hover:text-neutral-950 hover:bg-neutral-200 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveMember} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                        Full Name &amp; Title *
                      </label>
                      <input
                        required
                        name="name"
                        defaultValue={editingMember?.name || ''}
                        placeholder="e.g. Eng. Habtamu Getu"
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                        Role Title *
                      </label>
                      <input
                        required
                        name="roleTitle"
                        defaultValue={editingMember?.roleTitle || ''}
                        placeholder="e.g. CEO & Lead Structural Engineer"
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                      Credentials *
                    </label>
                    <input
                      required
                      name="credentials"
                      defaultValue={editingMember?.credentials || ''}
                      placeholder="e.g. MSc Chalmers University (Sweden), MSc AAiT, BSc Bahir Dar"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                      Detailed Biography *
                    </label>
                    <textarea
                      required
                      name="bio"
                      defaultValue={editingMember?.bio || ''}
                      rows={3}
                      placeholder="Full summary of engineering experience..."
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3 py-2 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950"
                    />
                  </div>

                  <div className="pt-3 flex flex-col sm:flex-row gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-lg bg-neutral-950 text-white font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition cursor-pointer"
                    >
                      Save Specialist Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMember(null);
                        setIsNewMemberModal(false);
                        setMemberImageUrl('');
                      }}
                      className="py-3.5 px-6 rounded-lg bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300 font-mono text-xs uppercase tracking-wider transition cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONFIGURATION & CONTACT INFO */}
      {activeTab === 'config' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-neutral-950">
              Corporate Office &amp; Dynamic Email Settings
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              The primary email configured here updates the entire website footer and receives client briefs.
            </p>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-5">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-2">
              <label className="text-xs font-mono uppercase text-neutral-950 font-bold flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> Company Contact &amp; Notification Recipient Email *
              </label>
              <input
                required
                type="email"
                name="primaryEmail"
                defaultValue={siteConfig.primaryEmail || 'habtamuengr@gmail.com'}
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs text-neutral-950 focus:outline-none focus:border-neutral-950 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                  Company Legal Entity Name
                </label>
                <input
                  name="companyName"
                  defaultValue={siteConfig.companyName || 'MENEN Engineering PLC'}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2 text-xs text-neutral-950"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                  Legal Category / License Classification
                </label>
                <input
                  name="legalCategory"
                  defaultValue={siteConfig.legalCategory || 'Category One Architectural & Engineering Firm'}
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2 text-xs text-neutral-950"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3 px-6 rounded-lg bg-neutral-950 text-white font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" /> Save Office Settings &amp; Footer Email
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: CMS DYNAMIC TEXTS */}
      {activeTab === 'cms' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-neutral-950">
              Live Site Content CMS
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              Edit taglines, vision, mission statements, and core values.
            </p>
          </div>

          <div className="space-y-4">
            {cmsContent.length > 0 ? (
              cmsContent.map((item) => (
                <div key={item.key} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono font-bold text-neutral-900">{item.label}</span>
                    <span className="text-[10px] font-mono text-neutral-400">{item.key}</span>
                  </div>
                  <textarea
                    id={`cms_${item.key}`}
                    defaultValue={item.value}
                    rows={2}
                    className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-950"
                  />
                  <button
                    onClick={() => {
                      const el = document.getElementById(`cms_${item.key}`) as HTMLTextAreaElement;
                      if (el) handleSaveCmsText(item.key, el.value, item.label);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-neutral-950 text-white font-bold font-mono text-[11px] hover:bg-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-neutral-400 font-mono">No CMS items found.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: SECURITY (UPDATE EMAIL AND/OR PASSWORD INDEPENDENTLY) */}
      {activeTab === 'security' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 max-w-xl shadow-sm">
          <div>
            <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
              <Key className="w-5 h-5 text-neutral-900" /> Admin Authentication &amp; Credentials
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-mono">
              Update email only, password only, or both together. The change applies directly to your database login records.
            </p>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                Current Password (Verification)
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password to authorize changes"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs text-neutral-950 font-mono focus:border-neutral-950 outline-none"
              />
            </div>

            <div className="pt-2 border-t border-neutral-200">
              <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                New Authorized Email Address (Leave blank to keep unchanged)
              </label>
              <input
                type="email"
                value={securityEmail}
                onChange={(e) => setSecurityEmail(e.target.value)}
                placeholder="e.g. newadmin@menenengineering.com"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs text-neutral-950 font-mono focus:border-neutral-950 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                New Secret Password (Leave blank to keep unchanged)
              </label>
              <input
                type="password"
                value={securityPassword}
                onChange={(e) => setSecurityPassword(e.target.value)}
                placeholder="Enter new password (min. 6 chars)"
                className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs text-neutral-950 font-mono focus:border-neutral-950 outline-none"
              />
            </div>

            {securityPassword && (
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-600 mb-1 font-bold">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-lg px-3.5 py-2.5 text-xs text-neutral-950 font-mono focus:border-neutral-950 outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={securityLoading}
              className="py-3 px-6 rounded-lg bg-neutral-950 text-white font-bold font-mono text-xs uppercase tracking-wider hover:bg-neutral-800 transition flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              {securityLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" /> Save Updated Credentials
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 7: INBOUND BRIEFS */}
      {activeTab === 'inquiries' && (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-neutral-950">
              Inbound Client Briefs &amp; Applications ({inquiries.length})
            </h3>
          </div>

          <div className="space-y-6">
            {inquiries.length > 0 ? (
              inquiries.map((inq) => {
                const isInternship = inq.projectType?.includes('INTERNSHIP') || inq.scope?.includes('[STUDENT INTERNSHIP');
                let pdfAttachmentUrl: string | null = null;
                let pdfAttachmentName = 'Attached_Document.pdf';

                if (inq.scope) {
                  const urlMatch = inq.scope.match(/URL:\s*(https:\/\/res\.cloudinary\.com\/[^\s\n\r]+)/i) ||
                                   inq.scope.match(/(https:\/\/res\.cloudinary\.com\/[^\s\n\r]+\.pdf)/i);
                  if (urlMatch) pdfAttachmentUrl = urlMatch[1];
                  const nameMatch = inq.scope.match(/File:\s*([^\n\r]+)/i);
                  if (nameMatch) pdfAttachmentName = nameMatch[1].trim();
                }

                return (
                  <div key={inq.id} className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            isInternship 
                              ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' 
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {isInternship ? 'Internship Candidate' : 'Project Brief'}
                          </span>
                          <h4 className="text-base font-bold text-neutral-950 font-serif">
                            {inq.fullName} {inq.organization ? `(${inq.organization})` : ''}
                          </h4>
                        </div>
                        <p className="text-xs font-mono text-neutral-600 mt-1">
                          Phone: {inq.phone} &bull; Email: <a href={`mailto:${inq.email}`} className="underline">{inq.email}</a>
                        </p>
                      </div>

                      <span className={`text-xs font-mono px-3 py-1 rounded-full font-bold uppercase ${
                        inq.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        inq.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {inq.status || 'PENDING'}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-700 bg-white p-4 rounded-xl border border-neutral-200 leading-relaxed whitespace-pre-line">
                      {inq.scope}
                    </div>

                    {pdfAttachmentUrl && (
                      <div className="pt-1 flex flex-wrap items-center gap-2">
                        <a
                          href={`/api/download?url=${encodeURIComponent(pdfAttachmentUrl)}&name=${encodeURIComponent(pdfAttachmentName)}`}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-950 text-white text-xs font-mono font-bold uppercase tracking-wider hover:bg-neutral-800 transition shadow-md"
                        >
                          <FileCheck2 className="w-4 h-4 shrink-0" />
                          <span>📥 Download PDF to Device</span>
                        </a>
                      </div>
                    )}

                    <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] font-mono text-neutral-500">
                        Target Applicant: <strong className="text-neutral-950">{inq.email}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleInquiryDecision(inq.id, inq.email, 'APPROVED')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white border border-emerald-300 text-xs font-mono font-bold cursor-pointer transition"
                        >
                          ✓ Approve &amp; Send Decision Email
                        </button>
                        <button
                          onClick={() => handleInquiryDecision(inq.id, inq.email, 'REJECTED')}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-700 hover:text-white border border-rose-300 text-xs font-mono font-bold cursor-pointer transition"
                        >
                          ✕ Reject &amp; Send Decision Email
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-neutral-400 font-mono">No submissions received yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}