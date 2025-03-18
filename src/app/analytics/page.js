"use client";

import React, { useState, useEffect } from "react";
import AnalyticsDashboard from "./ChartPage";
import AgentAnalyticsDashboard from "./AgentAnalytics"; // Assumed component for agent-specific analytics

// Client component that determines which dashboard to show
export default function DashboardWrapper() {
  const [isAgent, setIsAgent] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    ticketCategories: [],
    urgencyLevels: [],
    supportModes: [],
    ticketStatus: [],
    totalTickets: [],
    highRiskCustomers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for agentId
    const agentId = localStorage.getItem("agentId");
    setIsAgent(agentId === "1");
    
    // Fetch analytics based on the agent type
    fetchAnalyticsData(agentId === "1");
  }, []);

  const fetchAnalyticsData = async (isAgentOne) => {
    setLoading(true);
    try {
      let endpoints;
      
      if (isAgentOne) {
        // Agent with ID 1 gets these endpoints
        endpoints = {
          ticketCategories: "admin/analytics_tickets_by_catrgories.php",
          urgencyLevels: "admin/analytics_tickets_by_urgency_level.php",
          supportModes: "admin/analytics_support_mode_preference.php",
          ticketStatus: "admin/analytics_ticket_by_status.php",
          totalTickets: "admin/analytics_total_ticket_count.php",
          highRiskCustomers: "admin/analytics_high_risk_customer.php",
          languageWise:"admin/tickets_by_language_count.php",
          agentData:"admin/get_all_agents_data.php"
        };
      } else {
        // Other agents get different endpoints
        endpoints = {
          categorywise: `agents/categorywise_ticket_resolved.php?agent_id=${localStorage.getItem("agentId")}`,
          supportModes: `agents/supportmodewise_ticket_resolved.php?agent_id=${localStorage.getItem("agentId")}`,
          status: `agents/assigned_by_status.php?agent_id=${localStorage.getItem("agentId")}`,
          ticketByLanguage: `agents/tickets_by_language_agentwise.php?agent_id=${localStorage.getItem("agentId")}`,
          
          
        };
      }
      
      // Fetch all data in parallel
      const results = await Promise.all(
        Object.entries(endpoints).map(async ([key, endpoint]) => {
          const data = await fetchAnalytics(endpoint);
          return { key, data };
        })
      );
      
      // Organize the results into an object
      const organizedData = results.reduce((acc, { key, data }) => {
        acc[key] = data;
        return acc;
      }, {});
      
      setAnalyticsData(organizedData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (endpoint) => {
    try {
      const res = await fetch(`https://sggsapp.co.in/vyom/${endpoint}`, {
        cache: "no-store", // Always fetch fresh data
      });
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="w-3/4 flex justify-center items-center h-[600px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-3/4 flex flex-col items-center p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        {isAgent ? "Admin Analytics Dashboard" : "Agent Analytics Dashboard"}
      </h1>
      
      {isAgent ? (
        <AnalyticsDashboard
          ticketCategories={analyticsData.ticketCategories}
          languageWise={analyticsData.languageWise}
          supportModes={analyticsData.supportModes}
          ticketStatus={analyticsData.ticketStatus}
          totalTickets={analyticsData.totalTickets}
          urgencyLevels={analyticsData.urgencyLevels}
          agentData={analyticsData.agentData}
        />
      ) : (
        <AgentAnalyticsDashboard
          categorywise={analyticsData.categorywise}
          supportModes={analyticsData.supportModes}
          status={analyticsData.status}
          ticketByLanguage={analyticsData.ticketByLanguage}
          
        />
      )}
    </div>
  );
}