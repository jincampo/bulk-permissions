import React, { useState, useEffect, useRef } from 'react';

interface FullScreenModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  selectedUsersCount: number;
}

// SVG Icons for better maintainability
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18M6 6l12 12" stroke="#9a9ca5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Team Icons matching Figma design
const PuzzleIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 2.5V3.5C8.5 4.05 8.95 4.5 9.5 4.5H10.5V8.5C10.5 9.05 10.05 9.5 9.5 9.5H3.5C2.95 9.5 2.5 9.05 2.5 8.5V7.5C2.5 6.95 2.05 6.5 1.5 6.5H0.5V2.5C0.5 1.95 0.95 1.5 1.5 1.5H7.5C8.05 1.5 8.5 1.95 8.5 2.5Z" stroke={color} strokeWidth="1" fill="none"/>
  </svg>
);

const ChartLineIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 11L4 8L7 9L11 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="1" cy="11" r="0.5" fill={color}/>
    <circle cx="4" cy="8" r="0.5" fill={color}/>
    <circle cx="7" cy="9" r="0.5" fill={color}/>
    <circle cx="11" cy="5" r="0.5" fill={color}/>
  </svg>
);

const BarChartIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="8" width="2" height="3" fill={color}/>
    <rect x="5" y="5" width="2" height="6" fill={color}/>
    <rect x="8" y="2" width="2" height="9" fill={color}/>
  </svg>
);

