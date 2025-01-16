import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Divider, 
  Chip,
  useMediaQuery, 
  useTheme,
  Alert,
  Snackbar 
} from "@mui/material";
import { motion } from 'framer-motion';
import { 
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import { useLocation } from "react-router-dom";
import supabase from './supabaseClient';

const VerifierDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  
  const [currentFaculty, setCurrentFaculty] = useState(location.state);
  const [allFaculty, setAllFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faculty')
        .select('*');

      if (error) throw error;

      setAllFaculty(data);
    } catch (err) {
      console.error('Error fetching faculty data:', err);
      setError('Failed to load faculty data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: '#f4f6f9' 
      }}>
        <Typography variant="h5">Loading faculty data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f4f6f9', display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <Box sx={{ 
        backgroundColor: '#ffffff', 
        py: 3, 
        px: 4, 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DashboardIcon sx={{ color: '#2c3e50', fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 600, letterSpacing: 1 }}>
            Faculty Dashboard
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3}>
            {/* Current Faculty Info Card */}
            <Grid item xs={12}>
              <Card sx={{ 
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                borderRadius: 2,
                mb: 4,
                bgcolor: '#1976d2',
                color: 'white'
              }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Welcome, {currentFaculty?.name}!
                  </Typography>
                  <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.2)' }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SchoolIcon />
                        <Typography>Department: {currentFaculty?.department}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon />
                        <Typography>Email: {currentFaculty?.email}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WorkIcon />
                        <Typography>Designation: {currentFaculty?.designation}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* All Faculty List */}
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                All Faculty Members
              </Typography>
              <Grid container spacing={3}>
                {allFaculty.map((faculty) => (
                  <Grid item xs={12} sm={6} md={4} key={faculty.id}>
                    <Card sx={{ 
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                      borderRadius: 2,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          {faculty.name}
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="body1">
                            <EmailIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            {faculty.email}
                          </Typography>
                          <Typography variant="body1">
                            <SchoolIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            {faculty.department}
                          </Typography>
                          <Typography variant="body1">
                            <WorkIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            {faculty.designation}
                          </Typography>
                        </Box>
                        <Chip 
                          label={faculty.department} 
                          color="primary" 
                          sx={{ mt: 2 }}
                          size="small"
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerifierDashboard;