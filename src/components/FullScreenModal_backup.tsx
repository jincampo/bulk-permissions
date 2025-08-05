import React, { useState, useEffect, useRef } from 'react';

interface FullScreenModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  selectedUsersCount: number;
}

interface App {
  name: string;
  icon: string;
  roles: string[];
}

interface User {
  name: string;
  email: string;
  pendoRoles: string;
  feedbackRoles: string;
  teams: string;
  lastLogin: string;
  apps?: App[];
}

const affectedUsers: User[] = [
  {
    name: 'Bobby Burgers',
    email: 'Bobby.burgers@email.com',
    pendoRoles: 'User: 3 roles across 4 apps',
    feedbackRoles: 'Administrator',
    teams: '🏢 Platform team\n+ 2 more teams',
    lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
  },
  {
    name: 'Linda Person',
    email: 'Linda.Person@email.com',
    pendoRoles: 'Subscription Admin',
    feedbackRoles: 'Administrator',
    teams: 'No team assigned',
    lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
  },
  {
    name: 'Gene Frenzy',
    email: 'Gene.frenzy@email.com',
    pendoRoles: 'User',
    feedbackRoles: 'Administrator',
    teams: '🔍 Analytics team',
    lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
  },
  {
    name: 'Jake Johnson',
    email: 'Jake.johnson@email.com',
    pendoRoles: 'Subscription Admin',
    feedbackRoles: 'Administrator',
    teams: '🎧 Listen team\n+ 2 more teams',
    lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
  },
  {
    name: 'Rick Ramstein',
    email: 'Rick.ramstein@email.com',
    pendoRoles: 'User',
    feedbackRoles: 'Administrator',
    teams: '📚 Guides team\n+ 2 more teams',
    lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
  },
  {
    name: 'Person Name',
    email: 'Person.name@email.com',
    pendoRoles: 'Subscription Admin',
    feedbackRoles: 'Administrator',
    teams: '🔍 Analytics team',
    lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
  }
];

