import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Grid,
    Modal,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    Paper,
    Dialog,
    DialogContent

} from "@mui/material";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import CartStyles from './CartStyles';
import CustomTextField from '../../custom-components/CustomTextField';
import { CustomMultiLineTextField } from '../../custom-components/CustomMultiLineTextField';
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from 'axios';
import { ErrorMessage, SuccessMessage } from '../../../utils/ToastMessages';
import { getQueryParam } from '../../../helper/GetQueryParam';
import { getInvoiceDetails, getLotDetailsById, getUnpaidInvoices, paymentRequest } from '../../Services/Methods';
import Cookies from 'js-cookie';
import CustomModal from '../../custom-components/CustomModal';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [amount, setAmount] = useState("");
    const [clientEmail, setClientEmail] = useState("");

    // const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY as string);
    const classes = CartStyles()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const handleClose = () => setOpen(false);
    const handleClosePaymentModal = () => setPaymentModal(false);

    const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string);
    const [isFetchingData, setIsFetchingData] = useState({});
    const [invoice, setInvoice] = useState({});
    const [lot, setLot]: any = useState({});
    const [email, setEmail] = useState("");


    const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
    const client = (sessionStorage.getItem('authToken') ?
        JSON.parse(user) : Cookies.get('user')
            ? JSON.parse(user) : {})

    useEffect(() => {

        const fetchLotDetails = async () => {
            try {
                const response = await getLotDetailsById(getQueryParam('lotId'));
                const lot = response.data?.Lot;
                if (lot) {
                    setLot(lot);
                } else {
                    setLot([]);
                }
            } catch (error) {
                setIsFetchingData(false);
            } finally {
                setIsFetchingData(false);
            }
        };
        fetchLotDetails();
    }, [getQueryParam('lotId')])


    useEffect(() => {
        const fetchInvoices = async () => {
            setIsFetchingData(true)
            try {
                const response = await getInvoiceDetails(getQueryParam('paymentId'));

                if (response.data) {
                    setInvoice(response.data);
                    setAmount(response.data.TotalAmount)
                    setEmail(client.email)
                } else {
                    setInvoice({});
                }
            } catch (error) {
            } finally {
                setIsFetchingData(false)
            }
        };
        fetchInvoices();
    }, [])


    const CheckoutForm = () => {
        const stripe = useStripe();
        const elements = useElements();
        const [loading, setLoading] = useState(false);
        const [message, setMessage] = useState("");


        const handleSubmit = async (e: any) => {
            e.preventDefault();

            if (!stripe || !elements) {
                return;
            }

            setLoading(true);
            setMessage("");

            const cardElement: any = elements.getElement(CardElement);
            const { token, error }: any = await stripe.createToken(cardElement);

            if (error) {
                setMessage(error.message);
                setLoading(false);
                return;
            }

            const invoiceId: string = getQueryParam('paymentId')!;
            const payload = {
                Token: token.id,
                Amount: parseFloat(lot.BidStartAmount),
                Description: lot.ShortDescription,
                Email: email,
                InvoiceId: parseInt(invoiceId)
            }
            try {
                const response = await paymentRequest(payload);

                if (response.status === 201) {
                    setPaymentSuccess(true);
                    setTimeout(() => {
                        setPaymentSuccess(false);
                        navigate('/home')
                    }, 3000);
                    // SuccessMessage("Payment successful!");
                } else {
                    ErrorMessage("Payment failed. Please try again.");
                }
            } catch (err: any) {
                console.error("Error processing payment: " + err.message);
            } finally {
                handleClosePaymentModal();
            }

            setLoading(false);
        };

        return (
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>💳 Stripe Payment</h2>
                <input type="text" placeholder="Enter amount" value={lot.BidStartAmount} onChange={(e) => e.preventDefault()} style={styles.input} required />
                <input type="email" placeholder="Enter email" value={clientEmail} onChange={(e) => e.preventDefault()} style={styles.input} required />

                <CardElement options={{ hidePostalCode: true, style: styles.card }} />

                <button type="submit" disabled={!stripe || loading} style={styles.button}>
                    {loading ? "Processing..." : "Pay Now"}
                </button>

                {message && <p style={styles.message}>{message}</p>}
            </form>
        );
    };

    // Styles
    const styles: any = {
        // form: { width: "400px", margin: "50px auto", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", background: "#fff", textAlign: "center" },
        input: { width: "90%", padding: "10px", marginBottom: "10px", border: "1px solid #ddd", borderRadius: "5px" },
        card: { padding: "10px", border: "1px solid #ddd", borderRadius: "5px", marginBottom: "10px" },
        button: { marginTop: "10px", background: "#28a745", color: "#fff", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", width: "100%" },
        message: { marginTop: "10px", color: "#d9534f" },
    };

    return (
        <Box pb={'80px'}>
            <Typography className={classes.pageHeading}>
                Shipping Address and Payment Address:
            </Typography>

            <Box className={classes.container}>

                <Formik
                    initialValues={{
                        email: "",
                        country: "",
                        firstName: "",
                        lastName: "",
                        address: "",
                        phoneNumber: "",
                        specialInstruction: "",
                        apartment: "",
                        zipCode: "",
                        postalCode: "",
                        payment: "",
                    }}
                    validationSchema={Yup.object({
                        email: Yup.string().email("Invalid email").required("Email is required"),
                        country: Yup.string().required("Country is required"),
                        firstName: Yup.string().required("First name is required"),
                        lastName: Yup.string().required("Last name is required"),
                        address: Yup.string().required("Address is required"),
                        phoneNumber: Yup.string()
                            .matches(/^\d+$/, "Must be a number")
                            .required("Phone number is required"),
                        zipCode: Yup.string().required("Zip Code is required"),
                    })}
                    onSubmit={(values: any) => {
                        // alert(JSON.stringify(values));
                        // formik.resetForm();
                    }}
                >
                    {formik => (
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container>
                                <Typography className={classes.heading}>
                                    Contact:
                                </Typography>
                                {/* Email */}
                                <Grid className={
                                    (formik.touched.email) && formik.errors.email
                                        ? classes.error
                                        : classes.gridStyle
                                } item xs={12}>
                                    <Typography className={classes.label}>
                                        Email
                                    </Typography>
                                    <CustomTextField
                                        fullWidth
                                        name="email"
                                        placeholder="Email"
                                        onChange={(e: any) => { formik.handleChange(e); setClientEmail(e.target.value) }}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && typeof formik.errors.email === 'string' ? formik.errors.email : ''}
                                    />
                                </Grid>


                                <Typography className={classes.heading}>
                                    Delivery:
                                </Typography>
                                {/* Country */}
                                <Grid className={
                                    (formik.touched.country) && formik.errors.country
                                        ? classes.error
                                        : classes.gridStyle
                                } item xs={12}>
                                    <Typography className={classes.label}>
                                        Country / Region
                                    </Typography>
                                    <CustomTextField
                                        fullWidth
                                        name="country"
                                        placeholder="Country / Region"
                                        error={formik.touched.country && Boolean(formik.errors.country)}
                                        onChange={formik.handleChange}
                                        helperText={formik.touched.country && typeof formik.errors.country === 'string' ? formik.errors.country : ''}
                                    />
                                </Grid>

                                {/* First Name */}
                                <Grid className={
                                    (formik.touched.firstName) && formik.errors.firstName
                                        ? classes.error
                                        : classes.gridStyle
                                } item xs={12}>
                                    <Typography className={classes.label}>
                                        First Name
                                    </Typography>
                                    <CustomTextField
                                        fullWidth
                                        name="firstName"
                                        placeholder="First Name"
                                        onChange={formik.handleChange}
                                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                        helperText={formik.touched.firstName && typeof formik.errors.firstName === 'string' ? formik.errors.firstName : ''}
                                    />
                                </Grid>

                                {/* Last Name */}
                                <Grid className={
                                    (formik.touched.lastName) && formik.errors.lastName
                                        ? classes.error
                                        : classes.gridStyle
                                } item xs={12}>
                                    <Typography className={classes.label}>
                                        Last Name
                                    </Typography>
                                    <CustomTextField
                                        fullWidth
                                        name="lastName"
                                        placeholder="Last Name"
                                        onChange={formik.handleChange}
                                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                        helperText={formik.touched.lastName && typeof formik.errors.lastName === 'string' ? formik.errors.lastName : ''}
                                    />
                                </Grid>

                                {/* Address */}
                                <Grid className={
                                    (formik.touched.address) && formik.errors.address
                                        ? classes.error
                                        : classes.gridStyle
                                } item xs={12}>
                                    <Typography className={classes.label}>
                                        Address
                                    </Typography>
                                    <CustomTextField
                                        fullWidth
                                        name="address"
                                        placeholder="Address"
                                        onChange={formik.handleChange}
                                        error={formik.touched.address && Boolean(formik.errors.address)}
                                        helperText={formik.touched.address && typeof formik.errors.address === 'string' ? formik.errors.address : ''}
                                    />
                                </Grid>

                                {/* Phone Number */}
                                <Grid className={
                                    (formik.touched.phoneNumber) && formik.errors.phoneNumber
                                        ? classes.error
                                        : classes.gridStyle
                                } item xs={12}>
                                    <Typography className={classes.label}>
                                        Phone Number
                                    </Typography>
                                    <CustomTextField
                                        fullWidth
                                        name="phoneNumber"
                                        placeholder="Phone Number"
                                        onChange={formik.handleChange}
                                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                        helperText={formik.touched.phoneNumber && typeof formik.errors.phoneNumber === 'string' ? formik.errors.phoneNumber : ''}
                                    />
                                </Grid>

                                {/* Special Instruction */}
                                <Grid className={classes.gridStyle} item xs={12}>
                                    <Typography className={classes.label}>
                                        Special Instruction
                                    </Typography>
                                    <CustomMultiLineTextField
                                        name="instruction"
                                        placeholder="Special Instruction"
                                        maxRows={6}
                                        onChange={formik.handleChange}
                                    />
                                </Grid>

                                {/* Apartment */}
                                <Grid className={classes.gridStyle} item xs={12}>
                                    <Typography className={classes.label}>
                                        Apartment
                                    </Typography>
                                    <CustomTextField
                                        fullWidth
                                        name="apartment"
                                        placeholder="Apartment (Optional)"
                                        onChange={formik.handleChange}
                                    />
                                </Grid>

                                {/* Zip Code */}
                                <Grid className={
                                    (formik.touched.zipCode) && formik.errors.zipCode
                                        ? classes.error
                                        : classes.gridStyle
                                } item xs={12}>
                                    <Typography className={classes.label}>
                                        Zip Code
                                    </Typography>
                                    <CustomTextField
                                        fullWidth
                                        name="zipCode"
                                        placeholder="Zip Code"
                                        onChange={formik.handleChange}
                                        error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}
                                        helperText={formik.touched.zipCode && typeof formik.errors.zipCode === 'string' ? formik.errors.zipCode : ''}
                                    />
                                </Grid>

                                {/* Postal Code */}
                                <Grid className={classes.gridStyle} item xs={12}>
                                    <Typography className={classes.label}>
                                        Postal Code
                                    </Typography>
                                    <CustomTextField
                                        fullWidth
                                        onChange={formik.handleChange}
                                        name="postalCode"
                                        placeholder="Postal Code (Optional)"
                                    />
                                </Grid>

                                {/* Payment Method */}
                                <Grid mb={'40px'} className={classes.gridStyle} item xs={12}>
                                    <Typography className={classes.payment}> <span style={{ fontSize: '22px', fontWeight: 500, color: '#012868' }}>Payment</span>  (All payments are secured and encrypted):</Typography>
                                    <Paper className={classes.paper}>
                                        <Field as={RadioGroup} name="payment">
                                            <FormControlLabel
                                                value="debit"
                                                control={<Radio />}
                                                label="Debit - Credit Card"
                                            />
                                        </Field>
                                    </Paper>
                                </Grid>

                                {/* Submit Button */}
                                <Grid className={classes.gridStyle} item xs={12}>
                                    <Button
                                        onClick={() => setPaymentModal(true)}
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        className={classes.submitButton}
                                    >
                                        Complete Auction Process
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}
                </Formik>
                <Dialog open={paymentModal} onClose={handleClosePaymentModal} style={{ width: '100%' }}>
                    <DialogContent>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    </DialogContent>
                </Dialog>

                {/* Modal */}
                <Modal open={open} onClose={handleClose}>
                    <Box
                        className={classes.modalStyles}
                    >
                        <Typography variant="h6" gutterBottom>
                            Congratulations!
                        </Typography>
                        <Typography gutterBottom>
                            Your Auction Process is Successfully Completed!
                        </Typography>
                        <Button onClick={handleClose} variant="contained" color="primary">
                            Close
                        </Button>
                    </Box>
                </Modal>

                <CustomModal open={paymentSuccess} modalType={'payment'} onClose={() => setPaymentSuccess(false)} />

            </Box>
        </Box >
    );
};

export default Cart;
