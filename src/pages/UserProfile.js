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
  Dashboard as DashboardIcon, 
  Analytics as AnalyticsIcon, 
  Settings as SettingsIcon, 
  Help as HelpIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Link as LinkIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { supabase } from "./supabaseClient";

const UserDashboard = () => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    domain: "Loading...",
  });

  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [performance, setPerformance] = useState(0);
  const [repositories, setRepositories] = useState([]);

  // Icons map for different platforms
  const platformIcons = {
    'GitHub': <GitHubIcon />,
    'LinkedIn': <LinkedInIcon />,
    'default': <LinkIcon />
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from socials table
        const { data: userData, error: userError } = await supabase
          .from("socials")
          .select("name, email, domain, skills")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (userError) throw userError;

        // Fetch links from links table
        const { data: linksData, error: linksError } = await supabase
          .from("links")
          .select("*")
          .order("created_at", { ascending: true });

        if (linksError) throw linksError;

        // Set user data
        setUserData({
          name: userData.name,
          email: userData.email,
          domain: userData.domain,
        });

        // Ensure skills is an array, even if it's null or undefined
        const userSkills = Array.isArray(userData.skills) 
          ? userData.skills 
          : (userData.skills ? String(userData.skills).split(',').map(skill => skill.trim()) : []);

        // Set skills 
        setSkills(userSkills);

        // Set quick links from links table
        setQuickLinks(linksData || []);
        
        // Find GitHub link
        const githubLink = linksData.find(link => link.platform === 'GitHub');
        
        if (githubLink) {
          // Fetch GitHub repositories if GitHub link exists
          const githubUsername = githubLink.url.split('/').pop();
          const repoResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
          const reposData = await repoResponse.json();
          
          // Take top 4 repositories, sorted by most recently updated
          const sortedRepos = reposData
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 4);
          
          setRepositories(sortedRepos);
        }
        
        // Generate random performance score
        setPerformance((Math.random() * (5 - 3) + 3).toFixed(2));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData({
          name: "Error loading data",
          email: "Error loading data",
          domain: "Error loading data",
        });
        setSkills([]);
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
              icon={<SchoolIcon />}
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
              {/* GitHub Repositories */}
              <Grid item xs={12}>
                <DashboardCard 
                  title="GitHub Repositories" 
                  icon={<GitHubIcon />}
                >
                  <Grid container spacing={2}>
                    {repositories.length > 0 ? (
                      repositories.map((repo) => (
                        <Grid item xs={6} md={3} key={repo.id}>
                          <Button
                            fullWidth
                            variant="outlined"
                            href={repo.html_url}
                            target="_blank"
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
                            {repo.name}
                          </Button>
                        </Grid>
                      ))
                    ) : (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.6)',
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        No repositories found
                      </Typography>
                    )}
                    {repositories.length > 0 && (
                      <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                          variant="outlined"
                          href={`https://github.com/${repositories[0].owner.login}?tab=repositories`}
                          target="_blank"
                          sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.2)',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.05)',
                              borderColor: 'rgba(255,255,255,0.4)'
                            }
                          }}
                        >
                          View All Repositories
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </DashboardCard>
              </Grid>

              {/* Skills */}
              <Grid item xs={12} md={6}>
                <DashboardCard 
                  title="Skills" 
                  icon={<AnalyticsIcon />}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {skills.length > 0 ? (
                      skills.map((skill, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          size="small"
                          sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.2)',
                            '&:hover': {
                              background: 'rgba(255,255,255,0.05)',
                              borderColor: 'rgba(255,255,255,0.4)'
                            }
                          }}
                        >
                          {skill}
                        </Button>
                      ))
                    ) : (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: 'rgba(255,255,255,0.6)',
                          textAlign: 'center',
                          width: '100%'
                        }}
                      >
                        No skills found
                      </Typography>
                    )}
                  </Box>
                </DashboardCard>
              </Grid>

              {/* Performance */}
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
                    {performance}% Performance
                  </Typography>
                </DashboardCard>
              </Grid>

              {/* Quick Links */}
              <Grid item xs={12}>
                <DashboardCard 
                  title="Quick Links" 
                  icon={<LinkIcon />}
                >
                  <Grid container spacing={2}>
                    {quickLinks.map((link) => (
                      <Grid item xs={6} md={3} key={link.id}>
                        <Button
                          fullWidth
                          variant="outlined"
                          href={link.url}
                          target="_blank"
                          startIcon={
                            platformIcons[link.platform] || platformIcons['default']
                          }
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
                          {link.platform}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </DashboardCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Verification Section */}
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