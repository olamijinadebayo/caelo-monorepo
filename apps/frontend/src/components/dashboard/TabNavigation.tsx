import React from 'react';
import { Button } from '../ui/button';

interface Tab {
  id: string;
  label: string;
  isActive: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, onTabChange }) => {
  return (
    <div className="border-b border-[#eaecf0]">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={tab.isActive ? "default" : "ghost"}
            className={`border-b-2 rounded-none px-4 py-3 text-sm font-medium ${
              tab.isActive
                ? 'border-[#1a2340] bg-transparent text-[#1a2340] hover:bg-transparent'
                : 'border-transparent text-[#667085] hover:text-[#344054] hover:bg-gray-50'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
