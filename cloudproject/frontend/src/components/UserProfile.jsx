import { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon } from 'lucide-react';

const UserProfile = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  // Extract initials for the avatar
  const initials = user.username.substring(0, 2).toUpperCase();

  return (
    <div className="user-profile-widget fade-in-slow" ref={dropdownRef}>
      <div className="profile-info">
        <span className="profile-name">{user.username}</span>
        <span className="profile-role">{user.role || 'Developer'}</span>
      </div>
      
      <div 
        className="profile-avatar lusion-glow" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'none' }} // Lets custom cursor handle it
      >
        {initials}
      </div>

      {isOpen && (
        <div className="profile-dropdown fade-in">
          <div className="dropdown-header">
            <UserIcon size={16} /> Signed in as <strong>{user.username}</strong>
          </div>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item danger" onMouseDown={onLogout}>
            <LogOut size={14} style={{ marginRight: '8px' }} /> Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
