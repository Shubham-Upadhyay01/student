import React, { useState, useEffect, useCallback } from "react";
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
import supabase from './supabaseClient'; // Import the Supabase client

const Ques = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const questions = [
    "What's your name?",
    "What's your email address?",
    "Create a secure password",
    "What is your department?",
    "What is your enrollment year?",
    "What's your phone number?",
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    enrollment_year: "",
    phone: "",
  });

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

  useEffect(() => {
    if (questions[currentQuestionIndex]) {
      typeWriter(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, typeWriter]);

  const validateAnswer = (index, value) => {
    switch (index) {
      case 0: // Name
        return value.trim().length > 1 || "Name must be at least 2 characters";
      case 1: // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) || "Enter a valid email address";
      case 2: // Password
        return value.trim().length >= 6 || "Password must be at least 6 characters";
      case 3: // Department
        return value.trim().length > 0 || "Department cannot be empty";
      case 4: // Enrollment Year
        const year = parseInt(value, 10);
        return (year >= 1900 && year <= new Date().getFullYear()) || "Enter a valid year";
      case 5: // Phone
        const phoneRegex = /^[0-9]{10,15}$/;
        return phoneRegex.test(value) || "Enter a valid phone number";
      default:
        return true;
    }
  };

  const handleSubmit = () => {
    const trimmedAnswer = answer.trim();
    const validationMessage = validateAnswer(currentQuestionIndex, trimmedAnswer);

    if (validationMessage !== true) {
      alert(validationMessage);
      return;
    }

    const newFormData = { ...formData };

    switch (currentQuestionIndex) {
      case 0:
        newFormData.name = trimmedAnswer;
        break;
      case 1:
        newFormData.email = trimmedAnswer;
        break;
      case 2:
        newFormData.password = trimmedAnswer;
        break;
      case 3:
        newFormData.department = trimmedAnswer;
        break;
      case 4:
        newFormData.enrollment_year = trimmedAnswer;
        break;
      case 5:
        newFormData.phone = trimmedAnswer;
        break;
      default:
        break;
    }

    setFormData(newFormData);
    setAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      submitForm(newFormData);
    }
  };

  const submitForm = async (data) => {
    try {
      setSubmitting(true);

      const { error } = await supabase
        .from('students')
        .insert([{
          name: data.name,
          email: data.email,
          password: data.password,
          department: data.department,
          enrollment_year: parseInt(data.enrollment_year, 10),
          phone: data.phone,
        }]);

      if (error) {
        throw error;
      }

      navigate("/userProfile", { replace: true });
    } catch (error) {
      console.error("Error during submission:", error);
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
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
      {/* Background Video */}
      <Box
        component="video"
        autoPlay
        loop
        muted
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source src="/quess.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </Box>

      {/* Foreground Content */}
      <Container
        maxWidth="sm"
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
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 4,
                fontWeight: "bold",
                color: "primary.main",
                
                fontSize: isMobile ? "1.8rem" : "2.5rem",
              }}
            >
              {displayedText}
            </Typography>

            <TextField
              fullWidth
              variant="outlined"
              value={answer}
              
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              sx={{
                mb: 4,
                "& .MuiInputBase-input": {
                  fontSize: isMobile ? "1.2rem" : "1.5rem",
                  color: "white",
                },
              }}
            />

            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                borderRadius: 6,
                px: 6,
                py: 2,
                fontSize: isMobile ? "1.2rem" : "1.5rem",
              }}
            >
              {submitting ? "Submitting..." : "Next"}
            </Button>
          </motion.div>
        </AnimatePresence>

        {submitError && (
          <Snackbar
            open={Boolean(submitError)}
            autoHideDuration={6000}
            onClose={() => setSubmitError(null)}
          >
            <Alert onClose={() => setSubmitError(null)} severity="error">
              {submitError}
            </Alert>
          </Snackbar>
        )}
      </Container>
    </Box>
  );
};

export default Ques;
