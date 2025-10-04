import { Box, Typography, CircularProgress, Link } from '@mui/material';
import CustomButton from '../../custom-components/CustomButton';
import CustomTextField from '../../custom-components/CustomTextField';
import { useEffect, useState } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import theme from '../../../theme';
import { useNavigate } from 'react-router-dom';
import { useLoginStyles, useResetPasswordStyles } from './LoginStyles'; // Assuming LoginStyles is correctly exported
import { ErrorMessage, SuccessMessage } from '../../../utils/ToastMessages';
import { RegisterUser, verifyOtp } from '../../Services/Methods';
import CustomModal from '../../custom-components/CustomModal';

const EmailVerification = ({ email, registerData, setIsAuthenticated }: any) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [values, setValues] = useState(['', '', '', '']); // Array to hold 4-digit values
    const [openModal, setOpenModal] = useState(false);

    const loginClasses = useLoginStyles();
    const classes = useResetPasswordStyles();

    const handleChange = (e: any, index: number) => {
        const newValues = [...values];
        newValues[index] = e.target.value.slice(0, 1); // Restrict to 1 digit
        setValues(newValues);

        if (e.target.value) {
            const nextField = document.getElementById(`digit-${index + 1}`);
            if (nextField) nextField.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') e.preventDefault();
        if (e.key === 'Backspace' && !values[index]) {
            const prevField = document.getElementById(`digit-${index - 1}`);
            if (prevField) prevField.focus();
        }
    };


    const handleFormSubmit = async () => {
        const otp = values.join('');

        if (otp.length !== 4) {
            return ErrorMessage("Please enter a 4-digit OTP code.");
        }

        setIsSubmitting(true);

        try {
            const response = await verifyOtp({ OTP: otp, Email: email });
            if (response?.data) {
                registerUser(registerData)
            }
        } catch (error) {
            ErrorMessage("OTP verification failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }

    };

    const registerUser = async (payload: any) => {
        try {
            const response: any = await RegisterUser(payload)
            setIsSubmitting(false)
            if (response.data) {
                setOpenModal(true)

                const user = {
                    id: response.data.Id,
                    name: response.data.Name,
                    email: response.data.Email,
                    address: response.data.Address,
                    company: response.data.Company,
                }

                setTimeout(() => {
                    setOpenModal(false)
                    sessionStorage.setItem('authToken', JSON.stringify(user));
                    setIsAuthenticated(true)
                    navigate('/home')
                }, 2000);
            }
        } catch (error: any) {
            ErrorMessage('Error creating account!');
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Box className={loginClasses.componentContainer}>
            <Box width="100%" maxWidth={400}>
                <Typography variant="h5" mb={2}>
                    Email Verification
                </Typography>
                <Typography variant="body1" fontSize={15} mb={2}>
                    We sent a code to “{email}”. Please enter the code below.
                </Typography>
                <Box className={classes.codeInputContainer}>
                    {values.map((value, index) => (
                        <CustomTextField
                            key={index}
                            id={`digit-${index}`}
                            value={value}
                            onChange={(e: any) => handleChange(e, index)}
                            onKeyDown={(e: any) => handleKeyDown(e, index)}
                            inputProps={{
                                maxLength: 1,
                                style: { textAlign: 'center', fontSize: 32, color: theme.palette.primary.main8, overflow: 'hidden' },
                                inputMode: 'numeric',
                            }}
                        />
                    ))}
                </Box>
                <CustomButton
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleFormSubmit}
                >
                    {isSubmitting ? <CircularProgress sx={{ color: theme.palette.primary.main3 }} /> : 'Continue'}
                </CustomButton>
                {/* Link to go back to Login page */}
                <Box mt={2} textAlign="center">
                    <Link onClick={() => navigate('/login')} variant="body2" fontWeight={400} underline="hover" sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <KeyboardBackspaceIcon sx={{ fontSize: 16, px: 0.5 }} /> Back to Login
                    </Link>
                </Box>
            </Box>
            {/* Modal opens upon form submission */}
            <CustomModal open={openModal} modalType="signup" onClose={() => setOpenModal(false)} />
        </Box>
    );
};

export default EmailVerification;
