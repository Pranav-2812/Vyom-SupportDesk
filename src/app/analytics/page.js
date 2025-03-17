import React from "react";
import AnalyticsDashboard from "./ChartPage";

const fetchAnalytics = async (endpoint ) => {
  try {
    const res = await fetch(`https://sggsapp.co.in/vyom/admin/${endpoint}`, {
      cache: "no-store", // Always fetch fresh data
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
};

const Dashboard = async () => {
  const [ticketCategories, urgencyLevels, supportModes, ticketStatus, totalTickets, highRiskCustomers] = await Promise.all([
    fetchAnalytics("analytics_tickets_by_catrgories.php"),
    fetchAnalytics("analytics_tickets_by_urgency_level.php"),
    fetchAnalytics("analytics_support_mode_preference.php"),
    fetchAnalytics("analytics_ticket_by_status.php"),
    fetchAnalytics("analytics_total_ticket_count.php"),
    fetchAnalytics("analytics_high_risk_customer.php"),
  ]);

  return (
    <div className="w-3/4 flex flex-col items-center p-6 space-y-6">
      <h1 className="text-2xl font-bold">Tickets Analytics Dashboard</h1>
      <AnalyticsDashboard
        ticketCategories={ticketCategories}
        urgencyLevels={urgencyLevels}
        supportModes={supportModes}
        ticketStatus={ticketStatus}
        totalTickets={totalTickets}
        highRiskCustomers={highRiskCustomers}
      />
    </div>
  );
};

export default Dashboard;
