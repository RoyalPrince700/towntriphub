import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import UserDashboardDesktop from './UserDashboardDesktop';
import UserDashboardMobile from './UserDashboardMobile';

export default function UserDashboard() {
  const { isMobile } = useResponsive();

  // Render mobile version for mobile and tablet, desktop version for larger screens
  return isMobile ? <UserDashboardMobile /> : <UserDashboardDesktop />;
}