const FullScreenModalV2: React.FC<FullScreenModalV2Props> = ({ isOpen, onClose, selectedUsersCount }) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [subscriptionRoles, setSubscriptionRoles] = useState<string[]>([]);
  const [appRoles, setAppRoles] = useState<string[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isBladeOpen, setIsBladeOpen] = useState(false);
  const [isSubscriptionDropdownOpen, setIsSubscriptionDropdownOpen] = useState(false);
  const [subscriptionSearchTerm, setSubscriptionSearchTerm] = useState('');
  const subscriptionDropdownRef = useRef<HTMLDivElement>(null);
  const [isAppRolesDropdownOpen, setIsAppRolesDropdownOpen] = useState(false);
  const [appRolesSearchTerm, setAppRolesSearchTerm] = useState('');
  const appRolesDropdownRef = useRef<HTMLDivElement>(null);
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false);
  const [appsSearchTerm, setAppsSearchTerm] = useState('');
  const appsDropdownRef = useRef<HTMLDivElement>(null);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const actionDropdownRef = useRef<HTMLDivElement>(null);
  
  // State for tracking checkbox selections
  const [selectedPermissions, setSelectedPermissions] = useState({
    // Subscription level permissions (clear all except disabled ones)
    'report-collaborator': false,
    'segment-collaborator': false,
    'segment-verifier': false,
    'listen-viewer': true, // disabled, keep checked
    'listen-editor': false,
    'listen-manager': false,
    'roadmaps-viewer': true, // disabled, keep checked
    'roadmaps-editor': false,
    'roadmaps-manager': false,
    // App level permissions (clear all except disabled ones)
    'app-viewer': true, // disabled, keep checked
    'app-tagging-editor': false,
    'guides-creator': false,
    'guides-publisher': false,
    'guides-content-editor': false,
    'guides-rc-author': false,
    'guides-rc-publisher': false,
    'session-replay-user': false
  });

  // App selection state
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [appSearchQuery, setAppSearchQuery] = useState('');
  
  // Replace permissions state
  const [replaceFromOption, setReplaceFromOption] = useState('');
  
  // Mock app data
  const allApps = [
    { id: 'app-1', name: 'Name of app that is too long...', role: 'Viewer' },
    { id: 'app-2', name: 'Analytics Dashboard', role: 'Viewer' },
    { id: 'app-3', name: 'Customer Portal', role: 'Viewer' },
    { id: 'app-4', name: 'Admin Console', role: 'Viewer' },
    { id: 'app-5', name: 'Reporting Tool', role: 'Viewer' },
    { id: 'app-6', name: 'User Management', role: 'Viewer' },
    { id: 'app-7', name: 'Data Explorer', role: 'Viewer' },
    { id: 'app-8', name: 'API Gateway', role: 'Viewer' }
  ];

  // Filter apps based on search query
  const filteredSelectableApps = allApps.filter(app => 
    app.name.toLowerCase().includes(appSearchQuery.toLowerCase())
  );

  // Action options for the dropdown
  const actionOptions = [
    { 
      id: 'add-apps-roles', 
      label: 'Add apps and roles', 
      description: 'Grant additional apps and permissions to selected users'
    },
    { 
      id: 'remove-apps-roles', 
      label: 'Remove apps and roles', 
      description: 'Remove apps and permissions from selected users'
    },
    { 
      id: 'replace-permissions', 
      label: 'Replace permissions', 
      description: 'Replace current permissions with new ones'
    }
  ];

  const selectedActionOption = actionOptions.find(option => option.id === selectedAction);



  // Get dynamic title for middle card based on selected action
  const getMiddleCardTitle = () => {
    switch (selectedAction) {
      case 'add-apps-roles':
        return 'Select permissions to add';
      case 'remove-apps-roles':
        return 'Select permissions to remove';
      case 'replace-permissions':
        return 'Select new permissions';
      default:
        return 'Select permissions';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subscriptionDropdownRef.current && !subscriptionDropdownRef.current.contains(event.target as Node)) {
        setIsSubscriptionDropdownOpen(false);
      }
      if (appRolesDropdownRef.current && !appRolesDropdownRef.current.contains(event.target as Node)) {
        setIsAppRolesDropdownOpen(false);
      }
      if (appsDropdownRef.current && !appsDropdownRef.current.contains(event.target as Node)) {
        setIsAppsDropdownOpen(false);
      }
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(event.target as Node)) {
        setIsActionDropdownOpen(false);
      }

    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  const handleFormChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    if (value && !hasChanges) {
      setHasChanges(true);
    }
  };

  const handleActionChange = (value: string) => {
    setSelectedAction(value);
    
    // If "Add apps" is selected, preselect "Viewer" in app roles
    if (value === 'add-apps') {
      setAppRoles(['Viewer']);
    }
    
    if (value && !hasChanges) {
      setHasChanges(true);
    }
  };

  // Check if there are actual meaningful selections to show summary
  // Need both action AND roles to show meaningful summary
  const hasPermissionSelections = Object.values(selectedPermissions).some(permission => {
    // Exclude disabled permissions from count
    const disabledPermissions = ['listen-viewer', 'roadmaps-viewer', 'app-viewer'];
    const permissionKey = Object.keys(selectedPermissions).find(key => selectedPermissions[key as keyof typeof selectedPermissions] === permission);
    return permission && !disabledPermissions.includes(permissionKey || '');
  });
  
  const hasActualSelections = selectedAction && (subscriptionRoles.length > 0 || appRoles.length > 0 || selectedApps.length > 0 || hasPermissionSelections || selectedAppIds.length > 0);

  const appOptions = [
    { name: 'Application 1', value: 'app1' },
    { name: 'Application 2', value: 'app2' },
    { name: 'Application 3', value: 'app3' }
  ];

  const filteredApps = appOptions.filter(app => 
    app.name.toLowerCase().includes(appsSearchTerm.toLowerCase())
  );

  const handleSubscriptionRoleToggle = (role: string) => {
    const newRoles = subscriptionRoles.includes(role)
      ? subscriptionRoles.filter(r => r !== role)
      : [...subscriptionRoles, role];
    
    setSubscriptionRoles(newRoles);
    if (newRoles.length > 0 && !hasChanges) {
      setHasChanges(true);
    }
  };

  const handleAppRoleToggle = (role: string) => {
    const newRoles = appRoles.includes(role)
      ? appRoles.filter(r => r !== role)
      : [...appRoles, role];
    
    setAppRoles(newRoles);
    if (newRoles.length > 0 && !hasChanges) {
      setHasChanges(true);
    }
  };

  const handleAppToggle = (app: string) => {
    const newApps = selectedApps.includes(app)
      ? selectedApps.filter(a => a !== app)
      : [...selectedApps, app];
    
    setSelectedApps(newApps);
    if (newApps.length > 0 && !hasChanges) {
      setHasChanges(true);
    }
  };

  const subscriptionRoleOptions = [
    { category: 'SEGMENTS AND REPORTS', roles: ['Report collaborator', 'Segment collaborator', 'Segment verifier'] },
    { category: 'LISTEN', roles: ['Viewer', 'Editor', 'Manager'] },
    { category: 'ROADMAPS', roles: ['Viewer', 'Editor', 'Manager'] }
  ];

  const filteredSubscriptionRoles = subscriptionRoleOptions.map(category => ({
    ...category,
    roles: category.roles.filter(role => 
      role.toLowerCase().includes(subscriptionSearchTerm.toLowerCase())
    )
  })).filter(category => category.roles.length > 0);

  const appRoleOptions = [
    { category: 'APP WIDE', roles: ['Viewer', 'Tagging editor'] },
    { category: 'GUIDES', roles: ['Creator', 'Publisher', 'Content editor', 'Resource center author', 'Resource center publisher'] },
    { category: 'SESSION REPLAY', roles: ['User'] }
  ];

  const filteredAppRoles = appRoleOptions.map(category => ({
    ...category,
    roles: category.roles.filter(role => 
      role.toLowerCase().includes(appRolesSearchTerm.toLowerCase())
    )
  })).filter(category => category.roles.length > 0);

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsBladeOpen(true);
  };

  const handleCloseBlade = () => {
    setIsBladeOpen(false);
    setTimeout(() => setSelectedUser(null), 300); // Wait for animation to complete
  };

  const handlePermissionToggle = (permissionId: keyof typeof selectedPermissions) => {
    // Don't allow toggling disabled permissions
    const disabledPermissions = ['listen-viewer', 'roadmaps-viewer', 'app-viewer'];
    if (disabledPermissions.includes(permissionId)) {
      return;
    }
    
    setSelectedPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
    
    if (!hasChanges) {
      setHasChanges(true);
    }
  };

  // App selection handlers for the app level permissions section
  const handleSelectableAppToggle = (appId: string) => {
    setSelectedAppIds(prev => {
      const newSelection = prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId];
      if (!hasChanges && newSelection.length > 0) {
        setHasChanges(true);
      }
      return newSelection;
    });
  };

  const handleSelectAllSelectableApps = () => {
    const allAppIds = filteredSelectableApps.map(app => app.id);
    setSelectedAppIds(allAppIds);
    if (!hasChanges && allAppIds.length > 0) {
      setHasChanges(true);
    }
  };

  const handleClearSelectableAppSelections = () => {
    setSelectedAppIds([]);
  };

  const handleUnassignSelectableApps = () => {
    setSelectedAppIds([]);
    if (!hasChanges) {
      setHasChanges(true);
    }
  };

  // Action dropdown handler
  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId);
    setIsActionDropdownOpen(false);
    // Reset replace option when changing actions
    if (actionId !== 'replace-permissions') {
      setReplaceFromOption('');
    }
    if (!hasChanges) {
      setHasChanges(true);
    }
  };

  // Replace permissions handler
  const handleReplaceOptionSelect = (optionId: string) => {
    setReplaceFromOption(optionId);
    if (!hasChanges) {
      setHasChanges(true);
    }
  };

  const hasRolesAcrossApps = (roles: string) => {
    return roles.includes('roles across') && roles.includes('apps');
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-auto">
      {/* Header - Sticky at top */}
      <div className="sticky top-0 z-40 flex justify-between items-center bg-white h-16 px-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Edit permissions (V2)</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-normal leading-none w-6 h-6 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      <div className="flex gap-4 p-4 min-h-[calc(100vh-64px)]">
        {/* Left panel - Permission changes & Selected users - Sticky */}
        <div className="w-[320px] flex-shrink-0 flex flex-col gap-4 sticky top-4 self-start h-[calc(100vh-96px)]">
          {/* Permission changes section */}
                      <div className="bg-white rounded-[3px] border border-[#dadce5] w-[320px]">
            <div className="px-4 py-[13px]">
              <h3 className="text-[18px] font-normal leading-[1.2] text-black text-left font-['Inter']">
                Permission changes
              </h3>
            </div>
            
            {/* Horizontal separator */}
            <div className="h-0 w-full relative">
              <div className="absolute bottom-0 left-0 right-0 top-[-1px] border-b border-[#dadce5]"></div>
            </div>
            
            <div className="p-4">
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-1">
                  <span className="text-[14.222px] font-semibold leading-[1.5] text-[#2a2c35] font-['Inter']">
                    What would you like to do?
                  </span>
                  <span className="text-[#e83b3b]">*</span>
                </div>
                <div className="relative w-full" ref={actionDropdownRef}>
                  <button
                    onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                    className="bg-white border border-[#dadce5] rounded-[3px] h-9 flex items-center justify-between pl-2 pr-2.5 py-[9px] w-full hover:border-[#128297] transition-colors"
                  >
                    <span className={`text-[14.222px] font-normal leading-[1.5] font-['Inter'] ${selectedActionOption ? 'text-[#2a2c35]' : 'text-[#6a6c75]'}`}>
                      {selectedActionOption ? selectedActionOption.label : 'Select changes'}
                    </span>
                    <svg 
                      className={`w-3.5 h-3.5 transition-transform ${isActionDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      viewBox="0 0 14 14"
                    >
                      <path d="M3.5 5.25L7 8.75l3.5-3.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  {isActionDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#dadce5] rounded-[3px] shadow-lg z-50 max-h-60 overflow-y-auto">
                      {actionOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleActionSelect(option.id)}
                          className="w-full px-3 py-3 text-left hover:bg-[#f8f9fa] transition-colors border-b border-[#eaecf1] last:border-b-0"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">
                              {option.label}
                            </span>
                            <span className="text-[12.642px] font-normal text-[#6a6c75] font-['Inter'] leading-[1.4]">
                              {option.description}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Horizontal separator */}
            <div className="h-0 w-full relative">
              <div className="absolute bottom-0 left-0 right-0 top-[-1px] border-b border-[#dadce5]"></div>
            </div>
          </div>

          {/* Selected users section */}
          <div className="bg-white rounded-[3px] border border-[#dadce5] w-[320px] flex-1 flex flex-col min-h-0">
            <div className="px-4 py-[13px]">
              <h3 className="text-[18px] font-normal leading-[1.2] text-black text-left font-['Inter']">
                Selected users
              </h3>
            </div>
            
            {/* Horizontal separator */}
            <div className="h-0 w-full relative">
              <div className="absolute bottom-0 left-0 right-0 top-[-1px] border-b border-[#dadce5]"></div>
            </div>
            
            {/* Another separator for spacing */}
            <div className="h-0 w-full relative">
              <div className="absolute bottom-0 left-0 right-0 top-[-1px] border-b border-[#dadce5]"></div>
            </div>
            
            {/* Select more users dropdown */}
            <div className="px-4 pt-4 pb-0">
              <div className="bg-white border border-[#dadce5] rounded-[3px] h-9 flex items-center justify-between pl-2 pr-2.5 py-[9px] w-full">
                <span className="text-[14.222px] font-normal leading-[1.5] text-[#9a9ca5] font-['Inter']">
                  Select more users
                </span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 14 14">
                  <path d="M3.5 5.25L7 8.75l3.5-3.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            {/* User list */}
            <div className="flex-1 overflow-y-auto">
              {[
                { 
                  name: "John Smith", 
                  roles: "5 roles across 6 apps",
                  email: "john.smith@company.com",
                  apps: [
                    { name: "Analytics", icon: "📊", roles: ["Viewer"] },
                    { name: "Reports", icon: "📈", roles: ["Viewer", "Guide creator", "Guide content editor"] },
                    { name: "Health Check", icon: "🏥", roles: ["Admin"] },
                    { name: "Feedback", icon: "💬", roles: ["Viewer", "Editor"] },
                    { name: "Session Replay", icon: "🎬", roles: ["User"] },
                    { name: "Roadmaps", icon: "🗺️", roles: ["Viewer", "Editor"] }
                  ]
                },
                { 
                  name: "Sarah Johnson", 
                  roles: "3 roles across 4 apps",
                  email: "sarah.johnson@company.com",
                  apps: [
                    { name: "Analytics", icon: "📊", roles: ["Editor"] },
                    { name: "Reports", icon: "📈", roles: ["Viewer"] },
                    { name: "Feedback", icon: "💬", roles: ["Admin"] },
                    { name: "Guides", icon: "📖", roles: ["Creator"] }
                  ]
                },
                { 
                  name: "Mike Chen", 
                  roles: "7 roles across 8 apps",
                  email: "mike.chen@company.com",
                  apps: [
                    { name: "Analytics", icon: "📊", roles: ["Admin"] },
                    { name: "Reports", icon: "📈", roles: ["Admin"] },
                    { name: "Health Check", icon: "🏥", roles: ["Viewer"] },
                    { name: "Feedback", icon: "💬", roles: ["Editor"] },
                    { name: "Session Replay", icon: "🎬", roles: ["User"] },
                    { name: "Roadmaps", icon: "🗺️", roles: ["Manager"] },
                    { name: "Guides", icon: "📖", roles: ["Publisher"] },
                    { name: "Segments", icon: "🎯", roles: ["Collaborator"] }
                  ]
                },
                { 
                  name: "Emily Davis", 
                  roles: "2 roles across 3 apps",
                  email: "emily.davis@company.com",
                  apps: [
                    { name: "Analytics", icon: "📊", roles: ["Viewer"] },
                    { name: "Reports", icon: "📈", roles: ["Viewer"] },
                    { name: "Feedback", icon: "💬", roles: ["Editor"] }
                  ]
                },
                { 
                  name: "David Wilson", 
                  roles: "4 roles across 5 apps",
                  email: "david.wilson@company.com",
                  apps: [
                    { name: "Analytics", icon: "📊", roles: ["Editor"] },
                    { name: "Health Check", icon: "🏥", roles: ["Viewer"] },
                    { name: "Session Replay", icon: "🎬", roles: ["User"] },
                    { name: "Roadmaps", icon: "🗺️", roles: ["Editor"] },
                    { name: "Guides", icon: "📖", roles: ["Creator"] }
                  ]
                }
              ].map((user, index) => (
                <div key={index} className="px-4 py-0">
                  <div className="bg-white border-b border-[#dadce5] py-4 w-full">
                    <div className="flex flex-col gap-1">
                      <div className="text-[14.222px] font-semibold leading-[1.5] text-[#2a2c35] font-['Inter']">
                        {user.name}
                      </div>
                      <div className="text-[12.642px] font-semibold leading-[1.5] font-['Inter']">
                        <span className="text-[#2a2c35]">User: </span>
                        <button 
                          onClick={() => handleUserClick({
                            name: user.name,
                            email: user.email,
                            pendoRoles: user.roles,
                            feedbackRoles: "Standard",
                            teams: "Engineering\nProduct",
                            lastLogin: "2024-01-15",
                            apps: user.apps
                          })}
                          className="text-[#128297] hover:text-[#0f6b7d] hover:underline"
                        >
                          {user.roles}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle column - contains replace permissions selection and permissions sections - Scrollable */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          {/* Empty state - show when no action is selected */}
          {!selectedAction && (
            <div className="flex-1 flex flex-col gap-2.5 items-center justify-center pb-5 pt-4 px-2.5 relative border border-dashed border-[#dadce5] rounded-[3px]">
              {/* Info icon */}
              <div className="overflow-clip relative shrink-0 size-6">
                <div className="absolute inset-[8.333%]">
                  <svg className="w-full h-full" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" stroke="#6a6c75" strokeWidth="1.5"/>
                    <path d="M10 7v6m0-8h.01" stroke="#6a6c75" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Text content */}
              <div className="text-center w-[300px]">
                <p className="block font-['Inter:Semi_Bold',_sans-serif] leading-[1.5] mb-0 text-[12.642px] text-[#6a6c75]">
                  No action selected
                </p>
                <p className="leading-[1.5] text-[12.642px] text-[#6a6c75]">
                  Use the dropdown under Permission changes to choose an action to get started
                </p>
              </div>
            </div>
          )}

          {/* Replace permissions selection card - only show for replace permissions action */}
          {selectedAction === 'replace-permissions' && (
          <div className="bg-white border border-[#dadce5] rounded-[3px] shadow-sm flex flex-col mb-4">

            {/* Header */}
            <div className="bg-white h-12 flex items-center justify-center relative border-b border-[#dadce5] rounded-t-[3px]">
              <div className="flex-1 flex items-center justify-start px-4">
                <h2 className="text-[18px] font-normal leading-[1.35] text-[#2a2c35] font-['Inter']">Choose how to set permissions</h2>
              </div>
            </div>

            {/* Content */}
            <div className="pb-6 pt-4 px-6 w-full">
              <div className="flex flex-row gap-4 items-center justify-start">
                {/* Set permissions manually option */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleReplaceOptionSelect('manual')}
                    className="w-[340px] h-full cursor-pointer"
                  >
                    <div className={`bg-white border ${replaceFromOption === 'manual' ? 'border-[#128297]' : 'border-[#dadce5]'} rounded-[3px] p-4 w-full h-full relative`}>
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center justify-between w-full h-6">
                          <div className="bg-[#ffe8d2] flex items-center justify-center p-1 rounded-[3px]">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                              <path d="M11.333 2.00016H4.66634C3.95967 2.00016 3.33301 2.59383 3.33301 3.3335V12.6668C3.33301 13.4065 3.95967 14.0002 4.66634 14.0002H11.333C12.0397 14.0002 12.6663 13.4065 12.6663 12.6668V3.3335C12.6663 2.59383 12.0397 2.00016 11.333 2.00016Z" stroke="#f97316" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10.6663 5.3335H5.33301" stroke="#f97316" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10.6663 8H5.33301" stroke="#f97316" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M6.66634 10.6665H5.33301" stroke="#f97316" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          {replaceFromOption === 'manual' && (
                            <div className="w-5 h-5">
                              <svg viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="10" fill="#128297"/>
                                <path d="M6.25 10L8.75 12.5L13.75 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <p className="text-[14.222px] font-semibold leading-[1.5] text-[#2a2c35] font-['Inter'] text-left">
                            Set permissions manually
                          </p>
                          <p className="text-[12.642px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter'] text-left">
                            Manually assign permissions for each application.
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Assign admin access option */}
                <div className="flex items-center">
                  <button
                    onClick={() => handleReplaceOptionSelect('admin')}
                    className="w-[340px] h-full cursor-pointer"
                  >
                    <div className={`bg-white border ${replaceFromOption === 'admin' ? 'border-[#128297]' : 'border-[#dadce5]'} rounded-[3px] p-4 w-full h-full relative`}>
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex items-center justify-between w-full h-6">
                          <div className="bg-[#dcdcf9] flex items-center justify-center p-1 rounded-[3px]">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                              <path d="M8 7.3335C9.10457 7.3335 10 6.43807 10 5.3335C10 4.22893 9.10457 3.3335 8 3.3335C6.89543 3.3335 6 4.22893 6 5.3335C6 6.43807 6.89543 7.3335 8 7.3335Z" stroke="#6366f1" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M4.66667 12.6668C4.66667 10.4577 6.45753 8.66683 8.66667 8.66683H9.33333C11.5425 8.66683 13.3333 10.4577 13.3333 12.6668V13.3335H4.66667V12.6668Z" stroke="#6366f1" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          {replaceFromOption === 'admin' && (
                            <div className="w-5 h-5">
                              <svg viewBox="0 0 20 20" fill="none">
                                <circle cx="10" cy="10" r="10" fill="#128297"/>
                                <path d="M6.25 10L8.75 12.5L13.75 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                          <p className="text-[14.222px] font-semibold leading-[1.5] text-[#2a2c35] font-['Inter'] text-left">
                            Assign admin access
                          </p>
                          <p className="text-[12.642px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter'] text-left">
                            Grant full access to all applications, including all settings and analytics.
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

                  {/* Middle section - Permissions */}
          {selectedAction && (selectedAction !== 'replace-permissions' || (selectedAction === 'replace-permissions' && replaceFromOption !== '')) && (
            <div className="flex-1 bg-white border border-[#dadce5] rounded shadow-sm flex flex-col min-h-0">

          {/* Header */}
          <div className="h-12 flex items-center justify-between px-4 border-b border-[#dadce5]">
            <h2 className="text-[18px] font-normal text-[#2a2c35] font-['Inter']">{getMiddleCardTitle()}</h2>
          </div>

          {/* Content */}
          <div className="flex-1 px-6 py-4 overflow-y-auto">
            {/* Subscription level permissions */}
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="text-[16px] font-semibold text-[#2a2c35] font-['Inter'] mb-1">Subscription level permissions</h3>
                <p className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter']">Set permissions for all subscription-level features.</p>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between pb-2">
                  <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">Assign roles by category</span>
                  <button className="flex items-center gap-1 text-[12.642px] font-semibold text-[#128297] font-['Inter']">
                    Compare role details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-3">
                  {/* Segments and reports */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-start gap-2.5 pt-0.5">
                      <div className="w-7 h-7 relative">
                        <svg className="w-6 h-6 text-[#2a2c35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 border-l border-[#dadce5] pl-5">
                      <div className="h-6 flex items-center mb-2">
                        <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">Segments and reports</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <div 
                          onClick={() => handlePermissionToggle('report-collaborator')}
                          className={`border-2 ${selectedPermissions['report-collaborator'] ? 'border-[#70cde7]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer hover:bg-gray-50`}
                        >
                          <div className={`w-3.5 h-3.5 ${selectedPermissions['report-collaborator'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                            {selectedPermissions['report-collaborator'] && (
                              <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Report collaborator</span>
                          <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                            <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div 
                          onClick={() => handlePermissionToggle('segment-collaborator')}
                          className={`border-2 ${selectedPermissions['segment-collaborator'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer hover:bg-gray-50`}
                        >
                          <div className={`w-3.5 h-3.5 ${selectedPermissions['segment-collaborator'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                            {selectedPermissions['segment-collaborator'] && (
                              <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Segment collaborator</span>
                          <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                            <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div 
                          onClick={() => handlePermissionToggle('segment-verifier')}
                          className={`border-2 ${selectedPermissions['segment-verifier'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer hover:bg-gray-50`}
                        >
                          <div className={`w-3.5 h-3.5 ${selectedPermissions['segment-verifier'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                            {selectedPermissions['segment-verifier'] && (
                              <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Segment verifier</span>
                          <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                            <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Listen */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-start gap-2.5 pt-0.5">
                      <div className="w-7 h-7 relative">
                        <svg className="w-6 h-6 text-[#2a2c35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 border-l border-[#dadce5] pl-5">
                      <div className="h-6 flex items-center mb-2">
                        <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">Listen</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <div className="border-2 border-[#5ab7cf] bg-white rounded-[3px] px-4 py-3 flex items-center gap-2 flex-1 min-w-0 opacity-60 cursor-not-allowed">
                          <div className="w-3.5 h-3.5 bg-[#dadce5] border border-[#dadce5] rounded-[1px] relative flex-shrink-0">
                            <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                              <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="text-[14.222px] font-normal text-[#6a6c75] font-['Inter'] flex-1">Viewer</span>
                          <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                            <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div 
                          onClick={() => handlePermissionToggle('listen-editor')}
                          className={`border-2 ${selectedPermissions['listen-editor'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer hover:bg-gray-50`}
                        >
                          <div className={`w-3.5 h-3.5 ${selectedPermissions['listen-editor'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                            {selectedPermissions['listen-editor'] && (
                              <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Editor</span>
                          <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                            <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div 
                          onClick={() => handlePermissionToggle('listen-manager')}
                          className={`border-2 ${selectedPermissions['listen-manager'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer hover:bg-gray-50`}
                        >
                          <div className={`w-3.5 h-3.5 ${selectedPermissions['listen-manager'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                            {selectedPermissions['listen-manager'] && (
                              <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Manager</span>
                          <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                            <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Roadmaps */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-start gap-2.5 pt-0.5">
                      <div className="w-7 h-7 relative">
                        <svg className="w-6 h-6 text-[#2a2c35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 border-l border-[#dadce5] pl-5">
                      <div className="h-6 flex items-center mb-2">
                        <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">Roadmaps</span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <div className="border-2 border-[#5ab7cf] bg-white rounded-[3px] px-4 py-3 flex items-center gap-2 flex-1 min-w-0 opacity-60 cursor-not-allowed">
                          <div className="w-3.5 h-3.5 bg-[#dadce5] border border-[#dadce5] rounded-[1px] relative flex-shrink-0">
                            <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                              <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="text-[14.222px] font-normal text-[#6a6c75] font-['Inter'] flex-1">Viewer</span>
                          <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                            <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div 
                          onClick={() => handlePermissionToggle('roadmaps-editor')}
                          className={`border-2 ${selectedPermissions['roadmaps-editor'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer hover:bg-gray-50`}
                        >
                          <div className={`w-3.5 h-3.5 ${selectedPermissions['roadmaps-editor'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                            {selectedPermissions['roadmaps-editor'] && (
                              <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Editor</span>
                          <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                            <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        </div>
                        <div 
                          onClick={() => handlePermissionToggle('roadmaps-manager')}
                          className={`border-2 ${selectedPermissions['roadmaps-manager'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer hover:bg-gray-50`}
                        >
                          <div className={`w-3.5 h-3.5 ${selectedPermissions['roadmaps-manager'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                            {selectedPermissions['roadmaps-manager'] && (
                              <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Manager</span>
                          <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                            <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* App level permissions */}
            <div>
              <div className="mb-4">
                <h3 className="text-[16px] font-semibold text-[#2a2c35] font-['Inter'] mb-1">App level permissions</h3>
                <p className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter']">Set permissions for all app-level features.</p>
              </div>

              <div className="flex gap-8 h-[526px]">
                {/* Select apps */}
                <div className="w-[300px] flex-shrink-0">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">Select apps</span>
                                             <div className="bg-white border border-[#dadce5] rounded-[3px] p-2">
                         <div className="flex items-center gap-2">
                           <svg className="w-4 h-4 text-[#2a2c35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                           </svg>
                           <input 
                             type="text" 
                             placeholder="Search ..." 
                             value={appSearchQuery}
                             onChange={(e) => setAppSearchQuery(e.target.value)}
                             className="flex-1 text-[14.222px] text-[#2a2c35] font-['Inter'] bg-transparent border-none outline-none placeholder:text-[#babcc5]"
                           />
                         </div>
                       </div>
                                             <div className="flex gap-2.5 text-[12.642px] font-semibold font-['Inter']">
                         <button 
                           onClick={handleSelectAllSelectableApps}
                           className="text-[#128297] cursor-pointer hover:text-[#0f6b7d]"
                         >
                           Select all
                         </button>
                         <button 
                           onClick={handleClearSelectableAppSelections}
                           className="text-[#128297] cursor-pointer hover:text-[#0f6b7d]"
                         >
                           Clear selections
                         </button>
                         <button 
                           onClick={handleUnassignSelectableApps}
                           className="text-[#cc0000] cursor-pointer hover:text-[#a60000]"
                         >
                           Unassign
                         </button>
                       </div>
                    </div>

                                         {/* App list */}
                     <div className="border border-[#dadce5] rounded-[3px] overflow-hidden">
                       {filteredSelectableApps.map((app) => (
                         <div key={app.id} className="border-b border-[#dadce5] border-dashed last:border-b-0">
                           <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50">
                             <button
                               onClick={() => handleSelectableAppToggle(app.id)}
                               className="w-3.5 h-3.5 rounded-[1px] relative flex-shrink-0"
                             >
                               {selectedAppIds.includes(app.id) ? (
                                 <div className="w-3.5 h-3.5 bg-[#128297] rounded-[1px] relative">
                                   <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                     <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                   </svg>
                                 </div>
                               ) : (
                                 <div className="w-3.5 h-3.5 bg-white border border-[#6a6c75] rounded-[1px]"></div>
                               )}
                             </button>
                             <div className="flex items-center gap-2">
                               <div className="w-4 h-4 bg-[#eaecf1] rounded-full p-1.5">
                                 <svg className="w-full h-full text-[#2a2c35]" fill="currentColor" viewBox="0 0 16 16">
                                   <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14.5c-3.59 0-6.5-2.91-6.5-6.5S4.41 1.5 8 1.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5z"/>
                                 </svg>
                               </div>
                               <div>
                                 <div className="text-[12.642px] font-semibold text-[#2a2c35] font-['Inter']">
                                   {app.name}
                                 </div>
                                 <div className="text-[12.642px] font-normal text-[#6a6c75] font-['Inter']">{app.role}</div>
                               </div>
                             </div>
                           </div>
                         </div>
                       ))}
                       {filteredSelectableApps.length === 0 && (
                         <div className="px-4 py-8 text-center text-[#6a6c75] text-[14.222px] font-['Inter']">
                           No apps found matching "{appSearchQuery}"
                         </div>
                       )}
                     </div>
                  </div>
                </div>

                                 {/* Assign roles by category */}
                 <div className={`flex-1 ${selectedAppIds.length === 0 ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">Assign roles by category</span>
                    <button className="flex items-center gap-1 text-[12.642px] font-semibold text-[#128297] font-['Inter']">
                      Compare role details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {/* App-wide */}
                    <div className="flex gap-4">
                      <div className="w-7 h-7 relative">
                        <svg className="w-6 h-6 text-[#2a2c35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3s-4.5 4.03-4.5 9 2.015 9 4.5 9z" />
                        </svg>
                      </div>
                      <div className="flex-1 border-l border-[#dadce5] pl-5">
                        <div className="h-6 flex items-center mb-2">
                          <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">App-wide</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="border-2 border-[#5ab7cf] bg-white rounded-[3px] px-4 py-3 flex items-center gap-2 w-[280px] opacity-60 cursor-not-allowed">
                            <div className="w-3.5 h-3.5 bg-[#dadce5] border border-[#dadce5] rounded-[1px] relative flex-shrink-0">
                              <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <span className="text-[14.222px] font-normal text-[#6a6c75] font-['Inter'] flex-1">Viewer</span>
                            <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                              <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                              <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div 
                            onClick={() => handlePermissionToggle('app-tagging-editor')}
                            className={`border-2 ${selectedPermissions['app-tagging-editor'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 w-[280px] cursor-pointer hover:bg-gray-50`}
                          >
                            <div className={`w-3.5 h-3.5 ${selectedPermissions['app-tagging-editor'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                              {selectedPermissions['app-tagging-editor'] && (
                                <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                  <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Tagging editor</span>
                            <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                              <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                              <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Guides */}
                    <div className="flex gap-4">
                      <div className="w-7 h-7 relative">
                        <svg className="w-6 h-6 text-[#2a2c35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="flex-1 border-l border-[#dadce5] pl-5">
                        <div className="h-6 flex items-center mb-2">
                          <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">Guides</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <div 
                            onClick={() => handlePermissionToggle('guides-creator')}
                            className={`border-2 ${selectedPermissions['guides-creator'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 w-[280px] cursor-pointer hover:bg-gray-50`}
                          >
                            <div className={`w-3.5 h-3.5 ${selectedPermissions['guides-creator'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                              {selectedPermissions['guides-creator'] && (
                                <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                  <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Creator</span>
                            <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                              <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                              <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div 
                            onClick={() => handlePermissionToggle('guides-publisher')}
                            className={`border-2 ${selectedPermissions['guides-publisher'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 w-[280px] cursor-pointer hover:bg-gray-50`}
                          >
                            <div className={`w-3.5 h-3.5 ${selectedPermissions['guides-publisher'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                              {selectedPermissions['guides-publisher'] && (
                                <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                  <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Publisher</span>
                            <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                              <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                              <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div 
                            onClick={() => handlePermissionToggle('guides-content-editor')}
                            className={`border-2 ${selectedPermissions['guides-content-editor'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 w-[280px] cursor-pointer hover:bg-gray-50`}
                          >
                            <div className={`w-3.5 h-3.5 ${selectedPermissions['guides-content-editor'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                              {selectedPermissions['guides-content-editor'] && (
                                <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                  <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Content editor</span>
                            <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                              <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                              <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div 
                            onClick={() => handlePermissionToggle('guides-rc-author')}
                            className={`border-2 ${selectedPermissions['guides-rc-author'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 w-[280px] cursor-pointer hover:bg-gray-50`}
                          >
                            <div className={`w-3.5 h-3.5 ${selectedPermissions['guides-rc-author'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                              {selectedPermissions['guides-rc-author'] && (
                                <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                  <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Resource Center author</span>
                            <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                              <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                              <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div 
                            onClick={() => handlePermissionToggle('guides-rc-publisher')}
                            className={`border-2 ${selectedPermissions['guides-rc-publisher'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 w-[280px] cursor-pointer hover:bg-gray-50`}
                          >
                            <div className={`w-3.5 h-3.5 ${selectedPermissions['guides-rc-publisher'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                              {selectedPermissions['guides-rc-publisher'] && (
                                <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                  <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">Resource Center publisher</span>
                            <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                              <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                              <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Session Replay */}
                    <div className="flex gap-4">
                      <div className="w-7 h-7 relative">
                        <svg className="w-6 h-6 text-[#2a2c35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
                        </svg>
                      </div>
                      <div className="flex-1 border-l border-[#dadce5] pl-5">
                        <div className="h-6 flex items-center mb-2">
                          <span className="text-[14.222px] font-semibold text-[#2a2c35] font-['Inter']">Session Replay</span>
                        </div>
                        <div className="flex gap-2">
                          <div 
                            onClick={() => handlePermissionToggle('session-replay-user')}
                            className={`border-2 ${selectedPermissions['session-replay-user'] ? 'border-[#128297]' : 'border-[#dadce5]'} bg-white rounded-[3px] px-4 py-3 flex items-center gap-2.5 w-[280px] cursor-pointer hover:bg-gray-50`}
                          >
                            <div className={`w-3.5 h-3.5 ${selectedPermissions['session-replay-user'] ? 'bg-[#128297]' : 'bg-white border border-[#6a6c75]'} rounded-[1px] relative flex-shrink-0`}>
                              {selectedPermissions['session-replay-user'] && (
                                <svg className="w-3 h-3 absolute top-[0.875px] left-[0.875px]" viewBox="0 0 12 12">
                                  <path d="M9.5 3.5L5 8l-2.5-2.5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                            <span className="text-[14.222px] font-normal text-[#2a2c35] font-['Inter'] flex-1">User</span>
                            <svg className="w-4 h-4 text-[#2a2c35] flex-shrink-0" fill="currentColor" viewBox="0 0 16 16">
                              <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1"/>
                              <circle cx="8" cy="5.5" r="0.5" fill="currentColor"/>
                              <path d="M8 7v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
        </div>

        {/* Right panel – Summary of changes OR User details blade - Sticky */}
        {(hasActualSelections && !isBladeOpen) && (
          <div className="w-[320px] flex-shrink-0 flex flex-col sticky top-4 self-start h-[calc(100vh-96px)]">
            <div className="bg-white border border-gray-200 rounded shadow-sm h-full flex flex-col">
              <div className="border-b border-gray-200 px-4 py-3 flex-shrink-0">
                <h3 className="text-base font-medium text-gray-900">Summary of changes</h3>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                <div className="space-y-3">
                  {affectedUsers.map((user, index) => {
                    // Check if user is Subscription Admin (no changes for them)
                    const isSubscriptionAdmin = user.pendoRoles === 'Subscription Admin';
                    
                    if (isSubscriptionAdmin) {
                      return (
                        <div key={user.name} className="pb-4 border-b border-gray-200 text-sm">
                          <div className="font-bold text-gray-900 mb-1">{user.name}</div>
                          <div className="space-y-1">
                            <div className="text-gray-400">{user.pendoRoles}</div>
                            <div className="text-gray-900">{user.pendoRoles}</div>
                            <div className="text-gray-400 text-xs italic">No change</div>
                          </div>
                        </div>
                      );
                    }

                    // Panel only shows when we have both action and roles, so no need to check again

                    // Parse current role count from user data
                    const roleMatch = user.pendoRoles.match(/(\d+)\s+roles?\s+across\s+(\d+)\s+apps?/);
                    let currentRoles = roleMatch ? parseInt(roleMatch[1]) : 0;
                    let currentApps = roleMatch ? parseInt(roleMatch[2]) : 0;
                    
                    // Calculate new totals based on action
                    let newRoles = currentRoles;
                    let newApps = currentApps;
                    
                    // Count selected permissions (excluding disabled ones)
                    const selectedPermissionCount = Object.entries(selectedPermissions).filter(([key, value]) => {
                      const disabledPermissions = ['listen-viewer', 'roadmaps-viewer', 'app-viewer'];
                      return value && !disabledPermissions.includes(key);
                    }).length;
                    
                    const totalNewRoles = subscriptionRoles.length + appRoles.length + selectedPermissionCount;
                    
                    if (selectedAction === 'add-roles') {
                      newRoles = currentRoles + totalNewRoles;
                      if (appRoles.length > 0 && totalNewRoles > 0) newApps = currentApps + 1;
                    } else if (selectedAction === 'remove-roles') {
                      newRoles = Math.max(0, currentRoles - totalNewRoles);
                      if (totalNewRoles > 0 && newRoles === 0) newApps = Math.max(0, currentApps - 1);
                    } else if (selectedAction === 'add-apps') {
                      newRoles = currentRoles + totalNewRoles;
                      newApps = currentApps + 1;
                    } else if (selectedAction === 'remove-apps') {
                      newRoles = Math.max(0, currentRoles - totalNewRoles);
                      newApps = Math.max(0, currentApps - 1);
                    }
                    
                    // Format text exactly like Figma design
                    const currentText = roleMatch ? 
                      `User: ${currentRoles} role${currentRoles !== 1 ? 's' : ''} across ${currentApps} app${currentApps !== 1 ? 's' : ''}` :
                      user.pendoRoles;
                    
                    const newText = `User: ${newRoles} role${newRoles !== 1 ? 's' : ''} across ${newApps} app${newApps !== 1 ? 's' : ''}`;
                    
                    return (
                      <div key={user.name} className="pb-4 border-b border-gray-200 text-sm">
                        <div className="font-bold text-gray-900 mb-1">{user.name}</div>
                        <div className="space-y-1">
                          <div className="text-gray-400">{currentText}</div>
                          <div className="text-gray-900">{newText}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Details Blade - Sticky */}
        {selectedUser && (
          <div className={`w-[320px] flex-shrink-0 flex flex-col transition-transform duration-300 ease-in-out sticky top-4 self-start h-[calc(100vh-96px)] ${
            isBladeOpen ? 'transform translate-x-0' : 'transform translate-x-full'
          }`}>
            <div className="bg-white border border-gray-200 rounded shadow-sm h-full flex flex-col">
              <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center flex-shrink-0">
                <h3 className="text-base font-medium text-gray-900">User info</h3>
                <button
                  onClick={handleCloseBlade}
                  className="text-gray-400 hover:text-gray-600 text-lg leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-4 overflow-y-auto flex-1">
                {/* User name and email */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{selectedUser.name}</h2>
                  <div className="text-gray-600 text-sm">{selectedUser.email}</div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button className="pb-2 pr-6 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
                    Roles ({selectedUser.apps?.reduce((total, app) => total + app.roles.length, 0) || 0})
                  </button>
                  <button className="pb-2 text-sm font-medium text-gray-500">
                    Teams (3)
                  </button>
                </div>

                {/* Listen roles */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Listen roles</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-700">Viewer</div>
                    <div className="text-sm text-gray-700">Contributor</div>
                  </div>
                </div>

                {/* App-level roles */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">App-level roles ({selectedUser.apps?.length || 0})</h4>
                  <div className="space-y-3">
                    {selectedUser.apps?.map((app, index) => (
                      <div key={index} className="border border-gray-200 rounded p-3 flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 text-lg">
                          {app.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{app.name}</div>
                          <div className="text-sm text-gray-600">{app.roles.join(', ')}</div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-sm text-gray-500 italic">No apps assigned</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-end gap-3 bg-white px-6 py-4 border-t border-gray-200 z-50">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FullScreenModalV2; 