import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import UserDashboardDesktop from './UserDashboardDesktop';
import UserDashboardMobile from './UserDashboardMobile';

export default function UserDashboard() {
  const { isMobileOrTablet } = useResponsive();

  // Render mobile-first layout for phones and tablets, desktop for larger screens
  return isMobileOrTablet ? <UserDashboardMobile /> : <UserDashboardDesktop />;
}
