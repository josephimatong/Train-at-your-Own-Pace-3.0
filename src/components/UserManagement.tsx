/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Shield, 
  User, 
  MapPin, 
  Briefcase, 
  Search, 
  X, 
  Check, 
  CheckCircle2, 
  ShieldAlert,
  Sliders,
  Sparkles,
  Users
} from 'lucide-react';
import { UserRole, Language, TRANSLATIONS } from '../types';
import { sendInviteEmail } from '../lib/gmail';
import { 
  saveUserToFirestore, 
  deleteUserFromFirestore,
  getProjectSitesFromFirestore,
  saveProjectSitesToFirestore,
  getWeeHurRolesFromFirestore,
  saveWeeHurRolesToFirestore
} from '../lib/firebaseSync';

interface UserManagementProps {
  currentLanguage: Language;
  currentRole: UserRole;
  leaderboard: any[];
  currentUserEmail: string;
  onRefreshUsers: () => Promise<void>;
  triggerToast: (msg: string, type: 'success' | 'info' | 'warning') => void;
  setSimulatedRole?: (role: UserRole) => void;
  setLeaderboard?: React.Dispatch<React.SetStateAction<any[]>>;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  currentLanguage,
  currentRole,
  leaderboard,
  currentUserEmail,
  onRefreshUsers,
  triggerToast,
  setSimulatedRole,
  setLeaderboard
}) => {
  const t = TRANSLATIONS[currentLanguage];

  // Active tab state (Only editable by super admin & admin)
  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [accessFilter, setAccessFilter] = useState('All');

  // Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUid, setEditingUid] = useState('');

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formProject, setFormProject] = useState('Woodlands BTO Project');
  const [formWeeHurRole, setFormWeeHurRole] = useState('Site Engineer');
  const [formAccessibility, setFormAccessibility] = useState<UserRole>(UserRole.EMPLOYEE);

  // Stateful project sites and job roles at Wee Hur
  const [projectSites, setProjectSites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('weehur_project_sites');
      return saved ? JSON.parse(saved) : [
        'Woodlands BTO Project',
        'Punggol PPVC Site',
        'Kovan Residential',
        'Geylang Warehouse',
        'Changi Site B',
        'Wee Hur HQ Office'
      ];
    } catch {
      return [
        'Woodlands BTO Project',
        'Punggol PPVC Site',
        'Kovan Residential',
        'Geylang Warehouse',
        'Changi Site B',
        'Wee Hur HQ Office'
      ];
    }
  });

  const [weeHurRoles, setWeeHurRoles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('weehur_job_roles');
      return saved ? JSON.parse(saved) : [
        'Safety Coordinator',
        'Site Engineer',
        'Tower Crane Operator',
        'Structural Supervisor',
        'Safety Assistant',
        'WSHO Officer',
        'Site Supervisor',
        'Project Manager',
        'Managing Director'
      ];
    } catch {
      return [
        'Safety Coordinator',
        'Site Engineer',
        'Tower Crane Operator',
        'Structural Supervisor',
        'Safety Assistant',
        'WSHO Officer',
        'Site Supervisor',
        'Project Manager',
        'Managing Director'
      ];
    }
  });

  // Save changes to localStorage so settings are kept locally
  React.useEffect(() => {
    localStorage.setItem('weehur_project_sites', JSON.stringify(projectSites));
  }, [projectSites]);

  React.useEffect(() => {
    localStorage.setItem('weehur_job_roles', JSON.stringify(weeHurRoles));
  }, [weeHurRoles]);

  // Input states for adding new projects/roles
  const [newProjectSite, setNewProjectSite] = useState('');
  const [newJobRole, setNewJobRole] = useState('');

  // Load configuration from Firestore on mount
  React.useEffect(() => {
    async function loadConfig() {
      try {
        const loadedSites = await getProjectSitesFromFirestore();
        if (loadedSites && loadedSites.length > 0) {
          setProjectSites(loadedSites);
        }
        const loadedRoles = await getWeeHurRolesFromFirestore();
        if (loadedRoles && loadedRoles.length > 0) {
          setWeeHurRoles(loadedRoles);
        }
      } catch (err) {
        const errStr = err instanceof Error ? err.message : String(err);
        if (errStr.toLowerCase().includes('offline')) {
          console.warn('Running offline: skipping dynamic configuration load.');
        } else {
          console.error('Error loading dynamic configuration from Firestore:', err);
        }
      }
    }
    loadConfig();
  }, []);

  // Ensure form default project / role correspond to lists
  React.useEffect(() => {
    if (!formProject && projectSites.length > 0) {
      setFormProject(projectSites[0]);
    }
  }, [projectSites, formProject]);

  React.useEffect(() => {
    if (!formWeeHurRole && weeHurRoles.length > 0) {
      setFormWeeHurRole(weeHurRoles[0]);
    }
  }, [weeHurRoles, formWeeHurRole]);

  // Handlers for managing project sites and roles
  const handleAddProjectSite = async () => {
    const trimmed = newProjectSite.trim();
    if (!trimmed) {
      triggerToast('Project site name cannot be empty.', 'warning');
      return;
    }
    if (projectSites.includes(trimmed)) {
      triggerToast('This project site already exists.', 'warning');
      return;
    }
    const updated = [...projectSites, trimmed];
    setProjectSites(updated);
    setNewProjectSite('');
    try {
      await saveProjectSitesToFirestore(updated);
      triggerToast(`Added project site: "${trimmed}"`, 'success');
      await onRefreshUsers();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to save updated project sites to cloud.', 'warning');
    }
  };

  const handleDeleteProjectSite = async (siteToDelete: string) => {
    if (projectSites.length <= 1) {
      triggerToast('You must keep at least one project site in the system.', 'warning');
      return;
    }
    if (confirm(`Are you sure you want to delete the project site "${siteToDelete}"? Users assigned to this site will remain, but the option will be removed from future assignments.`)) {
      const updated = projectSites.filter(site => site !== siteToDelete);
      setProjectSites(updated);
      if (formProject === siteToDelete) {
        setFormProject(updated[0]);
      }
      try {
        await saveProjectSitesToFirestore(updated);
        triggerToast(`Deleted project site: "${siteToDelete}"`, 'success');
        await onRefreshUsers();
      } catch (err) {
        console.error(err);
        triggerToast('Failed to save updated project sites to cloud.', 'warning');
      }
    }
  };

  const handleAddJobRole = async () => {
    const trimmed = newJobRole.trim();
    if (!trimmed) {
      triggerToast('Job title cannot be empty.', 'warning');
      return;
    }
    if (weeHurRoles.includes(trimmed)) {
      triggerToast('This job title already exists.', 'warning');
      return;
    }
    const updated = [...weeHurRoles, trimmed];
    setWeeHurRoles(updated);
    setNewJobRole('');
    try {
      await saveWeeHurRolesToFirestore(updated);
      triggerToast(`Added job title: "${trimmed}"`, 'success');
      await onRefreshUsers();
    } catch (err) {
      console.error(err);
      triggerToast('Failed to save updated job titles to cloud.', 'warning');
    }
  };

  const handleDeleteJobRole = async (roleToDelete: string) => {
    if (weeHurRoles.length <= 1) {
      triggerToast('You must keep at least one job title in the system.', 'warning');
      return;
    }
    if (confirm(`Are you sure you want to delete the job title "${roleToDelete}"? Users assigned this role will remain, but the option will be removed from future assignments.`)) {
      const updated = weeHurRoles.filter(role => role !== roleToDelete);
      setWeeHurRoles(updated);
      if (formWeeHurRole === roleToDelete) {
        setFormWeeHurRole(updated[0]);
      }
      try {
        await saveWeeHurRolesToFirestore(updated);
        triggerToast(`Deleted job title: "${roleToDelete}"`, 'success');
        await onRefreshUsers();
      } catch (err) {
        console.error(err);
        triggerToast('Failed to save updated job titles to cloud.', 'warning');
      }
    }
  };


  // Filtered list of users
  const filteredUsers = leaderboard.filter(user => {
    const matchesSearch = 
      (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // In our leaderboard, `user.site` maps to their project site
    const matchesProject = projectFilter === 'All' || user.site === projectFilter;
    
    // In our leaderboard, `user.role` maps to their Wee Hur Job title
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;

    // Accessibility rights map to our database user role.
    // We can fetch this from `user.accessibilityRole` or fall back to their database status.
    // We'll calculate it from leaderboard details
    const userAccessLevel = user.accessibilityRole || 'employee'; 
    const matchesAccess = accessFilter === 'All' || userAccessLevel === accessFilter;

    return matchesSearch && matchesProject && matchesRole && matchesAccess;
  });

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingUid('');
    setFormName('');
    setFormEmail('');
    setFormProject('Woodlands BTO Project');
    setFormWeeHurRole('Site Engineer');
    setFormAccessibility(UserRole.EMPLOYEE);
    setShowModal(true);
  };

  const handleOpenEdit = (user: any) => {
    setIsEditing(true);
    setEditingUid(user.uid || '');
    setFormName(user.name || '');
    setFormEmail(user.email || '');
    setFormProject(user.site || 'Woodlands BTO Project');
    setFormWeeHurRole(user.role || 'Site Engineer');
    setFormAccessibility((user.accessibilityRole as UserRole) || UserRole.EMPLOYEE);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) {
      triggerToast('Please fill in both Name and Email fields.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail)) {
      triggerToast('Please provide a valid email address.', 'warning');
      return;
    }

    const targetUid = isEditing ? editingUid : `simulated_user_${Date.now()}`;
    const existingUser = leaderboard.find(u => u.uid === targetUid);
    const updatedUser = {
      uid: targetUid,
      email: formEmail,
      name: formName,
      xp: existingUser ? (existingUser.xp || 0) : 0,
      completions: existingUser ? (existingUser.completions || 0) : 0,
      badges: existingUser ? (existingUser.badges || []) : [],
      role: formWeeHurRole,
      site: formProject,
      accessibilityRole: formAccessibility,
      isCurrentUser: existingUser ? !!existingUser.isCurrentUser : false
    };

    try {
      await saveUserToFirestore({
        uid: targetUid,
        email: formEmail,
        displayName: formName,
        role: formAccessibility,
        project: formProject,
        weeHurRole: formWeeHurRole,
        xp: updatedUser.xp,
        completions: updatedUser.completions,
        badges: updatedUser.badges
      });

      triggerToast(
        isEditing ? 'User profile updated in Firestore cloud.' : 'New user successfully added to Firestore cloud.', 
        'success'
      );
      
      if (!isEditing) {
        try {
          await sendInviteEmail({
            toEmail: formEmail,
            userName: formName,
            userRole: formWeeHurRole,
            userSite: formProject,
            accessibilityRole: formAccessibility,
            appUrl: window.location.origin
          });
          triggerToast(`Invitation email with direct link sent to ${formEmail}!`, 'success');
        } catch (emailErr: any) {
          console.error('Failed to send invitation email:', emailErr);
          triggerToast('User created, but email invite could not be sent. Please link your Google Account.', 'warning');
        }
      }
      
      setShowModal(false);
      await onRefreshUsers();
    } catch (err) {
      const errStr = err instanceof Error ? err.message : String(err);
      if (errStr.toLowerCase().includes('offline')) {
        console.warn('Running offline: fallback to local user profile update.');
      } else {
        console.error('Error saving user profile to Firestore:', err);
      }
      // Fallback: update locally
      if (setLeaderboard) {
        setLeaderboard(prev => {
          let updatedList;
          if (isEditing) {
            updatedList = prev.map(u => u.uid === targetUid ? updatedUser : u);
          } else {
            updatedList = [...prev, updatedUser];
          }
          return updatedList
            .sort((a, b) => b.xp - a.xp)
            .map((item, index) => ({ ...item, rank: index + 1 }));
        });
        triggerToast(
          isEditing ? 'User profile updated locally (Firestore offline).' : 'New user successfully added locally (Firestore offline).',
          'success'
        );
        setShowModal(false);
      } else {
        triggerToast('Could not sync user changes to Firestore.', 'warning');
      }
    }
  };

  const handleUpdateUserRole = async (user: any, newRole: UserRole) => {
    if (!confirm(`Are you sure you want to change the system access role of ${user.name} to ${getRoleLabel(newRole)}?`)) return;
    try {
      await saveUserToFirestore({
        uid: user.uid,
        email: user.email,
        displayName: user.name,
        role: newRole,
        project: user.site,
        weeHurRole: user.role,
        xp: user.xp,
        completions: user.completions,
        badges: user.badges
      });
      triggerToast(`Successfully updated ${user.name}'s role to ${getRoleLabel(newRole)}.`, 'success');
      await onRefreshUsers();
    } catch (err) {
      console.error('Failed to update role:', err);
      triggerToast('Failed to update user role.', 'warning');
    }
  };

  const handleDelete = async (uid: string, name: string) => {
    if (confirm(`Are you sure you want to delete user "${name}" from the system?`)) {
      try {
        await deleteUserFromFirestore(uid);
        triggerToast(`User "${name}" has been deleted from Firestore.`, 'success');
        await onRefreshUsers();
      } catch (err) {
        const errStr = err instanceof Error ? err.message : String(err);
        if (errStr.toLowerCase().includes('offline')) {
          console.warn('Running offline: fallback to local user deletion.');
        } else {
          console.error('Error deleting user profile:', err);
        }
        if (setLeaderboard) {
          setLeaderboard(prev => {
            const updatedList = prev.filter(u => u.uid !== uid);
            return updatedList.map((item, index) => ({ ...item, rank: index + 1 }));
          });
          triggerToast(`User "${name}" has been deleted locally (Firestore offline).`, 'success');
        } else {
          triggerToast('Could not delete user from Firestore.', 'warning');
        }
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'admin':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'manager':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'manager':
        return 'Manager';
      default:
        return 'Employee';
    }
  };

  return (
    <div id="user-management-panel" className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      
      {/* Decorative Subtle Accent Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.04),transparent_50%)] pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-800 z-10 relative">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            {t.userManagement || "User & Project Management"}
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Configure employee placement across construction projects, update job titles within Wee Hur, and configure access level permissions.
          </p>
        </div>
        
        {/* Add User Trigger */}
        {(currentRole === UserRole.ADMIN || currentRole === UserRole.SUPER_ADMIN || currentRole === UserRole.MANAGER) && (
          <button
            onClick={handleOpenAdd}
            className="shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        )}
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-b border-slate-800/60 font-mono text-center">
        <div className="bg-slate-950/40 border border-slate-850/60 p-3 rounded-lg">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total System Users</p>
          <p className="text-lg font-black text-slate-200 mt-1">{leaderboard.length}</p>
        </div>
        <div className="bg-slate-950/40 border border-slate-850/60 p-3 rounded-lg">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Super Admins</p>
          <p className="text-lg font-black text-purple-400 mt-1">
            {leaderboard.filter(u => u.accessibilityRole === 'super_admin').length}
          </p>
        </div>
        <div className="bg-slate-950/40 border border-slate-850/60 p-3 rounded-lg">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Project Sites</p>
          <p className="text-lg font-black text-cyan-400 mt-1">
            {new Set(leaderboard.map(u => u.site).filter(Boolean)).size || 1}
          </p>
        </div>
        <div className="bg-slate-950/40 border border-slate-850/60 p-3 rounded-lg">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending Offline Syncs</p>
          <p className="text-lg font-black text-emerald-400 mt-1">0</p>
        </div>
      </div>

      {/* Tab Switcher (Only for Admins/Super Admins) */}
      {(currentRole === UserRole.ADMIN || currentRole === UserRole.SUPER_ADMIN) && (
        <div className="flex items-center gap-2 mt-4 pb-1 border-b border-slate-800/60 z-10 relative">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'text-purple-400 border-purple-500 bg-purple-500/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Users Directory
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'text-purple-400 border-purple-500 bg-purple-500/5'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            Project & Job Title Settings
          </button>
        </div>
      )}

      {activeTab === 'users' && (
        <>
          {/* Interactive Searching and Filter Controls */}
          <div className="py-5 flex flex-col lg:flex-row items-stretch lg:items-center gap-4 z-10 relative">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Email, or Employee UID..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Project Site Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Site:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="All">All Sites</option>
              {projectSites.map(site => (
                <option key={site} value={site}>{site}</option>
              ))}
            </select>
          </div>

          {/* Job Title Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Job:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="All">All Jobs</option>
              {weeHurRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Accessibility Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Access:</span>
            <select
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="All">All Tiers</option>
              <option value="employee">Employee View</option>
              <option value="manager">Team Manager</option>
              <option value="admin">Administrator</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Data Grid Table */}
      <div className="bg-slate-950 border border-slate-850/80 rounded-xl overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                <th className="px-5 py-4">Employee Details</th>
                <th className="px-5 py-4">Wee Hur Job Role</th>
                <th className="px-5 py-4">Project Placement</th>
                <th className="px-5 py-4">Accessibility Rights</th>
                <th className="px-5 py-4">Training Stats</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/40 text-xs">
              {filteredUsers.map((user, idx) => {
                const isUserSelf = user.email === currentUserEmail;
                const accessLevel = user.accessibilityRole || 'employee';

                return (
                  <tr 
                    key={user.uid || idx} 
                    className={`hover:bg-slate-900/50 transition-colors ${
                      isUserSelf ? 'bg-purple-500/5 hover:bg-purple-500/10' : ''
                    }`}
                  >
                    {/* User Identity Details */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700/85 flex items-center justify-center font-bold text-slate-200">
                          {user.name ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'WH'}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-200 flex items-center gap-1.5">
                            {user.name}
                            {isUserSelf && (
                              <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.2 rounded border border-purple-500/30">
                                YOU
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Job Role inside Wee Hur */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                        <span>{user.role || 'Structural Supervisor'}</span>
                      </div>
                    </td>

                    {/* Assigned Project Site */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span>{user.site || 'Kovan Residential'}</span>
                      </div>
                    </td>

                    {/* Access level (Rights) */}
                    <td className="px-5 py-4">
                      {((currentRole === UserRole.SUPER_ADMIN || currentRole === UserRole.ADMIN) && !isUserSelf) ? (
                        <select
                          value={accessLevel}
                          onChange={(e) => handleUpdateUserRole(user, e.target.value as UserRole)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-md font-mono cursor-pointer outline-none bg-slate-900 ${getRoleBadgeColor(accessLevel)}`}
                        >
                          <option value={UserRole.EMPLOYEE} className="bg-slate-900 text-slate-200">{getRoleLabel(UserRole.EMPLOYEE)}</option>
                          <option value={UserRole.MANAGER} className="bg-slate-900 text-slate-200">{getRoleLabel(UserRole.MANAGER)}</option>
                          <option value={UserRole.ADMIN} className="bg-slate-900 text-slate-200">{getRoleLabel(UserRole.ADMIN)}</option>
                          {currentRole === UserRole.SUPER_ADMIN && (
                            <option value={UserRole.SUPER_ADMIN} className="bg-slate-900 text-slate-200">{getRoleLabel(UserRole.SUPER_ADMIN)}</option>
                          )}
                        </select>
                      ) : (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${getRoleBadgeColor(accessLevel)}`}>
                          {getRoleLabel(accessLevel)}
                        </span>
                      )}
                    </td>

                    {/* Training Progress (XP / completions) */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5 font-mono text-[10px]">
                        <p className="text-slate-300">
                          <span className="text-cyan-400 font-bold">{user.xp || 0}</span> XP
                        </p>
                        <p className="text-slate-500">
                          <span className="text-emerald-400 font-bold">{user.completions || 0}</span> completions
                        </p>
                      </div>
                    </td>

                    {/* Admin Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {/* Simulate role switch */}
                        {setSimulatedRole && (
                          <button
                            onClick={() => {
                              setSimulatedRole(accessLevel as UserRole);
                              triggerToast(`Switched simulated view to: ${getRoleLabel(accessLevel)}`, 'info');
                            }}
                            title={`Simulate Login As ${getRoleLabel(accessLevel)}`}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 rounded transition-all cursor-pointer"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Edit Button */}
                        {(currentRole === UserRole.ADMIN || currentRole === UserRole.SUPER_ADMIN || currentRole === UserRole.MANAGER) && (
                          <button
                            onClick={() => handleOpenEdit(user)}
                            title="Edit Assignment"
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/20 rounded transition-all cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Button */}
                        {(currentRole === UserRole.ADMIN || currentRole === UserRole.SUPER_ADMIN || currentRole === UserRole.MANAGER) && !isUserSelf && (
                          <button
                            onClick={() => handleDelete(user.uid, user.name)}
                            title="Delete User"
                            className="p-1.5 bg-slate-900 hover:bg-red-950 text-slate-500 hover:text-red-400 border border-slate-800 hover:border-red-500/20 rounded transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-xs font-medium">
                    No Wee Hur users match your filter or search keywords.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}

      {/* Dynamic Project & Job Title Settings View */}
      {activeTab === 'settings' && (currentRole === UserRole.ADMIN || currentRole === UserRole.SUPER_ADMIN) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 animate-in fade-in slide-in-from-bottom-3 duration-200 z-10 relative">
          
          {/* Project Sites Settings Panel */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-xl space-y-4 shadow-inner">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Project Sites List</h3>
                <p className="text-[10px] text-slate-500 font-mono">Manage active construction sites for employee assignments</p>
              </div>
            </div>

            {/* Input to add */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newProjectSite}
                onChange={(e) => setNewProjectSite(e.target.value)}
                placeholder="e.g. Newton Road PPVC Site"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={handleAddProjectSite}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Site
              </button>
            </div>

            {/* Scrollable list */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-850/30 pr-1 space-y-1">
              {projectSites.map((site) => (
                <div key={site} className="flex items-center justify-between py-2 px-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-850/40 rounded-lg transition-colors group">
                  <span className="text-xs text-slate-300 font-medium">{site}</span>
                  <button
                    onClick={() => handleDeleteProjectSite(site)}
                    className="p-1 hover:bg-red-950/40 text-slate-500 hover:text-red-400 rounded transition-all cursor-pointer opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title={`Delete "${site}"`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Job Titles Settings Panel */}
          <div className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-xl space-y-4 shadow-inner">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800/60">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Job Titles List</h3>
                <p className="text-[10px] text-slate-500 font-mono">Manage professional roles within Wee Hur</p>
              </div>
            </div>

            {/* Input to add */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newJobRole}
                onChange={(e) => setNewJobRole(e.target.value)}
                placeholder="e.g. Senior BIM Modeler"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
              <button
                onClick={handleAddJobRole}
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Role
              </button>
            </div>

            {/* Scrollable list */}
            <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-850/30 pr-1 space-y-1">
              {weeHurRoles.map((role) => (
                <div key={role} className="flex items-center justify-between py-2 px-3 bg-slate-900/40 hover:bg-slate-900 border border-slate-850/40 rounded-lg transition-colors group">
                  <span className="text-xs text-slate-300 font-medium">{role}</span>
                  <button
                    onClick={() => handleDeleteJobRole(role)}
                    className="p-1 hover:bg-red-950/40 text-slate-500 hover:text-red-400 rounded transition-all cursor-pointer opacity-100 md:opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title={`Delete "${role}"`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* FORM MODAL (Add / Edit User) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-950/40 border-b border-slate-850 px-5 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                {isEditing ? 'Modify User Profile' : 'Add New System User'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Gmail Invite Integration Notice */}
              {!isEditing && (
                <div className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                  sessionStorage.getItem('weehur_drive_token')
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}>
                  <span className="text-sm mt-0.5">📧</span>
                  <div>
                    <p className="font-bold">Automated Gmail Invitations</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {sessionStorage.getItem('weehur_drive_token')
                        ? 'Connected. The invited user will automatically receive a welcome email with a secure direct app link.'
                        : 'Google Account not connected. To send automated invite emails with direct portal links, please connect your corporate Google Account in the main menu.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  disabled={isEditing}
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="e.g. ramesh@weehur.com.sg"
                  className="w-full bg-slate-950 border border-slate-800 disabled:border-slate-850 rounded-lg px-3 py-2.5 text-xs text-slate-200 disabled:text-slate-500 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Project Assignment */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Assign Project Site
                </label>
                <select
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                >
                  {projectSites.map(site => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>

              {/* Wee Hur Job Role */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Wee Hur Job Title
                </label>
                <select
                  value={formWeeHurRole}
                  onChange={(e) => setFormWeeHurRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                >
                  {weeHurRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Accessibility Rights Options */}
              {currentRole === UserRole.SUPER_ADMIN && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Accessibility Rights Tier
                  </label>
                <div className="grid grid-cols-2 gap-2">
                  {/* Employee */}
                  <label className={`border rounded-lg p-2.5 flex items-start gap-2 cursor-pointer transition-all ${
                    formAccessibility === UserRole.EMPLOYEE 
                      ? 'bg-cyan-500/5 border-cyan-500/50 text-cyan-300' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}>
                    <input
                      type="radio"
                      name="form-accessibility"
                      value={UserRole.EMPLOYEE}
                      checked={formAccessibility === UserRole.EMPLOYEE}
                      onChange={() => setFormAccessibility(UserRole.EMPLOYEE)}
                      className="mt-0.5 accent-cyan-500"
                    />
                    <div className="text-[10px]">
                      <p className="font-extrabold font-mono text-[11px]">Employee View</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Safety & quiz trainee flow</p>
                    </div>
                  </label>

                  {/* Manager */}
                  <label className={`border rounded-lg p-2.5 flex items-start gap-2 cursor-pointer transition-all ${
                    formAccessibility === UserRole.MANAGER 
                      ? 'bg-amber-500/5 border-amber-500/50 text-amber-300' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}>
                    <input
                      type="radio"
                      name="form-accessibility"
                      value={UserRole.MANAGER}
                      checked={formAccessibility === UserRole.MANAGER}
                      onChange={() => setFormAccessibility(UserRole.MANAGER)}
                      className="mt-0.5 accent-amber-500"
                    />
                    <div className="text-[10px]">
                      <p className="font-extrabold font-mono text-[11px]">Manager View</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Team safety analytics</p>
                    </div>
                  </label>

                  {/* Admin */}
                  <label className={`border rounded-lg p-2.5 flex items-start gap-2 cursor-pointer transition-all ${
                    formAccessibility === UserRole.ADMIN 
                      ? 'bg-red-500/5 border-red-500/50 text-red-300' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}>
                    <input
                      type="radio"
                      name="form-accessibility"
                      value={UserRole.ADMIN}
                      checked={formAccessibility === UserRole.ADMIN}
                      onChange={() => setFormAccessibility(UserRole.ADMIN)}
                      className="mt-0.5 accent-red-500"
                    />
                    <div className="text-[10px]">
                      <p className="font-extrabold font-mono text-[11px]">Admin View</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Upload tutorials & settings</p>
                    </div>
                  </label>

                  {/* Super Admin */}
                  <label className={`border rounded-lg p-2.5 flex items-start gap-2 cursor-pointer transition-all ${
                    formAccessibility === UserRole.SUPER_ADMIN 
                      ? 'bg-purple-500/5 border-purple-500/50 text-purple-300' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}>
                    <input
                      type="radio"
                      name="form-accessibility"
                      value={UserRole.SUPER_ADMIN}
                      checked={formAccessibility === UserRole.SUPER_ADMIN}
                      onChange={() => setFormAccessibility(UserRole.SUPER_ADMIN)}
                      className="mt-0.5 accent-purple-500"
                    />
                    <div className="text-[10px]">
                      <p className="font-extrabold font-mono text-[11px]">Super Admin</p>
                      <p className="text-[9px] text-slate-500 mt-0.5 leading-tight">Full controls & User panel</p>
                    </div>
                  </label>
                </div>
              </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-slate-950 hover:bg-slate-850 text-slate-300 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold px-4.5 py-2.5 rounded-lg shadow-lg shadow-purple-500/15 transition-all cursor-pointer"
                >
                  {isEditing ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
