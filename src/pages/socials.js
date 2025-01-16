import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { supabase } from "./supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const Socials = () => {
  const [students, setStudents] = useState([]); // Store student data
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const fullLoadingText = "Loading student data...";

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Typing effect for loading text
  useEffect(() => {
    if (isLoading) {
      let currentText = "";
      let index = 0;

      const typingInterval = setInterval(() => {
        if (index < fullLoadingText.length) {
          currentText += fullLoadingText[index];
          setLoadingText(currentText);
          index++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100);

      return () => clearInterval(typingInterval);
    }
  }, [isLoading]);

  // Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fetch student data from the Students table
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from("Students").select("*");

        if (error) {
          throw error;
        }

        if (data) {
          setStudents(data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        showSnackbar("Failed to fetch student data", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              color: "white",
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 10,
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: "4rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  background: "linear-gradient(to right, #00ffff, #00ff99)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {loadingText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                  }}
                >
                  |
                </motion.span>
              </Typography>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <Box
          sx={{
            position: "relative",
            height: "100vh",
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            padding: "20px",
          }}
        >
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: -1,
              filter: "brightness(0.5)",
            }}
          >
            <source src="./socials.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <Container maxWidth="lg">
            <Box
              sx={{
                backgroundColor: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(10px)",
                borderRadius: "20px",
                padding: "40px",
                textAlign: "center",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
              }}
            >
              <Typography variant="h3" gutterBottom>
                Students Data
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                {students.map((student) => (
                  <Grid item xs={12} md={6} lg={4} key={student.student_id}>
                    <Box
                      sx={{
                        padding: "20px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(255,255,255,0.1)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                      }}
                    >
                      <Typography variant="h6">
                        <strong>ID:</strong> {student.student_id}
                      </Typography>
                      <Typography>
                        <strong>Name:</strong> {student.name}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {student.email}
                      </Typography>
                      <Typography>
                        <strong>Department:</strong> {student.department || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Enrollment Year:</strong> {student.enrollment_year || "N/A"}
                      </Typography>
                      <Typography>
                        <strong>Phone:</strong> {student.phone || "N/A"}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
};

export default Socials;
