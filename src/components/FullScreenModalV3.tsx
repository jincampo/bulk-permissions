import React, { useState, useEffect, useRef } from 'react';

// SVG Icons as components for better maintainability
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  disabled = false
}) => {
  const baseClasses = "px-3 py-2 rounded-[3px] text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-[#128297] text-white hover:bg-[#0f6b7d] focus:ring-[#128297] disabled:bg-gray-300 disabled:text-gray-500",
    secondary: "bg-white text-[#128297] border border-[#128297] hover:bg-[#f0f9fa] focus:ring-[#128297] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {children}
    </button>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsersCount?: number;
}

const FullScreenModalV3: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedUsersCount = 6 
}) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [subscriptionRoles, setSubscriptionRoles] = useState<string[]>([]);
  const [appRoles, setAppRoles] = useState<string[]>([]);
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  
  // Dropdown states
  const [isSubscriptionDropdownOpen, setIsSubscriptionDropdownOpen] = useState(false);
  const [subscriptionSearchTerm, setSubscriptionSearchTerm] = useState('');
  const subscriptionDropdownRef = useRef<HTMLDivElement>(null);
  const [isAppRolesDropdownOpen, setIsAppRolesDropdownOpen] = useState(false);
  const [appRolesSearchTerm, setAppRolesSearchTerm] = useState('');
  const appRolesDropdownRef = useRef<HTMLDivElement>(null);
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false);
  const [appsSearchTerm, setAppsSearchTerm] = useState('');
  const appsDropdownRef = useRef<HTMLDivElement>(null);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Data for dropdowns
  const subscriptionRoleOptions = [
    { category: 'SEGMENTS AND REPORTS', roles: ['Report collaborator', 'Segment collaborator', 'Segment verifier'] },
    { category: 'LISTEN', roles: ['Viewer', 'Editor', 'Manager'] },
    { category: 'ROADMAPS', roles: ['Viewer', 'Editor', 'Manager'] }
  ];

  const appRoleOptions = [
    { category: 'APP WIDE', roles: ['Viewer', 'Tagging editor'] },
    { category: 'GUIDES', roles: ['Creator', 'Publisher', 'Content editor', 'Resource center author', 'Resource center publisher'] },
    { category: 'SESSION REPLAY', roles: ['User'] }
  ];

  const appOptions = [
    { name: 'Application 1', value: 'app1' },
    { name: 'Application 2', value: 'app2' },
    { name: 'Application 3', value: 'app3' }
  ];

  // Affected users data
  const affectedUsers = [
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

  // Filtered options based on search
  const filteredSubscriptionRoles = subscriptionRoleOptions.map(category => ({
    ...category,
    roles: category.roles.filter(role => 
      role.toLowerCase().includes(subscriptionSearchTerm.toLowerCase())
    )
  })).filter(category => category.roles.length > 0);

  const filteredAppRoles = appRoleOptions.map(category => ({
    ...category,
    roles: category.roles.filter(role => 
      role.toLowerCase().includes(appRolesSearchTerm.toLowerCase())
    )
  })).filter(category => category.roles.length > 0);

  const filteredApps = appOptions.filter(app => 
    app.name.toLowerCase().includes(appsSearchTerm.toLowerCase())
  );

  // Event handlers
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

  const resetForm = () => {
    setSelectedAction('');
    setSubscriptionRoles([]);
    setAppRoles([]);
    setSelectedApps([]);
    setHasChanges(false);
    setShowSummary(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving changes:', {
      selectedAction,
      subscriptionRoles,
      appRoles,
      selectedApps: appRoles.length > 0 ? selectedApps : []
    });
    resetForm();
    onClose();
  };

  // Check if there are actual meaningful selections to enable save
  const hasActualSelections = selectedAction && (subscriptionRoles.length > 0 || appRoles.length > 0 || selectedApps.length > 0);
  // Also check that if app roles are selected, apps must be selected too
  const appRolesRequireApps = appRoles.length > 0 && selectedApps.length === 0;
  const canSave = hasActualSelections && !appRolesRequireApps;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded border border-[#eaecf1] w-full max-w-5xl mx-4 h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dadce5] flex-shrink-0">
          <h2 className="text-[22.78px] font-semibold text-[#2a2c35] leading-[1.3]">
            Change permissions? (Full Screen V3)
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-[#6a6c75] hover:text-[#2a2c35] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden">
          {!showSummary ? (
            <div className="flex h-full">
              {/* Left Panel - Form */}
              <div className="w-1/2 p-6 border-r border-[#dadce5] overflow-y-auto">
                <div className="space-y-6">
                  <p className="text-sm text-[#2a2c35]">
                    Update roles or apps for the{' '}
                    <span className="font-bold">{selectedUsersCount} selected users</span>.
                  </p>

                  {/* What would you like to do */}
                  <div>
                    <label className="block text-sm font-bold text-[#2a2c35] mb-3">
                      What would you like to do? <span className="text-red-500">*</span>
                    </label>
                    <select 
                      value={selectedAction}
                      onChange={(e) => handleActionChange(e.target.value)}
                      className={`w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${selectedAction ? 'text-gray-900' : 'text-gray-500'}`}
                    >
                      <option value="">Select your changes</option>
                      <option value="add-roles">Add roles</option>
                      <option value="remove-roles">Remove roles</option>
                      <option value="add-apps">Add apps</option>
                      <option value="remove-apps">Remove apps</option>
                    </select>
                  </div>

                  {/* Show different fields based on action */}
                  {selectedAction && (
                    <>
                      {selectedAction === 'add-apps' || selectedAction === 'remove-apps' ? (
                        // No label for add/remove apps
                        null
                      ) : (
                        <label className="block text-sm font-medium text-[#2a2c35] mb-4">
                          Select at least one of the following: <span className="text-red-500">*</span>
                        </label>
                      )}
                      
                      {selectedAction === 'add-apps' ? (
                        <>
                          {/* Apps (shown first for Add apps) */}
                          <div className="mb-5 relative">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Apps <span className="text-red-500">*</span>
                            </label>
                            <div className="relative" ref={appsDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setIsAppsDropdownOpen(!isAppsDropdownOpen)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-start min-h-[40px]"
                              >
                                <div className="flex-1 min-w-0">
                                  {selectedApps.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {selectedApps.map((app) => (
                                        <span
                                          key={app}
                                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                                        >
                                          {appOptions.find(opt => opt.value === app)?.name || app}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAppToggle(app);
                                            }}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Select apps</span>
                                  )}
                                </div>
                                <svg className="w-4 h-4 text-gray-400 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {isAppsDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                  {/* Search input */}
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Search..."
                                        value={appsSearchTerm}
                                        onChange={(e) => setAppsSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* App options */}
                                  <div className="max-h-64 overflow-y-auto">
                                    <div className="p-3">
                                      {filteredApps.map((app) => (
                                        <label key={app.value} className="flex items-center py-1 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={selectedApps.includes(app.value)}
                                            onChange={() => handleAppToggle(app.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                          />
                                          <span className="ml-2 text-sm text-gray-700">{app.name}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* App level roles (shown second for Add apps) */}
                          <div className="mb-5 relative">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              App level roles <span className="text-red-500">*</span>
                            </label>
                            <div className="relative" ref={appRolesDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setIsAppRolesDropdownOpen(!isAppRolesDropdownOpen)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-start min-h-[40px]"
                              >
                                <div className="flex-1 min-w-0">
                                  {appRoles.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {appRoles.map((role) => (
                                        <span
                                          key={role}
                                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                                        >
                                          {role}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAppRoleToggle(role);
                                            }}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Select one or more roles</span>
                                  )}
                                </div>
                                <svg className="w-4 h-4 text-gray-400 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {isAppRolesDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                  {/* Search input */}
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Search..."
                                        value={appRolesSearchTerm}
                                        onChange={(e) => setAppRolesSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Role categories */}
                                  <div className="max-h-64 overflow-y-auto">
                                    {filteredAppRoles.map((category) => (
                                      <div key={category.category} className="p-3">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                          {category.category}
                                        </div>
                                        {category.roles.map((role) => (
                                          <label key={role} className="flex items-center py-1 cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={appRoles.includes(role)}
                                              onChange={() => handleAppRoleToggle(role)}
                                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{role}</span>
                                          </label>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : selectedAction === 'remove-apps' ? (
                        <>
                          {/* Only Apps dropdown for Remove apps */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Apps <span className="text-red-500">*</span>
                            </label>
                            <select 
                              value={selectedApps[0] || ''}
                              onChange={(e) => {
                                setSelectedApps(e.target.value ? [e.target.value] : []);
                                if (e.target.value && !hasChanges) {
                                  setHasChanges(true);
                                }
                              }}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select apps to remove</option>
                              <option value="app1">Application 1</option>
                              <option value="app2">Application 2</option>
                              <option value="app3">Application 3</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Subscription level roles */}
                          <div className="mb-5 relative">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Subscription level roles
                            </label>
                            <div className="relative" ref={subscriptionDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setIsSubscriptionDropdownOpen(!isSubscriptionDropdownOpen)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-start min-h-[40px]"
                              >
                                <div className="flex-1 min-w-0">
                                  {subscriptionRoles.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {subscriptionRoles.map((role) => (
                                        <span
                                          key={role}
                                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                                        >
                                          {role}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSubscriptionRoleToggle(role);
                                            }}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Select one or more roles</span>
                                  )}
                                </div>
                                <svg className="w-4 h-4 text-gray-400 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {isSubscriptionDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                  {/* Search input */}
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Search..."
                                        value={subscriptionSearchTerm}
                                        onChange={(e) => setSubscriptionSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Role categories */}
                                  <div className="max-h-64 overflow-y-auto">
                                    {filteredSubscriptionRoles.map((category) => (
                                      <div key={category.category} className="p-3">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                          {category.category}
                                        </div>
                                        {category.roles.map((role) => (
                                          <label key={role} className="flex items-center py-1 cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={subscriptionRoles.includes(role)}
                                              onChange={() => handleSubscriptionRoleToggle(role)}
                                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{role}</span>
                                          </label>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* App level roles */}
                          <div className="mb-5 relative">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              App level roles
                            </label>
                            <div className="relative" ref={appRolesDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setIsAppRolesDropdownOpen(!isAppRolesDropdownOpen)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-start min-h-[40px]"
                              >
                                <div className="flex-1 min-w-0">
                                  {appRoles.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {appRoles.map((role) => (
                                        <span
                                          key={role}
                                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                                        >
                                          {role}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAppRoleToggle(role);
                                            }}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Select one or more roles</span>
                                  )}
                                </div>
                                <svg className="w-4 h-4 text-gray-400 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {isAppRolesDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                  {/* Search input */}
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Search..."
                                        value={appRolesSearchTerm}
                                        onChange={(e) => setAppRolesSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* Role categories */}
                                  <div className="max-h-64 overflow-y-auto">
                                    {filteredAppRoles.map((category) => (
                                      <div key={category.category} className="p-3">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                          {category.category}
                                        </div>
                                        {category.roles.map((role) => (
                                          <label key={role} className="flex items-center py-1 cursor-pointer">
                                            <input
                                              type="checkbox"
                                              checked={appRoles.includes(role)}
                                              onChange={() => handleAppRoleToggle(role)}
                                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{role}</span>
                                          </label>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Apps to apply */}
                          <div className="mb-5 relative">
                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                              Select apps {appRoles.length > 0 && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative" ref={appsDropdownRef}>
                              <button
                                type="button"
                                onClick={() => setIsAppsDropdownOpen(!isAppsDropdownOpen)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-start min-h-[40px]"
                              >
                                <div className="flex-1 min-w-0">
                                  {selectedApps.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {selectedApps.map((app) => (
                                        <span
                                          key={app}
                                          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                                        >
                                          {appOptions.find(opt => opt.value === app)?.name || app}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAppToggle(app);
                                            }}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                          >
                                            ×
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-gray-500">Select apps to apply roles to</span>
                                  )}
                                </div>
                                <svg className="w-4 h-4 text-gray-400 mt-1 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              
                              {isAppsDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                  {/* Search input */}
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                      </div>
                                      <input
                                        type="text"
                                        placeholder="Search..."
                                        value={appsSearchTerm}
                                        onChange={(e) => setAppsSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      />
                                    </div>
                                  </div>
                                  
                                  {/* App options */}
                                  <div className="max-h-64 overflow-y-auto">
                                    <div className="p-3">
                                      {filteredApps.map((app) => (
                                        <label key={app.value} className="flex items-center py-1 cursor-pointer">
                                          <input
                                            type="checkbox"
                                            checked={selectedApps.includes(app.value)}
                                            onChange={() => handleAppToggle(app.value)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                          />
                                          <span className="ml-2 text-sm text-gray-700">{app.name}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Alert banner for removing Viewer role */}
                      {selectedAction === 'remove-roles' && appRoles.includes('Viewer') && (
                        <div className="mt-6 bg-[#fffdfa] border border-[#dba211] border-l-[8px] rounded-sm p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <svg className="w-6 h-6 text-[#dba211]" fill="currentColor" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10"/>
                                <path d="M11 7h2v6h-2zm0 8h2v2h-2z" fill="white"/>
                              </svg>
                            </div>
                            <div className="text-[#2a2c35] text-sm leading-[1.5]">
                              Removing <span className="font-bold">Viewer</span> role removes app access
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="w-1/2 p-6 bg-gray-50 overflow-y-auto">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  
                  {hasActualSelections ? (
                    <>
                      <div className="bg-white rounded-md p-4 border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Changes Summary</h4>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div className="font-medium">{selectedAction === 'add-roles' ? 'Add roles' : selectedAction === 'remove-roles' ? 'Remove roles' : selectedAction === 'add-apps' ? 'Add apps' : 'Remove apps'}</div>
                          {subscriptionRoles.length > 0 && (
                            <div>
                              <span className="font-medium">Subscription roles:</span> {subscriptionRoles.join(', ')}
                            </div>
                          )}
                          {appRoles.length > 0 && (
                            <div>
                              <span className="font-medium">App roles:</span> {appRoles.join(', ')}
                            </div>
                          )}
                          {selectedApps.length > 0 && (
                            <div>
                              <span className="font-medium">Apps:</span> {selectedApps.map(appId => appOptions.find(app => app.value === appId)?.name || appId).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-white rounded-md p-4 border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Affected Users Preview</h4>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {affectedUsers.slice(0, selectedUsersCount).map((user) => {
                            // Check if user is Subscription Admin (no changes for them)
                            const isSubscriptionAdmin = user.pendoRoles === 'Subscription Admin';
                            
                            if (isSubscriptionAdmin) {
                              return (
                                <div key={user.name} className="pb-3 border-b border-gray-200 text-sm">
                                  <div className="font-medium text-gray-900 mb-1">{user.name}</div>
                                  <div className="space-y-1">
                                    <div className="text-gray-400">{user.pendoRoles}</div>
                                    <div className="text-gray-900">{user.pendoRoles}</div>
                                    <div className="text-gray-400 text-xs italic">No change</div>
                                  </div>
                                </div>
                              );
                            }

                            // Calculate role changes
                            const roleMatch = user.pendoRoles.match(/(\d+)\s+roles?\s+across\s+(\d+)\s+apps?/);
                            let currentRoles = roleMatch ? parseInt(roleMatch[1]) : 0;
                            let currentApps = roleMatch ? parseInt(roleMatch[2]) : 0;
                            
                            let newRoles = currentRoles;
                            let newApps = currentApps;
                            
                            const totalNewRoles = subscriptionRoles.length + appRoles.length;
                            
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
                            
                            const currentText = roleMatch ? 
                              `User: ${currentRoles} role${currentRoles !== 1 ? 's' : ''} across ${currentApps} app${currentApps !== 1 ? 's' : ''}` :
                              user.pendoRoles;
                            
                            const newText = `User: ${newRoles} role${newRoles !== 1 ? 's' : ''} across ${newApps} app${newApps !== 1 ? 's' : ''}`;
                            
                            return (
                              <div key={user.name} className="pb-3 border-b border-gray-200 text-sm">
                                <div className="font-medium text-gray-900 mb-1">{user.name}</div>
                                <div className="space-y-1">
                                  <div className="text-gray-400">{currentText}</div>
                                  <div className="text-green-600">{newText}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white rounded-md p-4 border border-gray-200 text-center text-gray-500">
                      Make your selections to see a preview of the changes
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Summary View */
            <div className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium text-gray-900 mb-4">Summary of changes</h3>
                  <p className="text-sm text-[#2a2c35] mb-4">
                    Review the changes that will be applied to{' '}
                    <span className="font-bold">{selectedUsersCount} selected users</span>.
                  </p>
                </div>
                
                {/* Changes Summary */}
                <div className="bg-gray-50 rounded-md p-4 space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Changes to apply:</div>
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">{selectedAction === 'add-roles' ? 'Add roles' : selectedAction === 'remove-roles' ? 'Remove roles' : selectedAction === 'add-apps' ? 'Add apps' : 'Remove apps'}</div>
                      {subscriptionRoles.length > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">Subscription roles:</span> {subscriptionRoles.join(', ')}
                        </div>
                      )}
                      {appRoles.length > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">App roles:</span> {appRoles.join(', ')}
                        </div>
                      )}
                      {selectedApps.length > 0 && (
                        <div className="mt-1">
                          <span className="font-medium">Apps:</span> {selectedApps.map(appId => appOptions.find(app => app.value === appId)?.name || appId).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Affected Users */}
                <div>
                  <div className="text-sm font-medium text-gray-900 mb-3">Affected users:</div>
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {affectedUsers.slice(0, selectedUsersCount).map((user) => {
                      // Check if user is Subscription Admin (no changes for them)
                      const isSubscriptionAdmin = user.pendoRoles === 'Subscription Admin';
                      
                      if (isSubscriptionAdmin) {
                        return (
                          <div key={user.name} className="pb-3 border-b border-gray-200 text-sm">
                            <div className="font-medium text-gray-900 mb-1">{user.name}</div>
                            <div className="space-y-1">
                              <div className="text-gray-400">{user.pendoRoles}</div>
                              <div className="text-gray-900">{user.pendoRoles}</div>
                              <div className="text-gray-400 text-xs italic">No change</div>
                            </div>
                          </div>
                        );
                      }

                      // Calculate role changes
                      const roleMatch = user.pendoRoles.match(/(\d+)\s+roles?\s+across\s+(\d+)\s+apps?/);
                      let currentRoles = roleMatch ? parseInt(roleMatch[1]) : 0;
                      let currentApps = roleMatch ? parseInt(roleMatch[2]) : 0;
                      
                      let newRoles = currentRoles;
                      let newApps = currentApps;
                      
                      const totalNewRoles = subscriptionRoles.length + appRoles.length;
                      
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
                      
                      const currentText = roleMatch ? 
                        `User: ${currentRoles} role${currentRoles !== 1 ? 's' : ''} across ${currentApps} app${currentApps !== 1 ? 's' : ''}` :
                        user.pendoRoles;
                      
                      const newText = `User: ${newRoles} role${newRoles !== 1 ? 's' : ''} across ${newApps} app${newApps !== 1 ? 's' : ''}`;
                      
                      return (
                        <div key={user.name} className="pb-3 border-b border-gray-200 text-sm">
                          <div className="font-medium text-gray-900 mb-1">{user.name}</div>
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
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#dadce5] flex-shrink-0">
          <button
            onClick={handleClose}
            className="text-[#128297] hover:text-[#0f6b7d] hover:underline text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {!showSummary ? (
              <Button variant="secondary" onClick={() => setShowSummary(true)} disabled={!canSave}>
                Review summary
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setShowSummary(false)}>
                Back
              </Button>
            )}
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={!canSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenModalV3;