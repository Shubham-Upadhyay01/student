import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Chip, 
  Grid,
  Button,
  Divider,
  TextField,
  InputAdornment
} from "@mui/material";
import { motion } from 'framer-motion';
import { 
  WorkOutline as WorkIcon, 
  Search as SearchIcon,
  List as ListIcon
} from '@mui/icons-material';

const SkillsDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const skills = [
    'Java', 'Python', 'JavaScript', 'Data Analyst', 
    'Content Writers', 'React', 'Angular', 'Node.js', 
    'SQL and NoSQL', 'API Development', 'Kotlin', 'Swift'
  ];

  const filteredSkills = skills.filter(skill => 
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box 
      sx={{
        minHeight: '100vh', 
        background: '#f4f6f9',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Page Header */}
      <Box 
        sx={{
          backgroundColor: '#ffffff',
          py: 3,
          px: 4,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ListIcon sx={{ color: '#2c3e50', fontSize: 32 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              color: '#2c3e50', 
              fontWeight: 600,
              letterSpacing: 1
            }}
          >
            Skills Dashboard
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
            {/* Skills Search Card */}
            <Grid item xs={12} md={8}>
              <Card 
                sx={{ 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                  borderRadius: 2 
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <WorkIcon sx={{ mr: 2, color: '#2c3e50' }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Skill Search
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 3 }} />

                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Search skills"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2
                        }
                      }}
                    />
                  </Box>

                  <Grid container spacing={2}>
                    {filteredSkills.map((skill) => (
                      <Grid item xs={6} md={4} key={skill}>
                        <Chip 
                          label={skill} 
                          variant="outlined"
                          color="primary"
                          sx={{ 
                            width: '100%', 
                            justifyContent: 'center',
                            fontSize: '1rem',
                            py: 1
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions Card */}
            <Grid item xs={12} md={4}>
              <Card 
                sx={{ 
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
                  borderRadius: 2,
                  height: '100%' 
                }}
              >
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<WorkIcon />}
                      sx={{ 
                        backgroundColor: '#2c3e50',
                        '&:hover': { backgroundColor: '#34495e' }
                      }}
                    >
                      Find Jobs
                    </Button>
                    
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<SearchIcon />}
                      sx={{ 
                        borderColor: '#2c3e50',
                        color: '#2c3e50',
                        '&:hover': { 
                          backgroundColor: 'rgba(44,62,80,0.1)',
                          borderColor: '#2c3e50' 
                        }
                      }}
                    >
                      Advanced Search
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SkillsDashboard;