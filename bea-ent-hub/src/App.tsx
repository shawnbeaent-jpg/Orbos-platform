import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './state/AppContext';
import Layout from './components/Layout';
import { RequireNavAccess, RequireSession } from './components/RouteGuard';
import LoginView from './views/LoginView';
import Dashboard from './views/Dashboard';
import CampaignArchitect from './views/CampaignArchitect';
import IndieRoadmap from './views/IndieRoadmap';
import ProducerConsole from './views/ProducerConsole';
import OutreachCRM from './views/OutreachCRM';
import NetworkingView from './views/NetworkingView';
import BookingsView from './views/BookingsView';
import LogisticsView from './views/LogisticsView';
import ArtistVault from './views/ArtistVault';
import FinancialsView from './views/FinancialsView';
import LegalFoundationModule from './views/LegalFoundationModule';
import MarketsView from './views/MarketsView';
import ChatView from './views/ChatView';
import ProfileView from './views/ProfileView';
import ManagerSettings from './views/ManagerSettings';
import SubscriptionVault from './views/SubscriptionVault';
import AdminBackend from './views/AdminBackend';
import SystemDebugger from './views/SystemDebugger';

const ROUTES: { navId: string; path: string; element: React.ReactNode }[] = [
  { navId: 'dashboard', path: 'dashboard', element: <Dashboard /> },
  { navId: 'campaign-architect', path: 'campaign-architect', element: <CampaignArchitect /> },
  { navId: 'indie-roadmap', path: 'indie-roadmap', element: <IndieRoadmap /> },
  { navId: 'producer-console', path: 'producer-console', element: <ProducerConsole /> },
  { navId: 'outreach-crm', path: 'outreach-crm', element: <OutreachCRM /> },
  { navId: 'networking', path: 'networking', element: <NetworkingView /> },
  { navId: 'bookings', path: 'bookings', element: <BookingsView /> },
  { navId: 'logistics', path: 'logistics', element: <LogisticsView /> },
  { navId: 'artist-vault', path: 'artist-vault', element: <ArtistVault /> },
  { navId: 'financials', path: 'financials', element: <FinancialsView /> },
  { navId: 'legal', path: 'legal', element: <LegalFoundationModule /> },
  { navId: 'markets', path: 'markets', element: <MarketsView /> },
  { navId: 'chat', path: 'chat', element: <ChatView /> },
  { navId: 'profile', path: 'profile', element: <ProfileView /> },
  { navId: 'manager-settings', path: 'manager-settings', element: <ManagerSettings /> },
  { navId: 'subscription-vault', path: 'subscription-vault', element: <SubscriptionVault /> },
  { navId: 'admin-backend', path: 'admin-backend', element: <AdminBackend /> },
  { navId: 'system-debugger', path: 'system-debugger', element: <SystemDebugger /> },
];

const App: React.FC = () => (
  <AppProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route
          path="/app"
          element={
            <RequireSession>
              <Layout />
            </RequireSession>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          {ROUTES.map(({ navId, path, element }) => (
            <Route key={navId} path={path} element={<RequireNavAccess navId={navId}>{element}</RequireNavAccess>} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </AppProvider>
);

export default App;
