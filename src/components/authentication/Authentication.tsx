import { Box, Fade, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom'; // Add useNavigate
import Carousel from './login/Carousal';
import LoginForm from './login/LoginForm';
import ForgotPassword from './login/ForgotPassword';
import ResetPassword from './login/ResetPassword';
import SetNewPassword from './login/SetNewPassword';
import { useState, useEffect } from 'react';
import { useLoginStyles } from './login/LoginStyles';
import Signup from './login/Signup';
import CardDetailForm from './login/CardDetailForm';
import CloseIcon from '@mui/icons-material/Close';
import EmailVerification from './login/EmailVerification';

const Authentication = ({ setIsAuthenticated }: any) => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize the navigate function
    const classes = useLoginStyles();

    const [currentComponent, setCurrentComponent]: any = useState(null);
    const [fadeIn, setFadeIn] = useState(false);
    const [registerData, setRegisterData] = useState({});
    const [email, setEmail] = useState();
    const [otp, setOtp] = useState();

    useEffect(() => {
        setFadeIn(false); // Trigger fade out
        const timer = setTimeout(() => {
            // Change the component after fade-out
            setCurrentComponent(() => {
                switch (location.pathname) {
                    case '/email-verification':
                        return <EmailVerification email={email} registerData={registerData} setIsAuthenticated={setIsAuthenticated} />;
                    case '/card-details':
                        return <CardDetailForm registerData={registerData} setIsAuthenticated={setIsAuthenticated} />;
                    case '/login':
                        return <LoginForm setIsAuthenticated={setIsAuthenticated} />;
                    case '/forgot-password':
                        return <ForgotPassword setEmail={setEmail} registerData={registerData} setIsAuthenticated={setIsAuthenticated} />;
                    case '/reset-password':
                        return <ResetPassword email={email} setOtp={setOtp} />;
                    case '/new-password':
                        return <SetNewPassword email={email} otp={otp} />;
                    default:
                        return <Signup setEmail={setEmail} setRegisterData={setRegisterData} />;
                }
            });
            setFadeIn(true); // Trigger fade in
        }, 300); // Match the fade-out duration

        return () => clearTimeout(timer); // Clean up the timer
    }, [location.pathname]);

    // Handle close button click
    const handleClose = () => {
        navigate('/'); // Navigate to root path
    };

    return (
        <Box className={classes.root}>
            {/* Carousel */}
            <Box className={classes.carouselContainer}>
                <Carousel />
            </Box>

            {/* Animated Component */}
            <Box className={classes.componentContainerSignup}>
                <Box sx={{
                    width: '--webkit-fill-available',
                    overflowY: 'auto',
                }}>
                    <Fade in={fadeIn} timeout={300}>
                        <div className={classes.fadeWrapper}>{currentComponent}</div>
                    </Fade>
                </Box>
            </Box>
            <Box
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    zIndex: 10,
                }}
            >
                <IconButton
                    onClick={handleClose}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                        },
                    }}
                >
                    <CloseIcon sx={{ fontSize: '2rem', fontWeight: 'bold' }} />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Authentication;