
import { makeStyles } from '@mui/styles';

const CartStyles = makeStyles((theme: any) => ({
    container: {
        padding: "30px",
        maxWidth: 640,
        border: '1px solid #E2E8F0',
        borderRadius: '20px',
        backgroundColor: '#ffffff'
    },
    label: {
        fontSize: '15px',
        fontWeight: 600,
        color: theme.palette.primary.main10,
        paddingBottom: '10px'
    },
    heading: {
        fontSize: '22px',
        fontWeight: 500,
        color: '#012868',
        marginBottom: '10px'
    },
    pageHeading: {
        fontSize: '40px',
        fontWeight: 600,
        color: '#2D3748',
        maxWidth: '645px',
        marginBottom: '40px'
    },
    gridStyle: {
        padding: '0 !important',
    },
    error: {
        marginBottom: '16px',
    },
    payment: {
        fontSize: '16px',
        fontWeight: 300,
        marginBottom: '10px'
    },
    paper: {
        boxShadow: 'none',
        padding: '10px 16px',
        borderRadius: '15px',
        border: "1px solid #E0E0E0"
    },
    submitButton: {
        height: '64px',
        borderRadius: '14px',
        textTransform: 'none',
        fontSize: '16px',
        fontWeight: 600
    },
    modalStyles: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: '400px',
        bgcolor: "background.paper",
        borderRadius: '15px',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        padding: '20px',
        textAlign: "center",
    }

}));

export default CartStyles;
