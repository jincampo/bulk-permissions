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

const FullScreenModalV2: React.FC<FullScreenModalV2Props> = ({ isOpen, onClose, selectedUsersCount }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [subscriptionRoles, setSubscriptionRoles] = useState('');
  const [appRoles, setAppRoles] = useState('');
  const [selectedApps, setSelectedApps] = useState('');

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
      pendoRoles: 'User: 3 roles across 4 apps',
      feedbackRoles: 'Administrator',
      teams: '🏢 Platform team',
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
      teams: '🎧 Listen team',
      lastLogin: 'Jun 19, 2024 12:09:01 PM EDT'
    },
    {
      name: 'Rick Ramstein',
      email: 'Rick.ramstein@email.com',
      pendoRoles: 'User',
      feedbackRoles: 'Administrator',
      teams: '📚 Guides team',
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

  const resetForm = () => {
    setSelectedAction('');
    setSubscriptionRoles('');
    setAppRoles('');
    setSelectedApps('');
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

      {/* Main Content - Left/Right Layout like Figma */}
      <div className="flex gap-[26px] p-8 h-[calc(100vh-128px)]">
        {/* Left Panel - Permission changes (336px) */}
        <div className="w-[336px] flex-shrink-0">
          <div className="bg-white rounded-[3px] border border-[#dadce5] h-[716px] overflow-y-auto">
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
          <div className="bg-white rounded-[3px] border border-[#dadce5] h-[716px] overflow-hidden">
            {/* Table Header */}
            <div className="bg-white border-b border-[#dadce5] px-4 py-3 h-[49px] flex items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-[18px] font-normal leading-[1.2] text-[#2a2c35] font-['Inter']">
                  Affected users
                </h2>
                <span className="text-[18px] font-normal leading-[1.2] text-[#6a6c75] font-['Inter']">
                  ({selectedUsersCount} selected)
                </span>
              </div>
            </div>
                
                {/* Table Columns */}
                <div className="flex h-[calc(716px-49px)]">
                  {/* Username Column */}
                  <div className="flex-1">
                    <div className="bg-[#f8f8f9] border-b-2 border-[#dadce5] px-4 py-3 h-10 flex items-center">
                      <h3 className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
                        Username
                      </h3>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-40px)]">
                      {affectedUsers.slice(0, selectedUsersCount).map((user) => (
                        <div key={user.name} className="bg-white border-b border-[#dadce5] px-4 py-4 h-16 flex flex-col justify-center">
                          <div className="text-[14.222px] font-semibold leading-[1.5] text-[#128297] font-['Inter']">
                            {user.name}
                          </div>
                          <div className="text-[12.642px] font-normal leading-[1.5] text-[#6a6c75] font-['Inter']">
                            {user.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pendo Roles Column */}
                  <div className="w-[258px] border-l border-[#dadce5]">
                    <div className="bg-[#f8f8f9] border-b-2 border-[#dadce5] px-4 py-3 h-10 flex items-center">
                      <h3 className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
                        Pendo roles
                      </h3>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-40px)]">
                      {affectedUsers.slice(0, selectedUsersCount).map((user) => (
                        <div key={user.name} className="bg-white border-b border-[#dadce5] px-4 py-4 h-16 flex items-center">
                          <div className="text-[14.222px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter']">
                            {user.pendoRoles}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Roles Column */}
                  <div className="flex-1 border-l border-[#dadce5]">
                    <div className="bg-[#f8f8f9] border-b-2 border-[#dadce5] px-4 py-3 h-10 flex items-center">
                      <h3 className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
                        Feedback roles
                      </h3>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-40px)]">
                      {affectedUsers.slice(0, selectedUsersCount).map((user) => (
                        <div key={user.name} className="bg-white border-b border-[#dadce5] px-4 py-4 h-16 flex items-center">
                          <div className="text-[14.222px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter']">
                            {user.feedbackRoles}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teams Column */}
                  <div className="w-[217px] border-l border-[#dadce5]">
                    <div className="bg-[#f8f8f9] border-b-2 border-[#dadce5] px-4 py-3 h-10 flex items-center">
                      <h3 className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
                        Teams
                      </h3>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-40px)]">
                      {affectedUsers.slice(0, selectedUsersCount).map((user) => (
                        <div key={user.name} className="bg-white border-b border-[#dadce5] px-4 py-4 h-16 flex items-center">
                          <div className="text-[14.222px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter']">
                            {user.teams}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Last Login Column */}
                  <div className="flex-1 border-l border-[#dadce5]">
                    <div className="bg-[#f8f8f9] border-b-2 border-[#dadce5] px-4 py-3 h-10 flex items-center">
                      <h3 className="text-[14px] font-semibold leading-[1.2] text-[#2a2c35] font-['Inter']">
                        Last login
                      </h3>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-40px)]">
                      {affectedUsers.slice(0, selectedUsersCount).map((user) => (
                        <div key={user.name} className="bg-white border-b border-[#dadce5] px-4 py-4 h-16 flex items-center">
                          <div className="text-[14.222px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter']">
                            {user.lastLogin}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Summary of changes (shows when user starts making changes) */}
        {hasActualSelections && (
          <div className="w-[336px] flex-shrink-0">
            <div className="bg-white rounded-[3px] border border-[#dadce5] h-[716px] overflow-y-auto">
              {/* Header */}
              <div className="px-4 py-[13px] border-b border-[#dadce5]">
                <h2 className="text-[18px] font-normal leading-[1.2] text-black font-['Inter']">
                  Summary of changes
                </h2>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="text-[14.222px] font-semibold leading-[1.5] text-[#2a2c35] font-['Inter'] mb-2">
                      Changes to apply:
                    </div>
                    <div className="text-[14.222px] font-normal leading-[1.5] text-[#2a2c35] font-['Inter']">
                      <div className="font-medium mb-2">
                        {actionOptions.find(opt => opt.value === selectedAction)?.label}
                      </div>
                      {subscriptionRoles && (
                        <div className="mb-1">
                          <span className="font-medium">Subscription roles:</span> {subscriptionRoleOptions.find(role => role.value === subscriptionRoles)?.label}
                        </div>
                      )}
                      {appRoles && (
                        <div className="mb-1">
                          <span className="font-medium">App roles:</span> {appRoleOptions.find(role => role.value === appRoles)?.label}
                        </div>
                      )}
                      {selectedApps && (
                        <div className="mb-1">
                          <span className="font-medium">Apps:</span> {appOptions.find(app => app.value === selectedApps)?.label}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-b border-[#dadce5] -mx-4"></div>

                  <div>
                    <div className="text-[14.222px] font-semibold leading-[1.5] text-[#2a2c35] font-['Inter'] mb-3">
                      Affected users:
                    </div>
                    <div className="space-y-3">
                      {affectedUsers.slice(0, selectedUsersCount).map((user) => (
                        <div key={user.name} className="pb-3 border-b border-gray-200">
                          <div className="text-[14.222px] font-semibold leading-[1.5] text-[#2a2c35] font-['Inter'] mb-1">
                            {user.name}
                          </div>
                          <div className="space-y-1">
                            <div className="text-[12.642px] font-normal leading-[1.5] text-[#6a6c75] font-['Inter']">
                              Current: {user.pendoRoles}
                            </div>
                            <div className="text-[12.642px] font-normal leading-[1.5] text-[#128297] font-['Inter']">
                              Will be updated with selected changes
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer matching Figma design */}
      <div className="bg-white border-t border-[#dadce5] shadow-[0px_-2px_6px_0px_rgba(0,0,0,0.17)] px-8 py-4 flex justify-end gap-4 h-16">
        <button
          onClick={handleClose}
          className="bg-white text-[#128297] border border-[#128297] px-3 py-2.5 rounded-[3px] text-[14.222px] font-semibold hover:bg-[#f0f9fa] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`px-3 py-2.5 rounded-[3px] text-[14.222px] font-semibold transition-colors ${
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