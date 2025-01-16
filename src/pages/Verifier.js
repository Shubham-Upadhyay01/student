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
import bcrypt from 'bcryptjs';
import supabase from './supabaseClient';

const Verifier = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const questions = [
    "What's your email address?",
    "What's your name?",
    "What's your Department",
    "Enter Password",
    "What's your Designation"
  ];

  const departments = [
    "ISE", "CSE", "CY", "CD", "AIML", 
    "EEE", "ECE", "ETE", "EIE", "IM"
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    department: "",
    password: "",
    designation: ""
  });
  const [introCompleted, setIntroCompleted] = useState(false);
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
      typeWriter("Let's onboard you as Faculty", () => {
        setTimeout(() => setIntroCompleted(true), 1000);
      });
    } else if (questions[currentQuestionIndex]) {
      typeWriter(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, introCompleted, typeWriter]);

  const validateInput = (value, type) => {
    const trimmedValue = value.trim();
    
    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedValue)) {
          throw new Error("Please enter a valid email address");
        }
        break;
      case 'name':
        if (trimmedValue.length < 2) {
          throw new Error("Name must be at least 2 characters long");
        }
        break;
      case 'password':
        if (trimmedValue.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }
        break;
      case 'department':
        if (!departments.includes(trimmedValue)) {
          throw new Error("Please select a valid department");
        }
        break;
      case 'designation':
        if (trimmedValue.length < 2) {
          throw new Error("Please enter a valid designation");
        }
        break;
    }
    return trimmedValue;
  };

  const handleSubmit = async () => {
    try {
      const trimmedAnswer = answer.trim();
      if (!trimmedAnswer) return;

      let validatedValue;
      const newFormData = { ...formData };

      switch (currentQuestionIndex) {
        case 0: // Email
          validatedValue = validateInput(trimmedAnswer, 'email');
          newFormData.email = validatedValue;
          break;
        case 1: // Name
          validatedValue = validateInput(trimmedAnswer, 'name');
          newFormData.name = validatedValue;
          break;
        case 2: // Department
          validatedValue = validateInput(trimmedAnswer, 'department');
          newFormData.department = validatedValue;
          break;
        case 3: // Password
          validatedValue = validateInput(trimmedAnswer, 'password');
          // Store the plain password in formData for navigation state
          newFormData.password = validatedValue;
          break;
        case 4: // Designation
          validatedValue = validateInput(trimmedAnswer, 'designation');
          newFormData.designation = validatedValue;
          break;
      }

      setFormData(newFormData);
      setAnswer("");

      if (currentQuestionIndex === questions.length - 1) {
        // All questions answered, submit the form
        await submitForm(newFormData);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } catch (error) {
      setSubmitError(error.message);
    }
  };

  const submitForm = async (finalFormData) => {
    try {
      setSubmitting(true);
      
      // Hash the password before saving to database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(finalFormData.password, salt);
      
      const { data, error } = await supabase
        .from('faculty')
        .insert([{
          name: finalFormData.name,
          email: finalFormData.email,
          department: finalFormData.department,
          password: hashedPassword, // Save the hashed password
          designation: finalFormData.designation
        }])
        .select();

      if (error) throw error;

      // Navigate to dashboard on success
      // Note: We pass the original formData with plain password for the current session
      navigate("/verifierdashboard", {
        state: finalFormData,
        replace: true
      });
    } catch (error) {
      console.error('Error during submission:', error);
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
        bgcolor: "#000"
      }}
    >
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
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            color="white"
            sx={{
              fontSize: isMobile ? "2.5rem" : "3.5rem",
              fontWeight: 500,
              lineHeight: 1.5,
              mb: 4
            }}
          >
            {displayedText}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TextField
            fullWidth
            variant="outlined"
            label={questions[currentQuestionIndex]}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            type={currentQuestionIndex === 3 ? "password" : "text"}
            sx={{
              width: isMobile ? "100%" : "400px",
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
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={submitting || !answer.trim()}
              sx={{
                borderRadius: 6,
                px: 8,
                py: 2,
                fontSize: isMobile ? "1.2rem" : "1.5rem",
              }}
            >
              {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
            </Button>
          </Box>
        </motion.div>
      </Container>

      <Snackbar
        open={!!submitError}
        autoHideDuration={6000}
        onClose={() => setSubmitError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setSubmitError(null)}
          sx={{ width: '100%' }}
        >
          {submitError}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Verifier;