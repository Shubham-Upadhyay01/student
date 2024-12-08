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

const Verifier = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const questions = [
    "What's your email address?",
    "What's your name?",
    "Select your professional domain",
  ];

  const domains = [
    "Tech", "Marketing", "Sales", "Design", "Finance", 
    "Healthcare", "Education", "Gaming", "Content Creation", "Data Science"
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    domain: "",
  });
  const [introCompleted, setIntroCompleted] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  
  // Supabase submission states
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Typewriter effect
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
      typeWriter("Let's onboard you as Verifier", () => {
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

  const proceedToverifierdashboard = async () => {
    if (!selectedDomain) {
      alert("Please select a professional domain");
      return;
    }

    const finalFormData = {
      ...formData,
      domain: selectedDomain
    };

    try {
      setSubmitting(true);
      
      // Insert data into Supabase 'socials' table
      const { data, error } = await supabase
        .from('verifiers')
        .insert([
          {
            email: finalFormData.email,
            name: finalFormData.name,
            domain: finalFormData.domain,
            created_at: new Date()
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting data into Supabase:', error);
        throw error;
      }
      
      // Navigate to next page
      navigate("/verifierdashboard", {
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
                onClick={proceedToverifierdashboard}
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
          background: "#000",
          zIndex: -1,
        }}
        ref={videoRef}
      />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          flex: 1,
          px: 3,
          mt: 3,
        }}
      >
        <motion.div
          key="intro-text"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            color="white"
            sx={{
              fontSize: isMobile ? "2.5rem" : "3.5rem",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {displayedText}
          </Typography>
        </motion.div>
        {renderQuestionContent()}
      </Container>
      <Snackbar
        open={!!submitError}
        autoHideDuration={6000}
        onClose={() => setSubmitError(null)}
      >
        <Alert severity="error" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Verifier;
