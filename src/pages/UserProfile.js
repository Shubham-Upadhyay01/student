
import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Divider,
  Modal,
  TextField,
} from "@mui/material";
import { 
  Dashboard as DashboardIcon, 
  Analytics as AnalyticsIcon, 
  Settings as SettingsIcon, 
  Help as HelpIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  AccountBalance as AccountBalanceIcon,
  WorkOutline as WorkOutlineIcon
} from '@mui/icons-material';
import { supabase } from "./supabaseClient";

const UserDashboard = () => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    domain: "Loading...",
  });

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [performance, setPerformance] = useState(0);
  const [newNotificationsCount, setNewNotificationsCount] = useState(0);

  useEffect(() => {
    // Generate random data for notifications, events, etc.
    const generateRandomNotifications = () => {
      const notificationTypes = [
        "Project Update", 
        "New Milestone", 
        "Team Achievement", 
        "Deadline Reminder", 
        "Performance Insight"
      ];
      const count = Math.floor(Math.random() * 5) + 1;
      const generated = Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        title: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
        message: `Random notification message ${index + 1}`,
        time: `${Math.floor(Math.random() * 24)} hours ago`
      }));
      setNotifications(generated);
      setNewNotificationsCount(count);
    };

    const generateRandomEvents = () => {
      const eventTypes = [
        "Team Strategy Meeting",
        "Quarterly Review", 
        "Project Kickoff", 
        "Client Presentation", 
        "Training Session"
      ];
      const count = Math.floor(Math.random() * 3) + 1;
      const generated = Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        title: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        date: `${['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][Math.floor(Math.random() * 5)]}, Dec ${Math.floor(Math.random() * 31) + 1}`,
        time: `${Math.floor(Math.random() * 12) + 1}:${Math.floor(Math.random() * 60)} ${Math.random() > 0.5 ? 'AM' : 'PM'}`
      }));
      setUpcomingEvents(generated);
    };

    const generateRandomLinks = () => {
      const linkTypes = [
        "Project Dashboard",
        "Resource Center", 
        "Team Collaboration", 
        "Performance Metrics", 
        "Learning Portal"
      ];
      const count = Math.floor(Math.random() * 5) + 1;
      const generated = Array.from({ length: count }, (_, index) => ({
        id: index + 1,
        title: linkTypes[Math.floor(Math.random() * linkTypes.length)]
      }));
      setQuickLinks(generated);
    };

    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase
          .from("socials")
          .select("name, email, domain")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        setUserData({
          name: data.name,
          email: data.email,
          domain: data.domain,
        });
        
        // Generate random data after successful user data fetch
        generateRandomNotifications();
        generateRandomEvents();
        generateRandomLinks();
        setPerformance((Math.random() * (5 - 3) + 3).toFixed(2));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          name: "Error loading data",
          email: "Error loading data",
          domain: "Error loading data",
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const DashboardCard = ({ title, icon, children }) => (
    <Card 
      sx={{ 
        background: 'linear-gradient(to bottom, #1c1c1c, #121212)',
        borderRadius: '12px',
        color: 'white',
        height: '100%',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.02)',
        }
      }}
      elevation={0}
    >
      <CardContent>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          color: 'rgba(255,255,255,0.7)'
        }}>
          {React.cloneElement(icon, { 
            sx: { 
              color: 'rgba(255,255,255,0.7)', 
              mr: 2,
              fontSize: '2rem'
            } 
          })}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: '600',
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.5px'
            }}
          >
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: 'linear-gradient(to right, #141414, #000000)',
          color: "white",
        }}
      >
        <CircularProgress color="inherit" size={80} thickness={2} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: 'linear-gradient(to right, #141414, #000000)',
        color: "white",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Dashboard Header */}
        <Box 
          sx={{
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            mb: 4,
            px: 2,
          }}
        >
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: '700',
                color: 'rgba(255,255,255,0.9)',
                mb: 1,
                letterSpacing: '-1px'
              }}
            >
              Dashboard
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.6)',
                fontWeight: '300'
              }}
            >
              Welcome back, {userData.name}
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }}
              >
                {userData.name[0].toUpperCase()}
              </Avatar>
            }
            sx={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              borderRadius: '25px',
              px: 3,
              py: 1,
              fontWeight: '500',
              '&:hover': {
                background: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.5)'
              }
            }}
          >
            Edit Profile
          </Button>
        </Box>

        {/* Dashboard Grid */}
        <Grid container spacing={4} sx={{ px: 2 }}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <DashboardCard 
              title="Profile Overview" 
              icon={<AccountBalanceIcon />}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    mb: 2, 
                    border: '2px solid rgba(255,255,255,0.2)',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  {userData.name[0].toUpperCase()}
                </Avatar>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.9)',
                    mb: 1 
                  }}
                >
                  {userData.name}
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(255,255,255,0.6)',
                    mb: 2 
                  }}
                >
                  {userData.domain}
                </Typography>
                <Divider 
                  sx={{ 
                    my: 2, 
                    width: '100%', 
                    background: 'rgba(255,255,255,0.1)' 
                  }} 
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.7)'
                  }}
                >
                  {userData.email}
                </Typography>
              </Box>
            </DashboardCard>
          </Grid>

          {/* Right Side Columns */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {/* Quick Actions */}
              <Grid item xs={12}>
                <DashboardCard 
                  title="Quick Actions" 
                  icon={<DashboardIcon />}
                >
                  <Grid container spacing={2}>
                    {[
                      { icon: <AnalyticsIcon />, label: 'Analytics' },
                      { icon: <SettingsIcon />, label: 'Settings' },
                      { icon: <HelpIcon />, label: 'Support' },
                      { icon: <WorkOutlineIcon />, label: 'Projects' }
                    ].map((action) => (
                      <Grid item xs={6} md={3} key={action.label}>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={action.icon}
                          sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.2)',
                            justifyContent: 'flex-start',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.05)',
                              borderColor: 'rgba(255,255,255,0.4)'
                            }
                          }}
                        >
                          {action.label}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </DashboardCard>
              </Grid>

              {/* Performance & Notifications */}
              <Grid item xs={12} md={6}>
                <DashboardCard 
                  title="Performance" 
                  icon={<TrendingUpIcon />}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'rgba(255,255,255,0.6)' 
                    }}
                  >
                    {(Math.random() * (5 - 3) + 3).toFixed(2)}% Performance
                  </Typography>
                </DashboardCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <DashboardCard 
                  title="Notifications" 
                  icon={<NotificationsIcon />}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'rgba(255,255,255,0.6)' 
                    }}
                  >
                    {Math.floor(Math.random() * 5)} New Notifications
                  </Typography>
                </DashboardCard>
              </Grid>

              {/* Future Expandable Cards */}
              <Grid item xs={12} md={6}>
                <DashboardCard 
                  title="Upcoming Events" 
                  icon={<WorkOutlineIcon />}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'rgba(255,255,255,0.6)' 
                    }}
                  >
                    {Math.floor(Math.random() * 3)} Upcoming Events
                  </Typography>
                </DashboardCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <DashboardCard 
                  title="Quick Links" 
                  icon={<SettingsIcon />}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      textAlign: 'center', 
                      color: 'rgba(255,255,255,0.6)' 
                    }}
                  >
                    {Math.floor(Math.random() * 5)} Quick Links
                  </Typography>
                </DashboardCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Box
        sx={{
          background: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          mt: 4,
          px: 3,
          py: 4,
          textAlign: "center",
          mx: 2,
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.4)",
          },
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "rgba(255,255,255,0.9)",
            fontWeight: "600",
            mb: 2,
            letterSpacing: "0.5px",
          }}
        >
          Let's get you verified!
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "rgba(255,255,255,0.7)",
            mb: 3,
            fontWeight: "400",
          }}
        >
          Verification helps us ensure your account is secure and trusted.
        </Typography>
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #ff7e5f, #feb47b)",
            color: "white",
            px: 4,
            py: 1,
            borderRadius: "24px",
            fontWeight: "600",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              background: "linear-gradient(to right, #feb47b, #ff7e5f)",
            },
          }}
        >
          Stake to Verify
        </Button>
      </Box>
    </Box>
  );
};

export default UserDashboard;