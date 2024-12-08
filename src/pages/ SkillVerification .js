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
  Checkbox,
} from "@mui/material";
import { supabase } from "./supabaseClient";

const SkillVerification = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch skills from the API
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase.from("skills").select("*");
        if (error) throw error;
        setSkills(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching skills:", error);
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const handleVerification = async (skillId, status) => {
    try {
      const { error } = await supabase
        .from("skills")
        .update({ verified: status })
        .eq("id", skillId);

      if (error) throw error;

      // Update local state
      setSkills((prevSkills) =>
        prevSkills.map((skill) =>
          skill.id === skillId ? { ...skill, verified: status } : skill
        )
      );
    } catch (error) {
      console.error("Error updating skill verification:", error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(to right, #141414, #000000)",
          color: "white",
        }}
      >
        <CircularProgress color="inherit" size={80} thickness={2} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, color: "white" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "700", mb: 3, textAlign: "center" }}
      >
        Skill Verification
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mb: 4,
          textAlign: "center",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        The user has staked money to get their skills verified. Please review
        the skills below.
      </Typography>
      <Grid container spacing={3}>
        {skills.map((skill) => (
          <Grid item xs={12} key={skill.id}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "16px",
                color: "white",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "600" }}>
                    {skill.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {skill.description}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    sx={{
                      background: "green",
                      color: "white",
                      mr: 2,
                      "&:hover": { background: "darkgreen" },
                    }}
                    onClick={() => handleVerification(skill.id, true)}
                  >
                    Verified
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      background: "red",
                      color: "white",
                      "&:hover": { background: "darkred" },
                    }}
                    onClick={() => handleVerification(skill.id, false)}
                  >
                    False Claim
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SkillVerification;
