import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import CustomTextField from '../../custom-components/CustomTextField';
import CustomButton from '../../custom-components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { ErrorMessage, SuccessMessage } from '../../../utils/ToastMessages';
import { RegisterUser } from '../../Services/Methods';
import CustomModal from '../../custom-components/CustomModal';
import theme from '../../../theme';
import Cookies from 'js-cookie';


const CardDetailForm = ({ registerData, setIsAuthenticated }: any) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const navigate = useNavigate();

    // Formik setup
    const formik = useFormik({
        initialValues: {
            cardHolderName: '',
            cardNumber: '',
            ccv: '',
            expirationDate: '',
        },
        validationSchema: Yup.object({
            cardHolderName: Yup.string().required('Card Holder Name is required'),
            cardNumber: Yup.string()
                .matches(/^\d{4}-\d{4}-\d{4}-\d{4}$/, 'Card number must be in format xxxx-xxxx-xxxx-xxxx')
                .required('Card Number is required'),
            ccv: Yup.string()
                .matches(/^\d{3,4}$/, 'CCV must be 3 or 4 digits')
                .required('CCV is required'),
            expirationDate: Yup.string()
                .matches(/^(0[1-9]|1[0-2]) \/ \d{2}$/, 'Expiration Date must be in MM/YY format')
                .required('Expiration Date is required'),
        }),
        onSubmit: (values) => {
            if (!isSubmitting) {
                const formData = {
                    Name: registerData.name,
                    Email: registerData.email,
                    Password: registerData.password, // Use hashed password
                    Address: "5678 Oak Avenue, Metropolis, USA",
                    Company: registerData.companyName,
                    CardHolderName: values.cardHolderName,
                    CardHolderNumber: values.cardNumber.replace(/-/g, ''), // Remove dashes for the card number
                    CCV: values.ccv,
                    ExpiryDate: values.expirationDate.replace(' / ', '/'), // Remove space around the slash
                };

                setIsSubmitting(true);
                registerUser(formData);
            }
        },
    });

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

    const handleCcvChange = (e: any, setFieldValue: any) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setFieldValue('ccv', value.substring(0, 4)); // Max length is 4 digits
    };

    const handleCardNumberChange = (e: any, setFieldValue: any) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1-'); // Format with dashes
        setFieldValue('cardNumber', formattedValue.substring(0, 19)); // Max length is 19 (16 digits + 3 dashes)
    };

    const handleExpirationDateChange = (e: any, setFieldValue: any) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

        // Ensure that the month does not exceed 12
        if (value.length > 2) {
            const month = value.substring(0, 2);
            if (parseInt(month) > 12) {
                value = '12' + value.substring(2); // Correct the month to 12 if it's greater than 12
            }
        }

        // Add slash after MM
        if (value.length > 2) {
            value = value.substring(0, 2) + ' / ' + value.substring(2, 4); // Add slash after MM
        }

        setFieldValue('expirationDate', value.substring(0, 7)); // Max length is 7 (MM / YY)
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Paper elevation={0} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant={'h5'} py={0.5}>
                    Credit Card Information
                </Typography>
                <Typography fontSize={16} gutterBottom>
                    Give your Credit Card Information Carefully.
                </Typography>
                <form onSubmit={formik.handleSubmit}>
                    {/* Card Holder Name */}
                    <Box width="100%" sx={{ py: 1 }}>
                        <Typography fontWeight="600" fontSize={15} py={1}>
                            Card Holder Name:
                        </Typography>
                        <CustomTextField
                            fullWidth
                            required
                            name="cardHolderName"
                            value={formik.values.cardHolderName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.cardHolderName && Boolean(formik.errors.cardHolderName)}
                            helperText={formik.touched.cardHolderName && formik.errors.cardHolderName}
                            placeholder="John Doe"
                        />
                    </Box>

                    {/* Card Number */}
                    <Box width="100%" sx={{ py: 0.5 }}>
                        <Typography fontWeight="600" fontSize={15} py={1}>
                            Card Number:
                        </Typography>

                        <CustomTextField
                            fullWidth
                            required
                            name="cardNumber"
                            value={formik.values.cardNumber}
                            onChange={(e) => handleCardNumberChange(e, formik.setFieldValue)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                            helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                            placeholder="xxxx-xxxx-xxxx-xxxx"
                            inputProps={{ maxLength: 19 }} // Allow 19 characters (16 digits + 3 dashes)
                        />
                    </Box>

                    {/* CCV */}
                    <Box width="100%" sx={{ py: 0.5 }}>
                        <Typography fontWeight="600" fontSize={15} py={1}>
                            CCV:
                        </Typography>
                        <CustomTextField
                            fullWidth
                            required
                            name="ccv"
                            type="text"
                            value={formik.values.ccv}
                            onChange={(e) => handleCcvChange(e, formik.setFieldValue)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.ccv && Boolean(formik.errors.ccv)}
                            helperText={formik.touched.ccv && formik.errors.ccv}
                            placeholder="1234"
                            inputProps={{ maxLength: 4 }} // Allow only 4 digits
                        />
                    </Box>

                    {/* Expiration Date */}
                    <Box width="100%" sx={{ py: 0.5 }}>
                        <Typography fontWeight="600" fontSize={15} py={1}>
                            Expiration Date (MM / YY):
                        </Typography>
                        <CustomTextField
                            fullWidth
                            required
                            name="expirationDate"
                            value={formik.values.expirationDate}
                            onChange={(e) => handleExpirationDateChange(e, formik.setFieldValue)}
                            onBlur={formik.handleBlur}
                            error={formik.touched.expirationDate && Boolean(formik.errors.expirationDate)}
                            helperText={formik.touched.expirationDate && formik.errors.expirationDate}
                            placeholder="MM / YY"
                            inputProps={{ maxLength: 7 }} // Allow 7 characters (MM / YY)
                        />
                    </Box>

                    {/* Submit Button */}
                    <CustomButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        sx={{ mt: 2, fontSize: 16 }}
                    >
                        {isSubmitting ? <CircularProgress sx={{ color: theme.palette.primary.main3 }} /> : 'Continue'}
                    </CustomButton>
                </form>
            </Paper>

            {/* Modal opens upon form submission */}
            <CustomModal open={openModal} modalType="signup" onClose={() => setOpenModal(false)} />

        </Box>
    );
};

export default CardDetailForm;
