import React, { useState, useEffect } from "react";
export default function SystemStats() {
  return (
    <div>
      <h1>System STates</h1>
    </div>
  );
}
// import React, { useState, useEffect } from "react";
// import { useAuth } from "../../hooks/useAuth";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "../../components/ui/card";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import { Skeleton } from "../../components/ui/skeleton";

// export default function SystemStats() {
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const api = useAuth();

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setLoading(true);
//         const response = await api.get("/admin/stats");
//         setStats(response.data.stats);
//       } catch (err) {
//         setError("Failed to load system statistics");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, [api]);

//   const chartData = stats
//     ? [
//         { name: "Users", total: stats.totalUsers, active: stats.activeUsers },
//         { name: "Links", total: stats.totalLinks, active: stats.activeLinks },
//         { name: "Messages", total: stats.totalMessages },
//       ]
//     : [];

//   return (
//     <div className="space-y-6">
//       <h2 className="text-3xl font-bold tracking-tight">System Statistics</h2>

//       {error && <div className="text-red-500 mb-4">{error}</div>}

//       {loading ? (
//         <div className="space-y-4">
//           <Skeleton className="h-[300px] w-full" />
//         </div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-3">
//           {/* Summary Cards */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Users</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-4xl font-bold">
//                 {stats?.totalUsers?.toLocaleString() || 0}
//               </div>
//               <p className="text-sm text-gray-500">
//                 Active: {stats?.activeUsers?.toLocaleString() || 0}
//               </p>
//               {stats?.newUsersLastWeek && (
//                 <p className="text-sm text-green-500">
//                   +{stats.newUsersLastWeek.toLocaleString()} this week
//                 </p>
//               )}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Message Links</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-4xl font-bold">
//                 {stats?.totalLinks?.toLocaleString() || 0}
//               </div>
//               <p className="text-sm text-gray-500">
//                 Active: {stats?.activeLinks?.toLocaleString() || 0}
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Messages</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="text-4xl font-bold">
//                 {stats?.totalMessages?.toLocaleString() || 0}
//               </div>
//               {stats?.messagesLastWeek && (
//                 <p className="text-sm text-green-500">
//                   +{stats.messagesLastWeek.toLocaleString()} this week
//                 </p>
//               )}
//             </CardContent>
//           </Card>

//           {/* Chart */}
//           <div className="md:col-span-3">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Activity Overview</CardTitle>
//               </CardHeader>
//               <CardContent className="h-[400px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="total" fill="#8884d8" name="Total" />
//                     <Bar dataKey="active" fill="#82ca9d" name="Active" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
