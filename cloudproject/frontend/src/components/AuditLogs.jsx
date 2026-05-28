import { useState } from 'react';
import { ShieldAlert, Key, UserCheck, Server, Database, Shield, CheckCircle2, Lock, ChevronRight, Eye, Edit3, Terminal, UserPlus, Filter } from 'lucide-react';

const AuditLogs = () => {
  const [activeTab, setActiveTab] = useState('rbac');
  const [selectedRole, setSelectedRole] = useState('Developer');
  const [activeFilter, setActiveFilter] = useState('All');

  const roles = [
    { id: 'Viewer', desc: 'Read-only access to projects and tasks. Cannot modify or deploy.' },
    { id: 'Developer', desc: 'Full access to write code, deploy pipelines, and manage task lifecycle.' },
    { id: 'Admin', desc: 'Unrestricted access. Can manage users, billing, and override project roles.' }
  ];

  const permissions = [
    { id: 'read', label: 'Read Projects & Tasks', icon: <Eye size={18} /> },
    { id: 'write', label: 'Write & Edit Data', icon: <Edit3 size={18} /> },
    { id: 'deploy', label: 'Trigger Deployments', icon: <Terminal size={18} /> },
    { id: 'manage', label: 'Manage Users & Billing', icon: <UserPlus size={18} /> }
  ];

  const rolePermissions = {
    'Viewer': ['read'],
    'Developer': ['read', 'write', 'deploy'],
    'Admin': ['read', 'write', 'deploy', 'manage']
  };

  const ssoSteps = [
    { id: 1, title: 'Redirect to IdP', desc: 'User is automatically redirected to the Identity Provider (Okta / Azure AD).' },
    { id: 2, title: 'Authentication', desc: 'User completes login & Multi-Factor Authentication (MFA) externally.' },
    { id: 3, title: 'SAML Assertion', desc: 'IdP cryptographically signs a SAML assertion and sends it to DevTrack.' },
    { id: 4, title: 'Auto Role Mapping', desc: 'DevTrack dynamically maps IdP groups to internal RBAC roles.' },
    { id: 5, title: 'Zero-Touch Deprovisioning', desc: 'Removing a user in Okta instantly revokes DevTrack access within minutes.' }
  ];

  const allLogs = [
    { id: 1, type: 'Auth', action: 'SSO Login via Okta', user: 'admin', time: 'Just now', ip: '192.168.1.104', icon: <Key size={16} color="#3b82f6" /> },
    { id: 2, type: 'RBAC', action: 'Role modified: Developer -> Admin', user: 'system', time: '1h ago', ip: 'internal', icon: <UserCheck size={16} color="#8b5cf6" /> },
    { id: 3, type: 'Data', action: 'K8s ConfigMap updated', user: 'admin', time: '3h ago', ip: '192.168.1.104', icon: <Server size={16} color="#10b981" /> },
    { id: 4, type: 'Security', action: 'Failed SSH attempt detected', user: 'unknown', time: '1d ago', ip: '45.22.11.9', icon: <ShieldAlert size={16} color="#ef4444" /> },
    { id: 5, type: 'Data', action: 'MongoDB collection export initiated', user: 'system', time: '1d ago', ip: 'internal', icon: <Database size={16} color="#f59e0b" /> },
  ];

  const filteredLogs = activeFilter === 'All' ? allLogs : allLogs.filter(log => log.type === activeFilter);

  return (
    <div className="list-view-container fade-in" style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', height: '100%', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <Shield color="#8b5cf6" size={28} />
        </div>
        <div>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>Enterprise Security Hub</h2>
          <p className="text-muted" style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>Role-Based Access Control, Identity Management, and Compliance Auditing.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('rbac')} style={{ background: 'transparent', border: 'none', color: activeTab === 'rbac' ? '#8b5cf6' : '#9ca3af', borderBottom: activeTab === 'rbac' ? '2px solid #8b5cf6' : 'none', padding: '10px 20px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
          Role-Based Access Control
        </button>
        <button onClick={() => setActiveTab('sso')} style={{ background: 'transparent', border: 'none', color: activeTab === 'sso' ? '#8b5cf6' : '#9ca3af', borderBottom: activeTab === 'sso' ? '2px solid #8b5cf6' : 'none', padding: '10px 20px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
          SSO / SAML Identity
        </button>
        <button onClick={() => setActiveTab('audit')} style={{ background: 'transparent', border: 'none', color: activeTab === 'audit' ? '#8b5cf6' : '#9ca3af', borderBottom: activeTab === 'audit' ? '2px solid #8b5cf6' : 'none', padding: '10px 20px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}>
          Audit Logs
        </button>
      </div>

      {/* Tab 1: RBAC */}
      {activeTab === 'rbac' && (
        <div className="fade-in">
          <p style={{ color: '#d1d5db', marginBottom: '20px', lineHeight: '1.5' }}>
            DevTrack features 3 built-in roles with precisely scoped permissions. The key power is that roles can be <strong>overridden at the project level</strong>, so a developer can have full access to most projects but only read-only access to sensitive ones.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            
            {/* Roles Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '5px' }}>Built-in Roles</h3>
              {roles.map(role => (
                <div 
                  key={role.id} 
                  onClick={() => setSelectedRole(role.id)}
                  style={{ 
                    padding: '15px 20px', 
                    background: selectedRole === role.id ? 'rgba(139, 92, 246, 0.1)' : 'rgba(20, 20, 25, 0.6)', 
                    border: `1px solid ${selectedRole === role.id ? '#8b5cf6' : 'rgba(255,255,255,0.05)'}`, 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>{role.id}</span>
                    {selectedRole === role.id && <CheckCircle2 size={18} color="#8b5cf6" />}
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0, lineHeight: '1.4' }}>{role.desc}</p>
                </div>
              ))}
            </div>

            {/* Dynamic Permissions Viewer */}
            <div style={{ background: 'rgba(20, 20, 25, 0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '25px' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Lock size={18} color="#8b5cf6" /> Permissions for {selectedRole}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {permissions.map(perm => {
                  const hasAccess = rolePermissions[selectedRole].includes(perm.id);
                  return (
                    <div key={perm.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: hasAccess ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.02)', borderRadius: '10px', border: `1px solid ${hasAccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)'}`, opacity: hasAccess ? 1 : 0.5, transition: 'all 0.3s' }}>
                      <div style={{ background: hasAccess ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', color: hasAccess ? '#10b981' : '#6b7280' }}>
                        {perm.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: hasAccess ? '#fff' : '#9ca3af', fontWeight: 'bold', fontSize: '1rem' }}>{perm.label}</div>
                      </div>
                      <div>
                        {hasAccess ? (
                          <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>GRANTED</span>
                        ) : (
                          <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>DENIED</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: SSO / SAML */}
      {activeTab === 'sso' && (
        <div className="fade-in">
          <p style={{ color: '#d1d5db', marginBottom: '30px', lineHeight: '1.5' }}>
            Enterprise Single Sign-On ensures that access is tightly controlled by your external Identity Provider. 
            The automatic deprovisioning step is particularly important for security: when you remove someone from Okta or Azure AD, their DevTrack access disappears within minutes with zero manual effort.
          </p>

          <div style={{ position: 'relative', paddingLeft: '30px' }}>
            {/* Timeline Line */}
            <div style={{ position: 'absolute', left: '11px', top: '10px', bottom: '10px', width: '2px', background: 'linear-gradient(to bottom, #8b5cf6, rgba(139, 92, 246, 0.1))' }}></div>

            {ssoSteps.map((step, index) => (
              <div key={step.id} style={{ position: 'relative', marginBottom: index === ssoSteps.length - 1 ? 0 : '30px', background: 'rgba(20, 20, 25, 0.6)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Timeline Dot */}
                <div style={{ position: 'absolute', left: '-26px', top: '25px', width: '14px', height: '14px', borderRadius: '50%', background: '#8b5cf6', border: '3px solid #141419' }}></div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'rgba(139, 92, 246, 0.2)', lineHeight: '1' }}>
                    0{step.id}
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.1rem', margin: '0 0 5px 0' }}>{step.title}</h4>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0, lineHeight: '1.4' }}>{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="fade-in">
          <p style={{ color: '#d1d5db', marginBottom: '20px', lineHeight: '1.5' }}>
            Every single action is captured — logins, permission changes, data exports, deletions, and critical security events. 
            Use the filters below to answer questions like <i>"who deleted that task?"</i> or <i>"when did this user's role change?"</i> during a compliance audit.
          </p>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <Filter size={18} color="#6b7280" style={{ marginTop: '5px' }} />
            {['All', 'Auth', 'RBAC', 'Data', 'Security'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{ 
                  background: activeFilter === filter ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)', 
                  border: `1px solid ${activeFilter === filter ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255,255,255,0.1)'}`, 
                  color: activeFilter === filter ? '#a78bfa' : '#9ca3af', 
                  padding: '5px 15px', 
                  borderRadius: '20px', 
                  fontSize: '0.85rem', 
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div style={{ background: 'rgba(20, 20, 25, 0.6)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '50px 2fr 1fr 1fr 1fr', padding: '15px 20px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', color: '#9ca3af', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <div></div>
              <div>Event Action</div>
              <div>Actor</div>
              <div>IP Address</div>
              <div>Timestamp</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredLogs.length === 0 ? (
                <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280' }}>No logs match this filter.</div>
              ) : (
                filteredLogs.map((log, index) => (
                  <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '50px 2fr 1fr 1fr 1fr', padding: '20px', borderBottom: index !== filteredLogs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.02)' } }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {log.icon}
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: '500' }}>
                      {log.action}
                    </div>
                    <div style={{ color: '#d1d5db', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: log.user === 'admin' ? '#8b5cf6' : (log.user === 'system' ? '#10b981' : '#ef4444') }}></div>
                      {log.user}
                    </div>
                    <div style={{ color: '#9ca3af', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                      {log.ip}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                      {log.time}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="fancy-btn" style={{ padding: '10px 20px', height: 'auto', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
              Export CSV <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AuditLogs;
