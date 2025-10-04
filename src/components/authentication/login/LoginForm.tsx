import { Box, Typography, Paper, Link, IconButton, InputAdornment, CircularProgress, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomTextField from '../../custom-components/CustomTextField';
import CustomButton from '../../custom-components/CustomButton';
import CustomModal from '../../custom-components/CustomModal';
import theme from '../../../theme';
import { ErrorMessage } from '../../../utils/ToastMessages';
import { LoginUser } from '../../Services/Methods';
import Cookies from 'js-cookie';


const LoginForm = ({ setIsAuthenticated }: any) => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [openModal, setOpenModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRemember, setIsRemember] = useState(false);

    // Formik setup
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required'),
            password: Yup.string()
                .min(3, 'Password should be at least 8 characters')
                .required('Password is required'),
        }),
        onSubmit: (values) => {
            handleLogin(values)
        },
    });

    const handleLogin = async (payload: LogInPayload) => {
        setIsSubmitting(true)
        try {
            // check status and show error if any
            const response = await LoginUser(payload)

            setIsSubmitting(false)
            if (response?.status == 200) {
                setOpenModal(true)
                const user = {
                    id: response.data.Id,
                    name: response.data.Name,
                    email: response.data.Email,
                    address: response.data.Address,
                    company: response.data.Company,
                }

                setTimeout(() => {
                    if (isRemember) {
                        Cookies.set('user', JSON.stringify(user), { expires: 1 }); // expires in 1 day
                    } else {
                        sessionStorage.setItem('authToken', JSON.stringify(user));
                    }

                    setOpenModal(false)
                    setIsAuthenticated(true)
                    navigate('/')
                }, 2000);
            }
        } catch (error: any) {
            if (error.response?.status == 404) {
                ErrorMessage("User not found check email or password")
            } else {
                ErrorMessage("An error occurred")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Paper elevation={0} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant={'h5'} py={0.5}>
                    Login
                </Typography>
                <Typography fontSize={16} gutterBottom>
                    To get the access of the platform please fill this information.
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    <Box width="100%" sx={{ py: 1 }}>
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
                            helperText={formik.touched.email && formik.errors.email}
                            placeholder="user123@gmail.com"
                        />
                    </Box>
                    <Box>
                        <Typography fontWeight="600" fontSize={15} pt={1}>
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
                            helperText={formik.touched.password && formik.errors.password}
                            placeholder='**********'
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                                sx={{ color: 'primary.main' }} // Set the icon color to primary color
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isRemember}
                                            onChange={(e) => setIsRemember(e.target.checked)}
                                        />
                                    }
                                    label="Remember Me"
                                />
                            </FormGroup>
                            <Link onClick={() =>
                                navigate('/forgot-password')
                            }
                                variant="body2" fontWeight={400}
                                fontSize={14}
                                underline="hover" sx={{ cursor: 'pointer' }}>
                                Forgot password?
                            </Link>
                        </Box>
                    </Box>
                    <CustomButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, fontSize: 16 }}
                    >
                        {isSubmitting ? <CircularProgress sx={{ color: theme.palette.primary.main3 }} /> : 'Login'}
                    </CustomButton>
                </form>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingY: "12px"
                    }}
                >
                    <Typography>
                        Don't have an Account ? Go to&nbsp;
                    </Typography>
                    <Link onClick={() =>
                        navigate('/signup')
                    }
                        variant="body2"
                        fontWeight={400}
                        fontSize={14}
                        underline="hover"
                        sx={{ cursor: 'pointer' }}>
                        Create Account.
                    </Link>
                </Box>
            </Paper>

            {/* Modal opens upon form submission */}
            <CustomModal open={openModal} modalType={'login'} onClose={() => setOpenModal(false)} />
        </Box>
    );
};

export default LoginForm;
