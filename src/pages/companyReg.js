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
  Alert,
  InputAdornment,
  IconButton
} from "@mui/material";
import { 
  AccountCircle,
  Email,
  Lock,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import supabase from './supabaseClient';
import bcrypt from 'bcryptjs';

const AdminReg = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const questions = [
    "What's your name?",
    "Enter your email address",
    "Set a strong password"
  ];

  const [displayedText, setDisplayedText] = useState("");
  const [answer, setAnswer] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [introCompleted, setIntroCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
    if (!introCompleted) {
      typeWriter("Welcome to Admin Registration", () => {
        setTimeout(() => setIntroCompleted(true), 1000);
      });
    } else if (questions[currentQuestionIndex]) {
      typeWriter(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, introCompleted, typeWriter]);

  const handleSubmit = async () => {
    try {
      const trimmedAnswer = answer.trim();
      if (!trimmedAnswer) {
        setError("Please provide an answer");
        return;
      }

      if (currentQuestionIndex === 0) {
        if (trimmedAnswer.length < 2) {
          setError("Name must be at least 2 characters long");
          return;
        }
        setFormData(prev => ({ ...prev, name: trimmedAnswer }));
      } else if (currentQuestionIndex === 1) {
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedAnswer)) {
          setError("Please enter a valid email address");
          return;
        }
        setFormData(prev => ({ ...prev, email: trimmedAnswer }));
      } else if (currentQuestionIndex === 2) {
        if (trimmedAnswer.length < 6) {
          setError("Password must be at least 6 characters long");
          return;
        }
        
        const hashedPassword = await bcrypt.hash(trimmedAnswer, 10);
        setFormData(prev => ({ ...prev, password: hashedPassword }));
        await registerAdmin({ ...formData, password: hashedPassword });
        return;
      }

      setAnswer("");
      setCurrentQuestionIndex(prev => prev + 1);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const registerAdmin = async (finalData) => {
    try {
      setSubmitting(true);
      const { data, error } = await supabase.from('admins').insert({
        name: finalData.name,
        email: finalData.email,
        password: finalData.password
      }).select();

      if (error) throw error;
      navigate("/company-dashboard", { replace: true });
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getIcon = () => {
    switch (currentQuestionIndex) {
      case 0:
        return <AccountCircle sx={{ color: 'rgba(255,255,255,0.7)' }} />;
      case 1:
        return <Email sx={{ color: 'rgba(255,255,255,0.7)' }} />;
      case 2:
        return <Lock sx={{ color: 'rgba(255,255,255,0.7)' }} />;
      default:
        return null;
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
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit()}
            type={currentQuestionIndex === 2 ? (showPassword ? "text" : "password") : "text"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {getIcon()}
                </InputAdornment>
              ),
              endAdornment: currentQuestionIndex === 2 ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
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
              onClick={handleSubmit}
              disabled={submitting || !answer.trim()}
              sx={{
                borderRadius: 6,
                px: 8,
                py: 2,
                fontSize: isMobile ? "1.2rem" : "1.5rem",
              }}
            >
              {submitting ? "Processing..." : currentQuestionIndex === questions.length - 1 ? "Complete Registration" : "Next"}
            </Button>
          </Box>
        </motion.div>
      </Container>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminReg;