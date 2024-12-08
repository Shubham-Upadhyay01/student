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
  useTheme 
} from "@mui/material";
import { motion } from 'framer-motion';
import { 
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useLocation } from "react-router-dom";

const VerifierDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation();
  
  const [verifier, setVerifier] = useState(location.state);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    // Dummy data for candidates
    const dummyCandidates = [
      { id: 1, name: 'John Doe', email: 'john@example.com', domain: 'AI' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', domain: 'Data Science' },
      { id: 3, name: 'Alice Johnson', email: 'alice@example.com', domain: 'Software Engineering' },
      { id: 4, name: 'Bob Brown', email: 'bob@example.com', domain: 'Machine Learning' },
      { id: 5, name: 'Charlie White', email: 'charlie@example.com', domain: 'Web Development' }
    ];

    // Setting the dummy candidates
    setCandidates(dummyCandidates);
  }, []);

  if (!verifier) {
    return <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>;
  }

  return (
    <Box sx={{ minHeight: '100vh', background: '#f4f6f9', display: 'flex', flexDirection: 'column' }}>
      {/* Page Header */}
      <Box sx={{ backgroundColor: '#ffffff', py: 3, px: 4, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <DashboardIcon sx={{ color: '#2c3e50', fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: '#2c3e50', fontWeight: 600, letterSpacing: 1 }}>
            Verifier Dashboard
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Grid container spacing={3}>
            {/* Verifier Info Card */}
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Verifier Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Name: {verifier.name}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Email: {verifier.email}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Domain: {verifier.domain}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Candidates Awaiting Verification */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                Candidates Awaiting Verification
              </Typography>
              {candidates.length > 0 ? (
                <Grid container spacing={3}>
                  {candidates.map((candidate) => (
                    <Grid item xs={12} sm={6} md={4} key={candidate.id}>
                      <Card sx={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {candidate.name}
                          </Typography>
                          <Typography variant="body1">{candidate.email}</Typography>
                          <Chip label={candidate.domain} color="primary" sx={{ mt: 2 }} />
                          <Box sx={{ mt: 3 }}>
                            <Button variant="contained" color="primary" fullWidth>
                              Verify
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No candidates awaiting verification at the moment.
                </Typography>
              )}
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VerifierDashboard;
