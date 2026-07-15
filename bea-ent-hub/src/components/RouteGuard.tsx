import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ROLE_NAV_ACCESS, useApp } from '../state/AppContext';
import AccessDenied from './AccessDenied';

export const RequireSession: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export const RequireNavAccess: React.FC<{ navId: string; children: React.ReactNode }> = ({ navId, children }) => {
  const { currentUser, logAudit } = useApp();
  const access = currentUser ? ROLE_NAV_ACCESS[currentUser.role] : [];
  const allowed = access.includes('*') || access.includes(navId);

  useEffect(() => {
    if (!allowed && currentUser) {
      logAudit({
        id: `al-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: currentUser.name,
        role: currentUser.role,
        action: `Attempted access: ${navId}`,
        result: 'BLOCKED',
        node: navId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navId, allowed]);

  if (!allowed) return <AccessDenied node={navId} />;
  return <>{children}</>;
};
