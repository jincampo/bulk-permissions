import React, { useState } from 'react';
import Modal from './Modal';
import FullScreenModal from './FullScreenModal';
import FullScreenModalV2 from './FullScreenModalV2';
import FullScreenModalV3 from './FullScreenModalV3';

const UsersListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullModalOpen, setIsFullModalOpen] = useState(false);
  const [isFullModalV2Open, setIsFullModalV2Open] = useState(false);
  const [isFullModalV3Open, setIsFullModalV3Open] = useState(false);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Bobby Burgers",
      email: "Bobby.burgers@email.com",
      pendoRoles: "User: 3 roles across 4 apps",
      feedbackRoles: "Administrator",
      teams: "Platform team",
      lastLogin: "Jun 19, 2024 12:09:01 PM EDT",
      selected: true
    },
    {
      id: 2,
      name: "Linda Person",
      email: "Linda.Person@email.com",
      pendoRoles: "Subscription Admin",
      feedbackRoles: "Administrator",
      teams: "No team assigned",
      lastLogin: "Jun 19, 2024 12:09:01 PM EDT",
      selected: true
    },
    {
      id: 3,
      name: "Gene Frenzy",
      email: "Gene.frenzy@email.com",
      pendoRoles: "User",
      feedbackRoles: "Administrator",
      teams: "Analytics team",
      lastLogin: "Jun 19, 2024 12:09:01 PM EDT",
      selected: true
    },
    {
      id: 4,
      name: "Jake Johnson",
      email: "Jake.johnson@email.com",
      pendoRoles: "Subscription Admin",
      feedbackRoles: "Administrator",
      teams: "Listen team + 2 more teams",
      lastLogin: "Jun 19, 2024 12:09:01 PM EDT",
      selected: true
    },
    {
      id: 5,
      name: "Rick Ramstein",
      email: "Rick.ramstein@email.com",
      pendoRoles: "User",
      feedbackRoles: "Administrator",
      teams: "Guides team + 2 more teams",
      lastLogin: "Jun 19, 2024 12:09:01 PM EDT",
      selected: true
    },
    {
      id: 6,
      name: "Person Name",
      email: "Person.name@email.com",
      pendoRoles: "Subscription Admin",
      feedbackRoles: "Administrator",
      teams: "Analytics team",
      lastLogin: "Jun 19, 2024 12:09:01 PM EDT",
      selected: true
    }
  ]);

  const selectedCount = users.filter(user => user.selected).length;

  const handleUserToggle = (userId: number) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, selected: !user.selected } : user
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setUsers(prevUsers => 
      prevUsers.map(user => ({ ...user, selected: checked }))
    );
  };

  const allSelected = users.length > 0 && users.every(user => user.selected);
  const someSelected = users.some(user => user.selected);

  return (
    <div className="min-h-screen bg-[#f8f8f9]">
      {/* Navigation Sidebar (simplified) */}
      <div className="fixed left-0 top-0 w-[217px] h-full bg-[#18044a] z-10">
        <div className="p-4">
          <div className="text-white font-bold text-xl mb-8">pendo</div>
          <nav className="space-y-2">
            <div className="text-white/70 text-sm py-2 px-3">Dashboards</div>
            <div className="text-white/70 text-sm py-2 px-3">Product</div>
            <div className="text-white/70 text-sm py-2 px-3">People</div>
            <div className="text-white/70 text-sm py-2 px-3">Behavior</div>
            <div className="text-white/70 text-sm py-2 px-3">NPS</div>
            <div className="text-white/70 text-sm py-2 px-3">Guides</div>
            <div className="text-white/70 text-sm py-2 px-3">Discover</div>
            <div className="text-white/70 text-sm py-2 px-3">Replay</div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-[221px] p-8">
        {/* Header */}
        <div className="mb-8 border-b border-[#dadce5] pb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-semibold text-[#2a2c35]">Users and teams</h1>
            <button className="bg-[#128297] text-white px-4 py-2 rounded text-sm font-semibold hover:bg-[#0f6b7d]">
              + Add user
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-8 border-b border-[#dadce5]">
            <div className="pb-2 border-b-2 border-[#2a2c35]">
              <span className="text-[#1a1c25] font-semibold">Users</span>
            </div>
            <div className="pb-2">
              <span className="text-[#1a1c25]">Teams</span>
            </div>
            <div className="pb-2">
              <span className="text-[#1a1c25]">Custom roles</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-[#dadce5] rounded p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <select className="border border-[#dadce5] rounded px-3 py-2 text-sm">
                <option>All Roles</option>
              </select>
              <select className="border border-[#dadce5] rounded px-3 py-2 text-sm">
                <option>All Statuses</option>
              </select>
              <select className="border border-[#dadce5] rounded px-3 py-2 text-sm">
                <option>All Teams</option>
              </select>
            </div>
            <div>
              <input 
                type="text" 
                placeholder="Search" 
                className="border border-[#dadce5] rounded px-3 py-2 text-sm w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#dadce5] rounded overflow-hidden">
          {/* Table Header with Action Buttons */}
          <div className="bg-white border-b border-[#dadce5] px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg text-[#2a2c35]">Users</span>
                  <span className="text-lg text-[#6a6c75]">({selectedCount} of 6 selected)</span>
                </div>
                <div className="w-px h-6 bg-[#dadce5]"></div>
                <button className="flex items-center space-x-1 text-[#128297] text-sm font-semibold hover:text-[#0f6b7d]">
                  <span>👥</span>
                  <span>Add to teams</span>
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-1 text-[#128297] text-sm font-semibold hover:text-[#0f6b7d]"
                >
                  <span>✏️</span>
                  <span>Edit permissions</span>
                </button>
                <button
                  onClick={() => setIsFullModalOpen(true)}
                  className="flex items-center space-x-1 text-[#128297] text-sm font-semibold hover:text-[#0f6b7d]"
                >
                  <span>⤢</span>
                  <span>Edit (full screen)</span>
                </button>
                <button
                  onClick={() => setIsFullModalV2Open(true)}
                  className="flex items-center space-x-1 text-[#128297] text-sm font-semibold hover:text-[#0f6b7d]"
                >
                  <span>⤢</span>
                  <span>Edit full screen v2</span>
                </button>
                <button
                  onClick={() => setIsFullModalV3Open(true)}
                  className="flex items-center space-x-1 text-[#128297] text-sm font-semibold hover:text-[#0f6b7d]"
                >
                  <span>⤢</span>
                  <span>Edit full screen v3</span>
                </button>
                <button className="flex items-center space-x-1 text-[#128297] text-sm font-semibold hover:text-[#0f6b7d]">
                  <span>🗑️</span>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column Headers */}
          <div className="bg-[#f8f8f9] border-b-2 border-[#dadce5]">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-[#2a2c35]">
              <div className="col-span-1 flex items-center">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  ref={input => {
                    if (input) input.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded"
                />
              </div>
              <div className="col-span-3">Username</div>
              <div className="col-span-2">Pendo roles</div>
              <div className="col-span-2">Feedback roles</div>
              <div className="col-span-2">Teams</div>
              <div className="col-span-2">Last login</div>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#dadce5]">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-gray-50">
                <div className="col-span-1 flex items-center">
                  <input 
                    type="checkbox" 
                    checked={user.selected} 
                    onChange={() => handleUserToggle(user.id)}
                    className="rounded"
                  />
                </div>
                <div className="col-span-3">
                  <div className="font-semibold text-[#128297] text-sm">{user.name}</div>
                  <div className="text-xs text-[#6a6c75]">{user.email}</div>
                </div>
                <div className="col-span-2 text-sm text-[#2a2c35]">
                  {user.pendoRoles}
                </div>
                <div className="col-span-2 text-sm text-[#2a2c35]">
                  {user.feedbackRoles}
                </div>
                <div className="col-span-2 text-sm text-[#2a2c35]">
                  {user.teams}
                </div>
                <div className="col-span-2 text-sm text-[#2a2c35]">
                  {user.lastLogin}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedUsersCount={selectedCount}
      />

      <FullScreenModal
        isOpen={isFullModalOpen}
        onClose={() => setIsFullModalOpen(false)}
        selectedUsersCount={selectedCount}
      />

      <FullScreenModalV2
        isOpen={isFullModalV2Open}
        onClose={() => setIsFullModalV2Open(false)}
        selectedUsersCount={selectedCount}
      />

      <FullScreenModalV3
        isOpen={isFullModalV3Open}
        onClose={() => setIsFullModalV3Open(false)}
        selectedUsersCount={selectedCount}
      />
    </div>
  );
};

export default UsersListPage;