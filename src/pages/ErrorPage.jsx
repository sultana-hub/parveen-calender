import { Box, Typography, Container } from "@mui/material";


const ErrorPage = () => {
 

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* <Typography variant="h2" fontWeight="bold" color="error" sx={{ mb: 2 }}>
          404
        </Typography> */}
        <Typography variant="h5" sx={{ mb: 2, color: "gray" }}>
          Oops! Page Not Found
        </Typography>
        
      
        {/* Illustration (Optional) */}
        <img
          src="https://cdn.dribbble.com/users/1138875/screenshots/4669703/404_animation.gif"
          alt="Error"
          style={{ maxWidth: "80%", height: "auto", marginBottom: "20px" }}
        />

        
      </Box>
    </Container>
  );
};

export default ErrorPage;