// Dropdown Component matching Figma design
interface DropdownProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  options?: { value: string; label: string; description?: string }[];
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  options = [],
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-1">
        <label className="text-[14.222px] font-semibold leading-[1.5] text-[#2a2c35] font-['Inter']">
          {label}
        </label>
        {required && <span className="text-[#cc0000] font-bold">*</span>}
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`bg-white border border-[#dadce5] rounded-[3px] h-9 flex items-center justify-between pl-2 pr-2.5 py-[9px] w-full transition-colors ${
            disabled 
              ? 'bg-gray-50 text-gray-400 cursor-not-allowed' 
              : 'hover:border-[#128297] cursor-pointer'
          }`}
        >
          <span className={`text-[14.222px] font-normal leading-[1.5] font-['Inter'] ${
            value ? 'text-[#2a2c35]' : 'text-[#9a9ca5]'
          }`}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDownIcon />
        </button>
        
        {isOpen && !disabled && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#dadce5] rounded-[3px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.17)] z-50 max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex flex-col items-start"
              >
                <div className="text-[14.222px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter']">
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-[12.642px] font-normal leading-[1.5] text-[#6a6c75] font-['Inter'] mt-0.5">
                    {option.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// User Info Panel Component
interface UserInfoProps {
  user: typeof affectedUsers[0];
  onClose: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'teams'>('roles');

  // Mock app-level roles data
  const appLevelRoles = [
    {
      appName: 'App name',
      roles: 'Viewer',
      icon: '📊',
      color: '#fff5f5'
    },
    {
      appName: 'App name',
      roles: 'Viewer, Guide creator, Guide content editor',
      icon: '📈',
      color: '#e2f0ff'
    },
    {
      appName: 'App name',
      roles: 'Admin',
      icon: '🏥',
      color: '#fff0fe'
    }
  ];

  return (
    <div className="w-[336px] flex-shrink-0">
      <div className="bg-white rounded-[3px] border border-[#dadce5] h-[680px] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-[13px] border-b border-[#dadce5] flex items-center justify-between">
          <h2 className="text-[18px] font-normal leading-[1.2] text-black font-['Inter']">
            User info
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[#9a9ca5] hover:text-[#2a2c35] transition-colors size-6"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(680px-61px)]">
          {/* User Name */}
          <div className="mb-2">
            <h3 className="text-[18px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
              {user.name}
            </h3>
          </div>

          {/* User Email */}
          <div className="mb-6">
            <div className="text-[14px] font-normal leading-[1.2] text-[#6a6c75] font-['Inter']">
              {user.email}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 border-b border-[#dadce5]">
            <button
              onClick={() => setActiveTab('roles')}
              className={`pb-2 px-0 mr-6 text-[14px] font-normal leading-[1.2] font-['Inter'] border-b-2 transition-colors ${
                activeTab === 'roles'
                  ? 'border-[#2a2c35] text-[#2a2c35] font-semibold'
                  : 'border-transparent text-[#6a6c75] hover:text-[#2a2c35]'
              }`}
            >
              Roles (5)
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`pb-2 px-0 text-[14px] font-normal leading-[1.2] font-['Inter'] border-b-2 transition-colors ${
                activeTab === 'teams'
                  ? 'border-[#2a2c35] text-[#2a2c35] font-semibold'
                  : 'border-transparent text-[#6a6c75] hover:text-[#2a2c35]'
              }`}
            >
              Teams (3)
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              {/* Listen roles */}
              <div>
                <h4 className="text-[16px] font-normal leading-[1.2] text-[#2a2c35] font-['Inter'] mb-3">
                  Listen roles
                </h4>
                <div className="space-y-2">
                  <div className="text-[14px] font-normal leading-[1.2] text-[#2a2c35] font-['Inter']">
                    Viewer
                  </div>
                  <div className="text-[14px] font-normal leading-[1.2] text-[#2a2c35] font-['Inter']">
                    Contributor
                  </div>
                </div>
              </div>

              {/* App-level roles */}
              <div>
                <h4 className="text-[16px] font-normal leading-[1.2] text-[#2a2c35] font-['Inter'] mb-3">
                  App-level roles
                </h4>
                <div className="space-y-3">
                  {appLevelRoles.map((app, index) => (
                    <div key={index} className="border border-[#dadce5] rounded-[3px] p-3">
                      <div className="flex items-start gap-3">
                        <div className="text-[20px] mt-0.5">
                          {app.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter'] mb-1">
                            {app.appName}
                          </div>
                          <div className="text-[14px] font-normal leading-[1.2] text-[#6a6c75] font-['Inter']">
                            {app.roles}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'teams' && (
            <div>
              <div className="text-[14px] font-normal leading-[1.2] text-[#6a6c75] font-['Inter']">
                Teams information would go here...
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FullScreenModalV2: React.FC<FullScreenModalV2Props> = ({ isOpen, onClose, selectedUsersCount }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [subscriptionRoles, setSubscriptionRoles] = useState('');
  const [appRoles, setAppRoles] = useState('');
  const [selectedApps, setSelectedApps] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof affectedUsers[0] | null>(null);

  // Action options matching Figma design
  const actionOptions = [
    { 
      value: 'add-roles', 
      label: 'Add roles', 
      description: 'Add subscription or app level roles' 
    },
    { 
      value: 'remove-roles', 
      label: 'Remove roles', 
      description: 'Remove specific roles while keeping app access' 
    },
    { 
      value: 'add-apps', 
      label: 'Give access to new apps', 
      description: 'Grant users access to apps they don\'t currently have' 
    },
    { 
      value: 'remove-apps', 
      label: 'Remove access to apps', 
      description: 'Remove all access to selected apps' 
    }
  ];

  const subscriptionRoleOptions = [
    { value: 'report-collaborator', label: 'Report collaborator' },
    { value: 'segment-collaborator', label: 'Segment collaborator' },
    { value: 'segment-verifier', label: 'Segment verifier' },
    { value: 'viewer', label: 'Viewer' },
    { value: 'editor', label: 'Editor' },
    { value: 'manager', label: 'Manager' }
  ];

  const appRoleOptions = [
    { value: 'viewer', label: 'Viewer' },
    { value: 'tagging-editor', label: 'Tagging editor' },
    { value: 'creator', label: 'Creator' },
    { value: 'publisher', label: 'Publisher' },
    { value: 'content-editor', label: 'Content editor' },
    { value: 'user', label: 'User' }
  ];

  const appOptions = [
    { value: 'app1', label: 'Application 1' },
    { value: 'app2', label: 'Application 2' },
    { value: 'app3', label: 'Application 3' }
  ];

  // Affected users data matching Figma design
  const affectedUsers = [
    {
      name: 'Bobby Burgers',
      email: 'Bobby.burgers@email.com',
      pendoRoles: { base: 'User:', highlight: '3 roles across 4 apps' },
      feedbackRoles: 'Administrator',
      teams: { icon: 'puzzle', color: '#fff5f5', iconColor: '#da1010', name: 'Platform team', hasMore: true },
      lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
    },
    {
      name: 'Linda Person',
      email: 'Linda.Person@email.com',
      pendoRoles: { base: 'Subscription Admin', highlight: null },
      feedbackRoles: 'Administrator',
      teams: null,
      lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
    },
    {
      name: 'Gene Frenzy',
      email: 'Gene.frenzy@email.com',
      pendoRoles: { base: 'User', highlight: null },
      feedbackRoles: 'Administrator',
      teams: { icon: 'chart-line', color: '#e2f0ff', iconColor: '#0b9ad3', name: 'Analytics team', hasMore: false },
      lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
    },
    {
      name: 'Jake Johnson',
      email: 'Jake.johnson@email.com',
      pendoRoles: { base: 'Subscription Admin', highlight: null },
      feedbackRoles: 'Administrator',
      teams: { icon: 'bar-chart', color: '#fff0fe', iconColor: '#e14cd3', name: 'Listen team', hasMore: true },
      lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
    },
    {
      name: 'Rick Ramstein',
      email: 'Rick.ramstein@email.com',
      pendoRoles: { base: 'User', highlight: null },
      feedbackRoles: 'Administrator',
      teams: { icon: 'chart-line', color: '#e3f7ed', iconColor: '#00ba6d', name: 'Guides team', hasMore: true },
      lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
    },
    {
      name: 'Person Name',
      email: 'Person.name@email.com',
      pendoRoles: { base: 'Subscription Admin', highlight: null },
      feedbackRoles: 'Administrator',
      teams: { icon: 'chart-line', color: '#e2f0ff', iconColor: '#0b9ad3', name: 'Analytics team', hasMore: false },
      lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
    }
  ];

  const resetForm = () => {
    setSelectedAction('');
    setSubscriptionRoles('');
    setAppRoles('');
    setSelectedApps('');
    setSelectedUser(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    console.log('Saving changes:', {
      selectedAction,
      subscriptionRoles,
      appRoles,
      selectedApps
    });
    resetForm();
    onClose();
  };

  // Check if user has started making changes to show summary
  const hasActualSelections = selectedAction && (subscriptionRoles || appRoles || selectedApps);
  const canSave = selectedAction && (subscriptionRoles || appRoles || selectedApps);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#f8f8f9] z-50">
      {/* Header matching Figma design */}
      <div className="bg-white h-16 shadow-[0px_2px_6px_0px_rgba(0,0,0,0.17)] flex items-center justify-between px-8">
        <h1 className="text-[22px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
          Edit permissions
        </h1>
        <button
          onClick={handleClose}
          className="p-1 text-[#9a9ca5] hover:text-[#2a2c35] transition-colors size-6"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Main Content - Three Panel Layout like Figma */}
      <div className="flex gap-[26px] p-8 h-[calc(100vh-128px)] pb-4">
        {/* Left Panel - Permission changes (336px) */}
        <div className="w-[336px] flex-shrink-0">
          <div className="bg-white rounded-[3px] border border-[#dadce5] h-[680px] overflow-y-auto">
            {/* Header */}
            <div className="px-4 py-[13px] border-b border-[#dadce5]">
              <h2 className="text-[18px] font-normal leading-[1.2] text-black font-['Inter']">
                Permission changes
              </h2>
            </div>
            
            {/* Form Content */}
            <div className="p-4 space-y-4">
                {/* What would you like to do */}
              <Dropdown
                label="What would you like to do?"
                placeholder="Select how you want to update users"
                    value={selectedAction}
                onChange={setSelectedAction}
                required
                options={actionOptions}
              />

              {selectedAction && (
                <>
                  <div className="border-b border-[#dadce5] -mx-4"></div>
                  
                  <div>
                    <p className="text-[14.222px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter'] mb-4">
                      Select at least one of the following: <span className="text-[#cc0000] font-bold">*</span>
                    </p>
                    
                    <div className="space-y-4">
                      {/* Subscription level roles */}
                      <Dropdown
                        label="Subscription level roles"
                        placeholder="Select one or more roles"
                        value={subscriptionRoles}
                        onChange={setSubscriptionRoles}
                        options={subscriptionRoleOptions}
                      />

                      {/* App level roles */}
                      <Dropdown
                        label="App level roles"
                        placeholder="Select one or more roles"
                        value={appRoles}
                        onChange={setAppRoles}
                        options={appRoleOptions}
                      />

                      {/* Apps to apply app level roles to */}
                      <Dropdown
                        label="Apps to apply app level roles to"
                        placeholder={appRoles ? "Select apps to apply roles to" : "Select app level roles first"}
                        value={selectedApps}
                        onChange={setSelectedApps}
                        required={!!appRoles}
                        options={appOptions}
                        disabled={!appRoles}
                                  />
                                </div>
                              </div>
                </>
                          )}
                        </div>
                      </div>
                            </div>

        {/* Middle Panel - Affected users table */}
        <div className="flex-1">
          <div className="bg-white rounded-[3px] border border-[#dadce5] overflow-hidden">
            {/* Table Header */}
            <div className="bg-white border-b border-[#dadce5] px-4 py-3 flex items-center">
              <h2 className="text-[18px] font-normal leading-[1.2] text-[#2a2c35] font-['Inter']">
                Affected users ({selectedUsersCount} selected)
              </h2>
            </div>
                              
            {/* Table */}
            <div>
              {/* Column Headers */}
              <div className="bg-[#f8f8f9] border-b border-[#dadce5] flex">
                <div className="flex-[2] px-4 py-2">
                  <h3 className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
                    Username
                  </h3>
                </div>
                <div className="flex-[2] px-4 py-2">
                  <h3 className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
                    Pendo roles
                  </h3>
                </div>
                <div className="flex-[1.5] px-4 py-2">
                  <h3 className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
                    Feedback roles
                  </h3>
                </div>
                <div className="flex-[1.5] px-4 py-2">
                  <h3 className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
                    Teams
                  </h3>
                </div>
              </div>

              {/* Table Body */}
              <div>
                {affectedUsers.slice(0, selectedUsersCount).map((user, index) => (
                  <div 
                    key={user.name} 
                    className="flex border-b border-[#dadce5] min-h-[48px] hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedUser(user)}
                  >
                    {/* Username Column */}
                    <div className="flex-[2] px-4 py-2 flex flex-col justify-center">
                      <div className="text-[14px] font-normal leading-[1.2] text-[#128297] font-['Inter']">
                        {user.name}
                      </div>
                      <div className="text-[12px] font-normal leading-[1.2] text-[#6a6c75] font-['Inter']">
                        {user.email}
                      </div>
                    </div>

                    {/* Pendo Roles Column */}
                    <div className="flex-[2] px-4 py-2 flex items-center">
                      <div className="text-[14px] font-normal leading-[1.2] font-['Inter']">
                        {typeof user.pendoRoles === 'string' ? (
                          <span className="text-[#2a2c35]">{user.pendoRoles}</span>
                        ) : (
                          <>
                            <span className="text-[#2a2c35]">{user.pendoRoles.base} </span>
                            {user.pendoRoles.highlight && (
                              <span className="text-[#128297]">{user.pendoRoles.highlight}</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Feedback Roles Column */}
                    <div className="flex-[1.5] px-4 py-2 flex items-center">
                      <div className="text-[14px] font-normal leading-[1.2] text-[#2a2c35] font-['Inter']">
                        {user.feedbackRoles}
                      </div>
                    </div>

                    {/* Teams Column */}
                    <div className="flex-[1.5] px-4 py-2 flex items-center">
                      {user.teams ? (
                        <div className="flex flex-col gap-0.5 w-full">
                          <div className="flex items-center gap-2">
                            <div 
                              className="flex items-center justify-center p-[2px] rounded-[1px] shrink-0"
                              style={{ backgroundColor: user.teams.color }}
                            >
                              <div className="w-3 h-3 flex items-center justify-center">
                                {user.teams.icon === 'puzzle' && <PuzzleIcon color={user.teams.iconColor} />}
                                {user.teams.icon === 'chart-line' && <ChartLineIcon color={user.teams.iconColor} />}
                                {user.teams.icon === 'bar-chart' && <BarChartIcon color={user.teams.iconColor} />}
                              </div>
                            </div>
                            <span className="text-[14px] font-normal leading-[1.2] text-[#2a2c35] font-['Inter']">
                              {user.teams.name}
                            </span>
                          </div>
                          {user.teams.hasMore && (
                            <div className="flex items-center gap-1">
                              <span className="text-[12px] font-normal text-[#128297]">+</span>
                              <button className="text-[12px] font-normal text-[#128297] hover:underline">
                                2 more teams
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-[14px] font-normal leading-[1.2] text-[#9a9ca5] font-['Inter']">
                          No team assigned
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - User Info or Summary of changes */}
        {selectedUser && (
          <UserInfo 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)} 
          />
        )}
        
        {!selectedUser && hasActualSelections && (
          <div className="w-[336px] flex-shrink-0">
            <div className="bg-white rounded-[3px] border border-[#dadce5] h-[680px] overflow-y-auto">
              {/* Header */}
              <div className="px-4 py-[13px] border-b border-[#dadce5]">
                <h2 className="text-[18px] font-normal leading-[1.2] text-black font-['Inter']">
                  Summary of changes
                </h2>
          </div>

              {/* Content */}
              <div className="p-4">
                <div className="space-y-1">
                  {affectedUsers.slice(0, selectedUsersCount).map((user) => {
                    // Get current role text
                    const currentRoleText = typeof user.pendoRoles === 'string' 
                      ? user.pendoRoles 
                      : `${user.pendoRoles.base}${user.pendoRoles.highlight ? ` ${user.pendoRoles.highlight}` : ''}`;
                    
                    // Generate new role text based on selections
                    let newRoleText = currentRoleText;
                    if (selectedAction === 'add-roles') {
                      if (subscriptionRoles || appRoles) {
                        // For demo purposes, show an updated role count
                        newRoleText = "User: 5 roles across 6 apps";
                      }
                    } else if (selectedAction === 'remove-roles') {
                      newRoleText = "User: 1 role across 2 apps";
                    }
                    
                    return (
                      <div 
                        key={user.name} 
                        className="bg-white border-b border-[#dadce5] p-4"
                      >
                        <div className="flex flex-col">
                          <div className="text-[14.222px] font-semibold leading-[1.5] text-[#2a2c35] font-['Inter'] mb-1">
                            {user.name}
                          </div>
                          <div className="space-y-0.5">
                            <div className="text-[12.642px] font-normal leading-[1.5] text-[#6a6c75] font-['Inter'] line-through">
                              {currentRoleText}
                            </div>
                            <div className="text-[12.642px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter']">
                              {newRoleText}
                            </div>
                          </div>
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

      {/* Footer matching Figma design */}
      <div className="bg-white border-t border-[#dadce5] shadow-[0px_-2px_6px_0px_rgba(0,0,0,0.17)] px-8 py-4 flex justify-end gap-3 h-16">
        <button
          onClick={handleClose}
          className="bg-white text-[#128297] border border-[#128297] px-6 py-2 rounded-[3px] text-[14px] font-normal hover:bg-[#f0f9fa] transition-colors min-w-[80px]"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`px-6 py-2 rounded-[3px] text-[14px] font-normal transition-colors min-w-[80px] ${
            canSave 
              ? 'bg-[#128297] text-white hover:bg-[#0f6b7d]' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FullScreenModalV2;