import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Paper,
  Alert
} from "@mui/material";
import {
  School as SchoolIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';
import supabase from "./supabaseClient";

const UserDashboard = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    department: "",
    enrollment_year: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch the first student record without ordering by ID
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .limit(1)
          .single();

        if (error) {
          console.error("Supabase error:", error);
          setError(error.message);
          return;
        }

        if (data) {
          console.log("Fetched data:", data);
          setUserData({
            name: data.name || 'N/A',
            email: data.email || 'N/A',
            department: data.department || 'N/A',
            enrollment_year: data.enrollment_year || 'N/A',
            phone: data.phone || 'N/A',
          });
        } else {
          setError("No student data found");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const InfoCard = ({ icon: Icon, title, value }) => (
    <Card
      sx={{
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ color: 'primary.main', fontSize: 28, mr: 1 }} />
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 500 }}>
          {value}
        </Typography>
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
          background: 'linear-gradient(45deg, #1a1a1a, #2d2d2d)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: 'linear-gradient(45deg, #1a1a1a, #2d2d2d)',
        pt: 8,
        pb: 6
      }}
    >
      <Container maxWidth="lg">
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: 'white',
              '& .MuiAlert-icon': {
                color: 'white'
              }
            }}
          >
            {error}
          </Alert>
        )}
        
        {/* Header Section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              margin: '0 auto',
              mb: 3,
              bgcolor: 'primary.main',
              border: '4px solid rgba(255,255,255,0.2)',
              fontSize: '3rem'
            }}
          >
            {userData.name?.[0]?.toUpperCase() || '?'}
          </Avatar>
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'white',
              fontWeight: 700,
              mb: 1
            }}
          >
            {userData.name}
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255,255,255,0.6)',
              fontWeight: 400
            }}
          >
            Student Profile
          </Typography>
        </Box>

        {/* Info Cards Grid */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={4}>
            <InfoCard
              icon={BadgeIcon}
              title="Department"
              value={userData.department}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoCard
              icon={EmailIcon}
              title="Email Address"
              value={userData.email}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <InfoCard
              icon={PhoneIcon}
              title="Phone Number"
              value={userData.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoCard
              icon={CalendarIcon}
              title="Enrollment Year"
              value={userData.enrollment_year}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoCard
              icon={SchoolIcon}
              title="Student Status"
              value="Active"
            />
          </Grid>
        </Grid>

        {/* Additional Info Section */}
        <Paper
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'white',
              mb: 3,
              fontWeight: 600
            }}
          >
            Academic Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                  Department
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {userData.department}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                  Enrollment Year
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {userData.enrollment_year}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {userData.email}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                  Phone Number
                </Typography>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {userData.phone}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default UserDashboard;