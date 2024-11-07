import React, { useState, useEffect } from 'react';

interface DropdownProps {
  id: string;
  isActive: boolean;
  toggleDropdown: (_id: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ id, isActive, toggleDropdown }) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
        toggleDropdown(''); // Pass empty string or null to deactivate
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleDropdown]);

  return (
    <div ref={nodeRef}>
      <button onClick={() => toggleDropdown(id)}>{isActive ? 'Close Dropdown' : 'Open Dropdown'}</button>
      {isActive && <div className="dropdown-content">Content of {id}</div>}
    </div>
  );
};
interface DropdownProps2 {
  id: string;
  isActive: boolean;
  toggleDropdown: (_id: string) => void;
}

const Dropdown2: React.FC<DropdownProps2> = ({ id, isActive, toggleDropdown }) => {
  const nodeRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (nodeRef.current && !nodeRef.current.contains(event.target as Node)) {
        toggleDropdown(''); // Pass empty string or null to deactivate
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleDropdown]);

  
  return (
    <div ref={nodeRef}>
      <button onClick={() => toggleDropdown(id)}>{isActive ? 'Close Dropdown' : 'Open Dropdown'}</button>
      {isActive && <div className="dropdown-content">Content of {id}</div>}
    </div>
  );
};

interface DropdownState {
  activeDropdown: string | null;
}

const DropdownManager: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<DropdownState['activeDropdown']>(null);

  const toggleDropdown = (id: string): void => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div>
      <Dropdown id="Dropdown1" isActive={activeDropdown === 'Dropdown1'} toggleDropdown={toggleDropdown} />
      <Dropdown2 id="Dropdown2" isActive={activeDropdown === 'Dropdown2'} toggleDropdown={toggleDropdown} />
      <Dropdown id="Dropdown3" isActive={activeDropdown === 'Dropdown3'} toggleDropdown={toggleDropdown} />
      {/* Add more Dropdowns as needed */}
    </div>
  );
};

export default DropdownManager;
