import React, { useState } from 'react';

// SVG Icons as components for better maintainability
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type RequirementType = 'critical' | 'conditional' | 'choice' | 'none';

interface DropdownProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: RequirementType;
  helperText?: string;
  options?: string[];
}

const Dropdown: React.FC<DropdownProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = 'none',
  helperText,
  options = []
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange?.(option);
    setIsOpen(false);
  };

  const getRequiredIndicator = () => {
    switch (required) {
      case 'critical':
        return <span className="text-red-500 font-bold">*</span>;
      case 'conditional':
        return <span className="text-orange-500 font-bold">*</span>;
      case 'choice':
        return <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>;
      default:
        return null;
    }
  };

  const getLabelClass = () => {
    switch (required) {
      case 'critical':
        return "text-sm font-semibold text-red-700";
      case 'conditional':
        return "text-sm font-semibold text-orange-700";
      case 'choice':
        return "text-sm font-semibold text-blue-700";
      default:
        return "text-sm font-semibold text-[#2a2c35]";
    }
  };

  const getBorderClass = () => {
    switch (required) {
      case 'critical':
        return value ? "border-[#dadce5]" : "border-red-300";
      case 'conditional':
        return value ? "border-[#dadce5]" : "border-orange-300";
      case 'choice':
        return "border-blue-300";
      default:
        return "border-[#dadce5]";
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-1">
        <label className={getLabelClass()}>
          {label}
        </label>
        {getRequiredIndicator()}
      </div>
      {helperText && (
        <p className="text-xs text-gray-600 -mt-0.5 mb-1">{helperText}</p>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full h-9 px-2 py-2 bg-white border ${getBorderClass()} rounded-[3px] flex items-center justify-between text-left text-sm text-[#9a9ca5] hover:border-[#128297] focus:outline-none focus:border-[#128297]`}
        >
          <span className={value ? "text-[#2a2c35]" : "text-[#9a9ca5]"}>
            {value || placeholder}
          </span>
          <ChevronDownIcon />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#dadce5] rounded-[3px] shadow-lg z-10 max-h-48 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-2 py-2 text-left text-sm text-[#2a2c35] hover:bg-gray-50 first:rounded-t-[3px] last:rounded-b-[3px]"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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

const ModalVersionB: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedUsersCount = 6 
}) => {
  const [action, setAction] = useState<string>('');
  const [subscriptionRoles, setSubscriptionRoles] = useState<string>('');
  const [appRoles, setAppRoles] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<string>('');

  const actionOptions = [
    'Add roles',
    'Remove roles',
    'Replace roles'
  ];

  const roleOptions = [
    'Admin',
    'Editor',
    'Viewer',
    'Manager',
    'Contributor'
  ];

  const appOptions = [
    'Customer Portal',
    'Admin Dashboard',
    'Analytics Platform',
    'Marketing Suite',
    'Support Center'
  ];

  const resetForm = () => {
    setAction('');
    setSubscriptionRoles('');
    setAppRoles('');
    setSelectedApp('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    console.log('Saving changes:', {
      action,
      subscriptionRoles,
      appRoles,
      selectedApp: appRoles ? selectedApp : undefined
    });
    resetForm();
    onClose();
  };

  const canSave = action && (subscriptionRoles || appRoles) && (!appRoles || selectedApp);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded border border-[#eaecf1] w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-[15px] border-b border-[#dadce5]">
          <h2 className="text-[22.78px] font-semibold text-[#2a2c35] leading-[1.3]">
            Change permissions? (Version B)
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-[#6a6c75] hover:text-[#2a2c35] transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-4 pt-4 pb-6">
          <div className="space-y-4">
            <p className="text-sm text-[#2a2c35]">
              Update roles or apps for the{' '}
              <span className="font-bold">{selectedUsersCount} selected users</span>.
            </p>

            {/* Critical requirement - blocks all progress */}
            <Dropdown
              label="What would you like to do?"
              placeholder="Select how you want to update users"
              value={action}
              onChange={setAction}
              required="critical"
              helperText="This field is required to continue"
              options={actionOptions}
            />

            {action && (
              <>
                {/* Legend for requirement types */}
                <div className="bg-gray-50 p-3 rounded border text-xs">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-red-500 font-bold">*</span>
                      <span className="text-red-700">Critical</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-orange-500 font-bold">*</span>
                      <span className="text-orange-700">Conditional</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-blue-700">Choose one</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-[#2a2c35] font-medium">
                  Select at least one of the following:
                </p>

                {/* Choice requirements - at least one needed */}
                <div className="space-y-3 bg-blue-50 p-3 rounded border border-blue-200">
                  <Dropdown
                    label="Subscription level roles"
                    placeholder="Select roles"
                    value={subscriptionRoles}
                    onChange={setSubscriptionRoles}
                    required="choice"
                    helperText="Choose subscription roles or app roles (or both)"
                    options={roleOptions}
                  />

                  <Dropdown
                    label="App level roles"
                    placeholder="Select roles"
                    value={appRoles}
                    onChange={(value) => {
                      setAppRoles(value);
                      if (!value) {
                        setSelectedApp('');
                      }
                    }}
                    required="choice"
                    helperText="Choose subscription roles or app roles (or both)"
                    options={roleOptions}
                  />
                </div>

                {/* Conditional requirement - depends on app roles */}
                {appRoles && (
                  <Dropdown
                    label="Select app"
                    placeholder="Choose which app"
                    value={selectedApp}
                    onChange={setSelectedApp}
                    required="conditional"
                    helperText="Required when app roles are selected"
                    options={appOptions}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-4 border-t border-[#dadce5]">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
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
  );
};

export default ModalVersionB; 