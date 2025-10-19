import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import AdminDashboardDesktop from './admindashboard/AdminDashboardDesktop';

export default function AdminDashboard() {
  const { isMobile } = useResponsive();

  // For now, render desktop version. Mobile version can be added later if needed
  return <AdminDashboardDesktop />;
}
