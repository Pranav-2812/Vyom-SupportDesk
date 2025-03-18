"use client";
import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent } from "@/components/Card"; // Use Tailwind Card component

const Charts = ({
  ticketCategories,
  urgencyLevels,
  supportModes,
  ticketStatus,
  totalTickets,
  highRiskCustomers,
  languageWise,
  agentData
}) => {
  useEffect(() => {
    document.title = "Analytics - Vyom Assist";
  }, []);
  console.log(agentData);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6384"];
  return (
    <div className="w-11/12  flex flex-col gap-6 h-[800px] overflow-y-auto hide">
      <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Tickets Resolved by Agents</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={agentData}>
            <XAxis dataKey="name" className="text-xs font-bold" />
            <YAxis domain={[0, Math.max(...agentData.map(item => item.resolved_tickets_count))]} />
            <Tooltip />
            <Bar dataKey="resolved_tickets_count" fill="#8784d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Agent Ratings</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={agentData.map((item) => ({
                  name: item.name,
                  value: Number(item.rating),
                }))}
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={(entry) => entry.name}
              >
                {agentData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Tickets by Category</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={ticketCategories.map((item) => ({
                ...item,
                ticket_count: Number(item.ticket_count),
              }))}
            >
              <XAxis
                dataKey="category"
                angle={0}
                interval={0}
                className="text-xs font-bold"
              />
              <YAxis
                domain={[
                  0,
                  Math.max(
                    ...ticketCategories.map((item) => Number(item.ticket_count))
                  ),
                ]}
              />
              <Tooltip />

              <Bar dataKey="ticket_count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 📊 Tickets by Urgency (Pie Chart) */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Tickets by Urgency</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={urgencyLevels.map((item) => ({
                  ...item,
                  count: Number(item.count),
                }))} // Convert count to number
                dataKey="count"
                nameKey="urgency_level"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {urgencyLevels.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#ff6666", "#ffcc66", "#66ccff", "#66ff66"][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 📊 Support Mode Preference (Bar Chart) */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Support Mode Preference</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={supportModes.map((item) => ({
                ...item,
                count: Number(item.count), // Convert to number
                preferred_support_mode:
                  item.preferred_support_mode || "Unknown", // Handle empty values
              }))}
            >
              <XAxis dataKey="preferred_support_mode" className="font-bold" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 📊 Ticket Status (Pie Chart) */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Ticket Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ticketStatus.map((item) => ({
                  ...item,
                  count: Number(item.count),
                }))}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {ticketStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 📊 Total Tickets (Line Chart) */}
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">
            Total Ticket Count Over Time
          </h2>
          <ResponsiveContainer width="100%" height={250} >
            <LineChart
              data={totalTickets.map((item) => ({
                ...item,
                date: new Date(item.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }),
              }))}
              
            >
              <XAxis
                dataKey="date"
                className="font-bold mt-2 text-sm"
                style={{ marginTop: "2%" }}
              />
              <YAxis
                domain={[
                  0,
                  Math.max(
                    ...totalTickets.map((item) => Number(item.total_tickets))
                  ),
                ]}
              />
              <Tooltip />
              <Legend />
              <CartesianGrid stroke="#ccc" />
              <Line
                type="monotone"
                dataKey="total_tickets"
                stroke="#007bff"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Tickets by Language</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={languageWise.map((item) => ({
                  ...item,
                  ticket_count: Number(item.ticket_count),
                }))} // Convert count to number
                dataKey="ticket_count"
                nameKey="language_preference"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#87ca9d"
                label
              >
                {languageWise?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      ["#ff6666", "#ffcc66", "#66ccff", "#66ff66"][index % 4]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};

export default Charts;
