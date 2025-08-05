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

const CheckIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 11.5V8M8 4.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface DropdownProps {
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  options?: string[];
  helperText?: string;
  showSuccess?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  options = [],
  helperText,
  showSuccess = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onChange?.(option);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-1">
        <label className="text-sm font-semibold text-[#2a2c35]">
          {label}
        </label>
        {required && <span className="text-red-500">*</span>}
        {showSuccess && value && (
          <CheckIcon className="text-green-500 w-4 h-4" />
        )}
      </div>
      {helperText && (
        <p className="text-xs text-gray-600 -mt-0.5 mb-1">{helperText}</p>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-9 px-2 py-2 bg-white border border-[#dadce5] rounded-[3px] flex items-center justify-between text-left text-sm text-[#9a9ca5] hover:border-[#128297] focus:outline-none focus:border-[#128297]"
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

interface ValidationSummaryProps {
  isComplete: boolean;
  nextStep?: string;
  completedSteps: string[];
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({ 
  isComplete, 
  nextStep, 
  completedSteps 
}) => {
  if (isComplete) {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
        <CheckIcon className="w-4 h-4 flex-shrink-0" />
        <span className="font-medium">Ready to save changes</span>
      </div>
    );
  }

  if (nextStep) {
    return (
      <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded text-blue-800 text-sm">
        <InfoIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-medium">Next: </span>
          <span>{nextStep}</span>
          {completedSteps.length > 0 && (
            <div className="mt-1 text-xs">
              <span className="text-blue-600">Completed: {completedSteps.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsersCount?: number;
}

const ModalHybrid: React.FC<ModalProps> = ({ 
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

  // Validation logic for summary
  const getValidationState = () => {
    const completedSteps: string[] = [];
    
    if (action) completedSteps.push('Action selected');
    if (subscriptionRoles) completedSteps.push('Subscription roles');
    if (appRoles) completedSteps.push('App roles');
    if (selectedApp) completedSteps.push('App selected');

    if (!action) {
      return { isComplete: false, nextStep: 'Select an action', completedSteps };
    }
    
    if (!subscriptionRoles && !appRoles) {
      return { isComplete: false, nextStep: 'Choose at least one role type', completedSteps };
    }
    
    if (appRoles && !selectedApp) {
      return { isComplete: false, nextStep: 'Select which app', completedSteps };
    }
    
    return { isComplete: true, nextStep: undefined, completedSteps };
  };

  const validationState = getValidationState();
  const canSave = validationState.isComplete;
  const hasSelectedRoles = subscriptionRoles || appRoles;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded border border-[#eaecf1] w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-[15px] border-b border-[#dadce5]">
          <h2 className="text-[22.78px] font-semibold text-[#2a2c35] leading-[1.3]">
            Change permissions? (Hybrid)
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

            {/* Validation Summary - contextual help that updates */}
            <ValidationSummary
              isComplete={validationState.isComplete}
              nextStep={validationState.nextStep}
              completedSteps={validationState.completedSteps}
            />

            {/* Critical requirement - simple asterisk */}
            <Dropdown
              label="What would you like to do?"
              placeholder="Select how you want to update users"
              value={action}
              onChange={setAction}
              required
              showSuccess
              options={actionOptions}
            />

            {action && (
              <>
                {/* Visual grouping + helper text for "at least one" requirement */}
                <div className="bg-gray-50 border border-dashed border-gray-300 p-3 rounded">
                  <div className="flex items-start gap-2 mb-3">
                    <InfoIcon className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <span className="font-medium text-gray-900">Select at least one role type</span>
                      <p className="text-gray-600 text-xs mt-0.5">
                        Choose subscription roles, app roles, or both
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                                         <Dropdown
                       label="Subscription level roles"
                       placeholder="Select roles"
                       value={subscriptionRoles}
                       onChange={setSubscriptionRoles}
                       showSuccess={!!hasSelectedRoles}
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
                       showSuccess={!!hasSelectedRoles}
                       options={roleOptions}
                     />
                  </div>
                </div>

                {/* Conditional requirement - appears with contextual help */}
                {appRoles && (
                  <div className="bg-orange-50 border border-orange-200 p-3 rounded">
                    <div className="flex items-center gap-2 mb-2">
                      <InfoIcon className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-orange-900">
                        App selection required
                      </span>
                    </div>
                    <Dropdown
                      label="Select app"
                      placeholder="Choose which app"
                      value={selectedApp}
                      onChange={setSelectedApp}
                      required
                      showSuccess
                      helperText="Required when app roles are selected"
                      options={appOptions}
                    />
                  </div>
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

export default ModalHybrid; 