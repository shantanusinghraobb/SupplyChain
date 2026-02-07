import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const monthlyData = [
  { name: "Jan", revenue: 120, orders: 45 },
  { name: "Feb", revenue: 90, orders: 38 },
  { name: "Mar", revenue: 150, orders: 52 },
  { name: "Apr", revenue: 200, orders: 68 },
  { name: "May", revenue: 180, orders: 61 },
  { name: "Jun", revenue: 220, orders: 75 },
];

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Food", value: 200 },
  { name: "Books", value: 150 },
];

const stats = [
  {
    title: "Total Revenue",
    value: "$12,560",
    change: "+15.3%",
    icon: <AttachMoneyIcon sx={{ fontSize: 32 }} />,
    color: "#4caf50",
    bgColor: "#e8f5e9",
  },
    {
    title: "Total Purchase",
    value: "23.4%",
    change: "+5.1%",
    icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
    color: "#9c27b0",
    bgColor: "#f3e5f5",
  },
  {
    title: "Total Orders",
    value: "1,234",
    change: "+8.2%",
    icon: <ShoppingCartIcon sx={{ fontSize: 32 }} />,
    color: "#2196f3",
    bgColor: "#e3f2fd",
  },
  {
    title: "Active Users",
    value: "892",
    change: "+12.5%",
    icon: <PeopleIcon sx={{ fontSize: 32 }} />,
    color: "#ff9800",
    bgColor: "#fff3e0",
  },
  {
    title: "Growth Rate",
    value: "23.4%",
    change: "+5.1%",
    icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
    color: "#9c27b0",
    bgColor: "#f3e5f5",
  },
];

export default function Dashboard() {
  return (
    <Box
      sx={{
        p: 2,
        width: "100%",
        maxWidth: "100%",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#333",
          fontWeight: 700,
          mb: 3,
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
        }}
      >
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid
        container
        spacing={2}
        sx={{ mb: 3, width: "100%", maxWidth: "100%" }}
      >
        {stats.map((stat, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={3}
            key={index}
            sx={{ display: "flex" }}
          >
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                transition: "all 0.3s ease",
                width: "100%",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 1 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#4caf50",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: stat.bgColor,
                      borderRadius: "50%",
                      p: 1.5,
                      color: stat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid
        container
        spacing={2}
        sx={{ width: "100%", maxWidth: "100%" }}
      >
        {/* Monthly Revenue Chart */}
        <Grid item xs={12} lg={7} sx={{ display: "flex" }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              width: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#1976d2", fontWeight: 600, mb: 2 }}
              >
                Monthly Revenue & Orders
              </Typography>

              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" fontSize={12} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1976d2"
                    strokeWidth={3}
                    dot={{ fill: "#1976d2", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#4caf50"
                    strokeWidth={3}
                    dot={{ fill: "#4caf50", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Sales Chart */}
        <Grid item xs={12} lg={5} sx={{ display: "flex" }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              width: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#1976d2", fontWeight: 600, mb: 2 }}
              >
                Sales by Category
              </Typography>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" fontSize={11} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="value" fill="#1976d2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} sx={{ display: "flex" }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              width: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#1976d2", fontWeight: 600, mb: 2 }}
              >
                Recent Activity
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {[
                  { action: "New order placed", time: "2 minutes ago", color: "#4caf50" },
                  { action: "User registration", time: "15 minutes ago", color: "#2196f3" },
                  { action: "Payment received", time: "1 hour ago", color: "#ff9800" },
                  { action: "Product shipped", time: "2 hours ago", color: "#9c27b0" },
                ].map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      backgroundColor: "#fafafa",
                      borderRadius: 2,
                      borderLeft: `4px solid ${activity.color}`,
                    }}
                  >
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight={500}>
                        {activity.action}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontSize="0.875rem"
                      >
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5} sx={{ display: "flex" }}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              width: "100%",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "#1976d2", fontWeight: 600, mb: 2 }}
              >
                Purchase by Category
              </Typography>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" fontSize={11} />
                  <YAxis stroke="#666" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="value" fill="#1976d2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
