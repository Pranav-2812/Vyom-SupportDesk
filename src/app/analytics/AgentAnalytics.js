import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const AgentAnalyticsDashboard = ({
  ticketCategories,

  supportModes,
  ticketStatus,
  totalTickets,
  customerSatisfaction
}) => {
  // Define different color schemes for agent charts
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];
  
  // Format ticket categories data for visualization
  const formattedTicketCategories = ticketCategories.map(item => ({
    name: item.category_name,
    value: parseInt(item.ticket_count)
  }));

  // Format urgency levels data


  // Format support modes data
  const formattedSupportModes = supportModes.map(item => ({
    name: item.support_mode,
    value: parseInt(item.ticket_count)
  }));

  // Format ticket status data
  const formattedTicketStatus = ticketStatus.map(item => ({
    name: item.status,
    value: parseInt(item.ticket_count)
  }));

  // Format customer satisfaction data
  const formattedCustomerSatisfaction = customerSatisfaction?.map(item => ({
    name: item.rating_level,
    value: parseInt(item.count)
  })) || [];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Total Tickets Card */}
      <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Total Tickets Handled</h2>
        <div className="flex items-center justify-center">
          <div className="text-5xl font-bold text-blue-600">
            {totalTickets[0]?.total_tickets || 0}
          </div>
        </div>
      </div>

      {/* Ticket Categories */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tickets by Category</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedTicketCategories}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      

      {/* Support Modes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Support Mode Preferences</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedSupportModes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ticket Status */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Tickets by Status</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={formattedTicketStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {formattedTicketStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className="bg-white p-6 rounded-lg shadow-md col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Customer Satisfaction Ratings</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedCustomerSatisfaction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#ff7300" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AgentAnalyticsDashboard;