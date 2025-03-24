import React from "react";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <AppBar position="static" sx={{backgroundColor: '#663300', mt: 4 }}>
      <Container>
        <Toolbar
          sx={{
            flexDirection: "column",
            textAlign: "center",
            py: 3,
          }}
        >
          {/* Navigation Links */}
          <Box sx={{ mb: 1, display: "flex", gap: 3 }}>
            <Typography
              component={Link}
              href="/"
              sx={{
                color: "inherit",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": { color: "#D7CCC8" }, // Light brown hover effect
              }}
            >
              Home
            </Typography>
            <Typography
              component={Link}
              href="/calendar"
              sx={{
                color: "inherit",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": { color: "#D7CCC8" },
              }}
            >
              Calendar
            </Typography>
            <Typography
              component={Link}
              href="/about"
              sx={{
                color: "inherit",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: "bold",
                "&:hover": { color: "#D7CCC8" },
              }}
            >
             
            </Typography>
          </Box>

          {/* Copyright Text */}
          <Typography variant="body2" sx={{ color: "#D7CCC8" }}>
            © {new Date().getFullYear()} Webskitter Academy. All rights reserved.
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Footer;

