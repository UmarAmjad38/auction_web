import { useEffect, useState } from 'react';
import Routing from './routes/Routing';
import { Box } from '@mui/material';
import Cookies from 'js-cookie';
import { io } from "socket.io-client";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // const SOCKET_URL = "http://localhost:8181";
  const SOCKET_URL = "https://socket.parkersauction.com/"
  const socket = io(SOCKET_URL, { transports: ["websocket"] });

  useEffect(() => {

    const checkSession = () => {
      //   const ss = {
      //     id: 8,
      //     name: "Hassaan",
      //     email: "hassaan@gmail.com",
      //     address: "12, sda,a sdasd",
      //     company: "company"
      // }     
      //  sessionStorage.setItem('authToken', JSON.stringify(ss));

      const authToken = sessionStorage.getItem('authToken');
      const user = Cookies.get('user');

      // Update authentication state based on session presence
      if (authToken || user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }

      // Mark loading as complete
      setLoading(false);
    };

    checkSession();
    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMessages = (message: string) => {
    console.log(`Message received: ${message}`);
  }

  if (loading) {
    // Show a loader until authentication is verified
    return <Box>Loading...</Box>;
  }

  return <Routing isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} socket={socket} />;
}

export default App;
