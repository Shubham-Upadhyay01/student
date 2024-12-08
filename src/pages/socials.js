import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Container, 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Snackbar, 
  Alert 
} from "@mui/material";
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaInstagram, 
  FaWallet 
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const Socials = () => {
  const { state } = useLocation();
  const [name, setName] = useState("");
  const [connectedAccounts, setConnectedAccounts] = useState({
    github: false,
    linkedin: false,
    twitter: false,
    instagram: false,
    metamask: false,
    aadhaar: false,
  });
  const [socialLinks, setSocialLinks] = useState({
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  });
  const [openDialog, setOpenDialog] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [account, setAccount] = useState(null);
  
  // New states for loading
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const fullLoadingText = "Loading info to Subgraphs...";
  
  // Ensure email is extracted correctly
  const email = state?.email || localStorage.getItem('userEmail');
  const navigate = useNavigate();

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

  // Validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Snackbar helper
  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fetch initial data
  useEffect(() => {
    if (!email) {
      showSnackbar("No email found. Please log in again.", "error");
      return;
    }

    const fetchInitialData = async () => {
      try {
        // Fetch name
        const { data: nameData, error: nameError } = await supabase
          .from("answers")
          .select("answer")
          .eq("email", email)
          .eq("question_number", 2)
          .single();

        if (nameError) throw nameError;
        if (nameData) setName(nameData.answer || "");

        // Fetch social links
        const { data: linksData, error: linksError } = await supabase
          .from("links")
          .select("*")
          .eq("email", email)
          .single();

        if (linksError && linksError.code !== 'PGRST116') throw linksError;

        if (linksData) {
          // Update social links
          const links = {
            github: linksData.github || "",
            linkedin: linksData.linkedin || "",
            twitter: linksData.twitter || "",
            instagram: linksData.instagram || "",
          };

          setSocialLinks(links);

          // Update connected accounts
          const connections = {
            github: !!linksData.github,
            linkedin: !!linksData.linkedin,
            twitter: !!linksData.twitter,
            instagram: !!linksData.instagram,
          };

          setConnectedAccounts(prev => ({ ...prev, ...connections }));
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        showSnackbar("Failed to fetch initial data", "error");
      }
    };

    fetchInitialData();
  }, [email]);

  // Social link save handler
  const handleSocialLinkSave = async (provider) => {
    const link = socialLinks[provider];

    // Validate link
    if (link && !isValidUrl(link)) {
      showSnackbar(`Please enter a valid ${provider} URL`, "error");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("links")
        .upsert({
          email,
          [provider]: link
        }, {
          onConflict: 'email'
        })
        .select();

      if (error) throw error;

      // Update local state
      setConnectedAccounts(prev => ({
        ...prev,
        [provider]: !!link
      }));

      showSnackbar(`${provider.charAt(0).toUpperCase() + provider.slice(1)} link saved successfully`, "success");
      setOpenDialog(null);
    } catch (error) {
      console.error(`Error saving ${provider} link:`, error);
      showSnackbar(`Failed to save ${provider} link: ${error.message}`, "error");
    }
  };

  // Dialog open handler
  const handleLinkDialogOpen = (provider) => {
    setOpenDialog(provider);
  };

  // Link change handler
  const handleLinkChange = (provider, value) => {
    setSocialLinks((prev) => ({ ...prev, [provider]: value }));
  };

  // MetaMask connection handler
  const handleMetaMaskConnect = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const walletAddress = accounts[0];
        setAccount(walletAddress);

        const { error } = await supabase.from("metamask_accounts").upsert({
          email,
          wallet_address: walletAddress,
        });

        if (error) throw error;

        setConnectedAccounts((prev) => ({ ...prev, metamask: true }));
        showSnackbar("MetaMask connected successfully", "success");
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        showSnackbar("Failed to connect MetaMask", "error");
      }
    } else {
      showSnackbar("Please install MetaMask to use this feature", "warning");
    }
  };

  // Aadhaar connection handler
  const handleAadhaarConnect = () => {
    showSnackbar("Aadhaar connection feature is not implemented yet", "info");
  };

  // Social buttons configuration
  const socialButtons = [
    {
      provider: "github",
      icon: FaGithub,
      color: connectedAccounts.github ? "#4CAF50" : "#ffffff",
      onClick: () => handleLinkDialogOpen("github"),
    },
    {
      provider: "linkedin",
      icon: FaLinkedin,
      color: connectedAccounts.linkedin ? "#0077B5" : "#ffffff",
      onClick: () => handleLinkDialogOpen("linkedin"),
    },
    {
      provider: "twitter",
      icon: FaTwitter,
      color: connectedAccounts.twitter ? "#1DA1F2" : "#ffffff",
      onClick: () => handleLinkDialogOpen("twitter"),
    },
    {
      provider: "instagram",
      icon: FaInstagram,
      color: connectedAccounts.instagram ? "#E1306C" : "#ffffff",
      onClick: () => handleLinkDialogOpen("instagram"),
    },
  ];

  // Navigation method with loading transition
  const handleNextNavigation = () => {
    setIsLoading(true);
    
    // Simulate loading and then navigate
    setTimeout(() => {
      navigate("/UserProfile");
    }, 3500); // Slightly longer to accommodate typing effect
  };

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
                damping: 10 
              }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  fontSize: '4rem',  // Larger font size
                  fontWeight: 'bold',
                  textAlign: 'center',
                  background: 'linear-gradient(to right, #00ffff, #00ff99)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {loadingText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ 
                    duration: 0.7, 
                    repeat: Infinity 
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
            overflow: "hidden",
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
              filter: "brightness(0.5)", // Darken the video slightly
            }}
          >
            <source src="./socials.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          <Container maxWidth="md">
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
              <Typography variant="h2" gutterBottom>
                {name ? `Hey, ${name}! Add Your Social Links` : "Add Your Social Links"}
              </Typography>

              <Grid container spacing={3} justifyContent="center" alignItems="center">
                {socialButtons.map((social) => (
                  <Grid item key={social.provider}>
                    <IconButton
                      onClick={social.onClick}
                      sx={{
                        color: social.color,
                        fontSize: "3rem",
                        background: "rgba(255,255,255,0.2)",
                        borderRadius: "50%",
                        padding: "15px",
                        opacity: connectedAccounts[social.provider] ? 0.5 : 1,
                      }}
                    >
                      <social.icon />
                    </IconButton>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleMetaMaskConnect}
                  startIcon={<FaWallet />}
                >
                  {connectedAccounts.metamask
                    ? `Connected: ${account?.substring(0, 6)}...${account?.substring(account.length - 4)}`
                    : "Connect MetaMask"}
                </Button>

                <Button 
                  variant="contained" 
                  onClick={handleAadhaarConnect}
                >
                  {connectedAccounts.aadhaar ? "Aadhaar Connected" : "Connect Aadhaar"}
                </Button>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNextNavigation}
                >
                  Go Next
                </Button>
              </Box>
            </Box>
          </Container>

          {/* Social Link Input Dialogs */}
          {["github", "linkedin", "twitter", "instagram"].map((provider) => (
            <Dialog
              key={provider}
              open={openDialog === provider}
              onClose={() => setOpenDialog(null)}
            >
              <DialogTitle>
                Add {provider.charAt(0).toUpperCase() + provider.slice(1)} Link
              </DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  label={`${provider.charAt(0).toUpperCase() + provider.slice(1)} Profile URL`}
                  type="url"
                  fullWidth
                  value={socialLinks[provider]}
                  onChange={(e) => handleLinkChange(provider, e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
                <Button 
                  onClick={() => handleSocialLinkSave(provider)}
                  color="primary"
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          ))}

          {/* Snackbar for Feedback */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={() => setSnackbarOpen(false)} 
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
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