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
} from "@mui/material";
import { 
  School as SchoolIcon
} from '@mui/icons-material';
import { supabase } from "./supabaseClient";

const UserDashboard = () => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    department: "Loading...",
    enrollment_year: "Loading...",
    phone: "Loading...",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch last updated user data from students table
        const { data: userData, error } = await supabase
          .from("Students")
          .select("name, email, department, enrollment_year, phone")
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        // Set user data
        setUserData({
          name: userData.name,
          email: userData.email,
          department: userData.department,
          enrollment_year: userData.enrollment_year,
          phone: userData.phone,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          name: "Error loading data",
          email: "Error loading data",
          department: "Error loading data",
          enrollment_year: "Error loading data",
          phone: "Error loading data",
        });
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const DashboardCard = ({ title, children }) => (
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
          <SchoolIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 2, fontSize: '2rem' }} />
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
        </Box>

        {/* Dashboard Grid */}
        <Grid container spacing={4} sx={{ px: 2 }}>
          {/* Profile Card */}
          <Grid item xs={12} md={4}>
            <DashboardCard 
              title="Profile Overview"
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
                  {userData.department}
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
                  Email: {userData.email}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.7)'
                  }}
                >
                  Phone: {userData.phone}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.7)'
                  }}
                >
                  Enrolled in: {userData.enrollment_year}
                </Typography>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;
