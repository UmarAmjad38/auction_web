import { Box, Typography, Paper, Link, IconButton, InputAdornment, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage } from '../../../utils/ToastMessages';
import theme from '../../../theme';
import CustomButton from '../../custom-components/CustomButton';
import CustomTextField from '../../custom-components/CustomTextField';
import { emailVerification } from '../../Services/Methods';

const SignupForm = ({ setEmail, setRegisterData }: any) => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            name: '',
            companyName: '',
            address: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            address: Yup.string().required('Address is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string()
                .min(8, 'Password should be at least 8 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password')], 'Passwords must match')
                .required('Please re-enter password'),
        }),
        onSubmit: (values) => {
            setIsSubmitting(true);
            handleEmailVerification(values)
        },
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleEmailVerification = async (payload: any) => {
        try {
            const response = await emailVerification(payload.email);
            if (response.status === 200) {
                // Handle success response
                setEmail(payload.email)
                const user = {
                    Name: payload.name,
                    Email: payload.email,
                    Address: payload.address,
                    Password: payload.password,
                    Company: payload.companyName
                }

                setRegisterData(user)
                navigate('/email-verification');
            } else {
                ErrorMessage("Failed to send verification email");
            }
        } catch (error) {
            ErrorMessage("An error occurred while sending verification email");
        } finally {
            setIsSubmitting(false);
        }

    }
    return (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Paper elevation={0} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" py={0.5}>
                    Create Account
                </Typography>
                <Typography fontSize={16} gutterBottom>
                    Create Your Account to continue into the platform.
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    {/* Name */}
                    <Box width="100%" >
                        <Typography fontWeight="600" fontSize={15} py={1}>
                            Name:
                        </Typography>
                        <CustomTextField
                            fullWidth
                            type="text"
                            required
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            placeholder="John Doe"
                            slotProps={{
                                input: {
                                    endAdornment: formik.touched.name && formik.errors.name && (
                                        <InputAdornment position="end">
                                            <Typography color="error" fontSize={12}>
                                                {formik.errors.name}
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                    </Box>

                    {/* Company Name */}
                    <Box width="100%" >
                        <Typography fontWeight="600" fontSize={15} py={1}>
                            Company Name: <Typography component={'span'} fontSize={14} color={theme.palette.primary.main}>(Optional)</Typography>
                        </Typography>
                        <CustomTextField
                            fullWidth
                            type="text"
                            name="companyName"
                            value={formik.values.companyName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                            placeholder="**********"
                            slotProps={{
                                input: {
                                    endAdornment: formik.touched.companyName && formik.errors.companyName && (
                                        <InputAdornment position="end">
                                            <Typography color="error" fontSize={12}>
                                                {formik.errors.companyName}
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                    </Box>

                    {/* Address */}
                    <Box width="100%" >
                        <Typography fontWeight="600" fontSize={15} py={1}>
                            Address:
                        </Typography>
                        <CustomTextField
                            fullWidth
                            type="text"
                            name="address"
                            value={formik.values.address}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.address && Boolean(formik.errors.address)}
                            placeholder="5678 Oak Avenue, Metropolis, USA"
                            slotProps={{
                                input: {
                                    endAdornment: formik.touched.address && formik.errors.address && (
                                        <InputAdornment position="end">
                                            <Typography color="error" fontSize={12}>
                                                {formik.errors.address}
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />

                    </Box>


                    {/* Email */}
                    <Box width="100%" >
                        <Typography fontWeight="600" fontSize={15} py={1}>
                            Email:
                        </Typography>
                        <CustomTextField
                            fullWidth
                            type="email"
                            required
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            placeholder="user123@gmail.com"
                            slotProps={{
                                input: {
                                    endAdornment: formik.touched.email && formik.errors.email && (
                                        <InputAdornment position="end">
                                            <Typography color="error" fontSize={12}>
                                                {formik.errors.email}
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Box>

                    {/* Password */}
                    <Box>
                        <Typography fontWeight="600" fontSize={15}>
                            Password:
                        </Typography>
                        <CustomTextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            margin="dense"
                            variant="outlined"
                            required
                            name="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            placeholder="**********"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {
                                                formik.touched.password && formik.errors.password &&
                                                <Typography color="error" fontSize={12}>
                                                    {formik.errors.password}
                                                </Typography>
                                            }
                                            <IconButton
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                                sx={{ color: 'primary.main' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Box>

                    {/* Confirm Password */}
                    <Box>
                        <Typography fontWeight="600" fontSize={15}>
                            Confirm Password:
                        </Typography>
                        <CustomTextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            margin="dense"
                            variant="outlined"
                            required
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            placeholder="**********"
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {
                                                formik.touched.confirmPassword && formik.errors.confirmPassword &&
                                                <Typography color="error" fontSize={12}>
                                                    {formik.errors.confirmPassword}
                                                </Typography>
                                            }
                                            <IconButton
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                                sx={{ color: 'primary.main' }}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Box>

                    {/* Submit Button */}
                    <CustomButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, fontSize: 16 }}
                    >
                        {isSubmitting ? <CircularProgress sx={{ color: theme.palette.primary.main3 }} /> : 'Next'}
                    </CustomButton>
                </form>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingY: '12px',
                    }}
                >
                    <Typography fontWeight={500}>
                        Already have an Account? Go to&nbsp;
                    </Typography>
                    <Link
                        onClick={() => navigate('/login')}
                        variant="body2"
                        fontWeight={500}
                        fontSize={14}
                        underline="hover"
                        sx={{ cursor: 'pointer' }}
                    >
                        Login.
                    </Link>
                </Box>
            </Paper>
        </Box>
    );
};

export default SignupForm;
