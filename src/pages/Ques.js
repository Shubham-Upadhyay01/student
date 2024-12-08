import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  useMediaQuery, 
  useTheme, 
  Container,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import supabase from './supabaseClient'; // Import the supabase client

const Ques = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // Updated questions to include skills
  const questions = [
    "What's your email address?",
    "What's your name?",
    "Select your professional domain",
    "What are your top skills?"
  ];

  // Domain to skills mapping
  const domainSkills = {
    "Tech": [
      "React JS", "Node.js", "Python", "JavaScript", 
      "TypeScript", "AWS", "Docker", "Machine Learning"
    ],
    "Marketing": [
      "Social Media Marketing", "SEO", "Content Strategy", 
      "Google Analytics", "Copywriting", "Email Marketing", "Brand Management"
    ],
    "Sales": [
      "CRM", "Negotiation", "Relationship Building", 
      "Closing Techniques", "Lead Generation", "Consultative Selling"
    ],
    "Design": [
      "UI/UX", "Figma", "Adobe Creative Suite", "Sketch", 
      "Graphic Design", "Interaction Design", "Prototyping"
    ],
    "Finance": [
      "Financial Analysis", "Excel", "Accounting", "Risk Management", 
      "Investment Strategy", "Budgeting", "Financial Modeling"
    ],
    "Healthcare": [
      "Patient Care", "Medical Coding", "Healthcare IT", 
      "Clinical Research", "Healthcare Management", "Telemedicine"
    ],
    "Education": [
      "Curriculum Development", "E-Learning", "Instructional Design", 
      "Educational Technology", "Teaching", "Training & Development"
    ],
    "Gaming": [
      "Game Design", "Unity", "Unreal Engine", "C++", 
      "3D Modeling", "Game Art", "Gameplay Programming"
    ],
    "Content Creation": [
      "Video Editing", "Photography", "Writing", "Social Media Content", 
      "Storytelling", "Adobe Premiere", "YouTube Marketing"
    ],
    "Data Science": [
      "Python", "Machine Learning", "Data Visualization", 
      "SQL", "R", "Tableau", "Statistical Analysis"
    ]
  };

  const domains = Object.keys(domainSkills);

  const [displayedText, setDisplayedText] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    domain: "",
    skills: [],
  });
  const [introCompleted, setIntroCompleted] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // Supabase submission states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Typewriter effect (remains the same as previous implementation)
  const typeWriter = useCallback((text, callback) => {
    let currentText = "";
    let charIndex = 0;

    const type = () => {
      if (charIndex < text.length) {
        currentText += text[charIndex];
        setDisplayedText(currentText);
        charIndex++;
        setTimeout(type, 50);
      } else if (callback) {
        callback();
      }
    };

    type();
  }, []);

  // Typing effect for intro and questions
  useEffect(() => {
    if (!introCompleted) {
      typeWriter("Let's get you onboarded", () => {
        setTimeout(() => setIntroCompleted(true), 1000);
      });
    } else if (questions[currentQuestionIndex]) {
      typeWriter(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, introCompleted, typeWriter]);

  const handleSubmit = () => {
    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) return;

    const newFormData = { ...formData };

    if (currentQuestionIndex === 0) {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedAnswer)) {
        alert("Please enter a valid email address");
        return;
      }
      newFormData.email = trimmedAnswer;
    } else if (currentQuestionIndex === 1) {
      // Name validation
      if (trimmedAnswer.length < 2) {
        alert("Please enter a valid name");
        return;
      }
      newFormData.name = trimmedAnswer;
    }

    setFormData(newFormData);
    setAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleDomainSelect = (domain) => {
    setSelectedDomain(domain);
  };

  const handleSkillSelect = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const proceedToSocials = async () => {
    if (currentQuestionIndex === 2 && !selectedDomain) {
      alert("Please select a professional domain");
      return;
    }

    if (currentQuestionIndex === 3 && selectedSkills.length === 0) {
      alert("Please select at least one skill");
      return;
    }

    const finalFormData = {
      ...formData,
      domain: selectedDomain,
      skills: selectedSkills
    };

    try {
      setSubmitting(true);
      
      // Insert data into Supabase 'socials' table
      const { data, error } = await supabase
        .from('socials')
        .insert([
          {
            email: finalFormData.email,
            name: finalFormData.name,
            domain: finalFormData.domain,
            skills: finalFormData.skills,
            created_at: new Date()
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting data into Supabase:', error);
        throw error;
      }
      
      // Navigate to next page
      navigate("/socials", {
        state: finalFormData,
        replace: true,
      });
    } catch (error) {
      console.error('Error during submission:', error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionContent = () => {
    // Handling skills selection after domain
    if (currentQuestionIndex === 3) {
      const availableSkills = selectedDomain ? domainSkills[selectedDomain] : [];

      return (
        <motion.div
          key="skills-selection"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
              mt: 6,
              mb: 6,
              maxWidth: "100%",
              overflowX: "auto",
              px: 3,
            }}
          >
            {availableSkills.map((skill) => (
              <motion.div 
                key={skill} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                style={{ margin: '0.75rem' }}
              >
                <Button
                  variant={selectedSkills.includes(skill) ? "contained" : "outlined"}
                  onClick={() => handleSkillSelect(skill)}
                  sx={{
                    borderRadius: 6,
                    px: 4,
                    py: 2,
                    fontSize: isMobile ? "1rem" : "1.3rem",
                    whiteSpace: "nowrap",
                    backgroundColor: selectedSkills.includes(skill) 
                      ? "primary.main" 
                      : "transparent",
                    color: selectedSkills.includes(skill) ? "white" : "primary.main",
                    borderColor: "primary.main",
                    "&:hover": {
                      backgroundColor: selectedSkills.includes(skill) 
                        ? "primary.dark" 
                        : "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  {skill}
                </Button>
              </motion.div>
            ))}
          </Box>
          {selectedSkills.length > 0 && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 6 
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={proceedToSocials}
                disabled={submitting}
                sx={{
                  borderRadius: 6,
                  px: 8,
                  py: 2,
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                }}
              >
                {submitting ? "Saving..." : "Next"}
              </Button>
            </Box>
          )}
        </motion.div>
      );
    }

    // Existing domain selection logic (for index 2)
    if (currentQuestionIndex === 2) {
      return (
        <motion.div
          key="domain-selection"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 3,
              mt: 6,
              mb: 6,
              maxWidth: "100%",
              overflowX: "auto",
              px: 3,
            }}
          >
            {domains.map((domain) => (
              <motion.div 
                key={domain} 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                style={{ margin: '0.75rem' }}
              >
                <Button
                  variant={selectedDomain === domain ? "contained" : "outlined"}
                  onClick={() => handleDomainSelect(domain)}
                  sx={{
                    borderRadius: 6,
                    px: 4,
                    py: 2,
                    fontSize: isMobile ? "1rem" : "1.3rem",
                    whiteSpace: "nowrap",
                    backgroundColor: selectedDomain === domain 
                      ? "primary.main" 
                      : "transparent",
                    color: selectedDomain === domain ? "white" : "primary.main",
                    borderColor: "primary.main",
                    "&:hover": {
                      backgroundColor: selectedDomain === domain 
                        ? "primary.dark" 
                        : "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  {domain}
                </Button>
              </motion.div>
            ))}
          </Box>
          {selectedDomain && (
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 6 
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setCurrentQuestionIndex(3)}
                sx={{
                  borderRadius: 6,
                  px: 8,
                  py: 2,
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                }}
              >
                Next
              </Button>
            </Box>
          )}
        </motion.div>
      );
    }

    // Existing text input logic for first two questions
    return (
      <motion.div
        key="text-input"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label={questions[currentQuestionIndex]}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          sx={{
            "& .MuiInputBase-input": {
              color: "white",
              fontSize: isMobile ? "1.3rem" : "1.6rem",
              p: 2,
            },
            "& .MuiInputLabel-root": {
              color: "rgba(255,255,255,0.7)",
              fontSize: isMobile ? "1.1rem" : "1.3rem",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.3)",
              },
              "&:hover fieldset": {
                borderColor: "white",
              },
              "&.Mui-focused fieldset": {
                borderColor: "white",
              },
            },
          }}
        />
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 6 
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{
              borderRadius: 6,
              px: 8,
              py: 2,
              fontSize: isMobile ? "1.2rem" : "1.5rem",
            }}
          >
            Next
          </Button>
        </Box>
      </motion.div>
    );
  };


  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 1,
          },
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        >
          <source src="/quess.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </Box>

      <Container 
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          textAlign: "center",
          px: { xs: 3, sm: 5 },
        }}
      >
        <AnimatePresence mode="wait">
          {!introCompleted ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: isMobile ? "2.5rem" : "4rem",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  width: '100%',
                }}
              >
                {displayedText}
              </Typography>
            </motion.div>
          ) : (
            <>
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    mb: 6,
                    fontWeight: "bold",
                    color: "white",
                    fontSize: isMobile ? "1.8rem" : "2.5rem",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    width: '100%',
                  }}
                >
                  {displayedText}
                </Typography>
              </motion.div>
              {renderQuestionContent()}
            </>
          )}
        </AnimatePresence>
      </Container>

      {submitError && (
        <Snackbar 
          open={Boolean(submitError)} 
          autoHideDuration={6000} 
          onClose={() => setSubmitError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setSubmitError(null)} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {submitError}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Ques;