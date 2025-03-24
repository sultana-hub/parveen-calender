import React from 'react'
import Calendar from '../components/Calender'
import { Typography,Container } from '@mui/material'
const Home = () => {
  return (
    <Container>
    <Typography variant="h4" align="center" my={4}>
      Google Calendar Clone
    </Typography>
    <Calendar />
  </Container>
  )
}

export default Home
