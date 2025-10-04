import { makeStyles } from "@mui/styles";

const usePaymentTrackingStyles = makeStyles((theme: any) => ({
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: "20px",
    },
    searchField: {
        height: '35px',
        width: '70%',
        // marginBottom: "40px"
    },
    searchButton: {
        borderRadius: '10px',
        margin: "10px 0",
        height: '35px',
        width: '140px',
        textTransform: 'none'
    },
    buttonContainer: {
        display: 'flex',
        gap: '16px',
        maxHeight: '40px',
    },
    filterButton: {
        textTransform: 'none',
        backgroundColor: theme.palette.primary.main,
        width: '160px',
        height: '50px',
    },
    title: {
        fontSize: '40.85px',
        fontWeight: 600,
        color: theme.palette.primary.main11,
        padding: "10px 0"
    },
    toggleContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #E2E8F0',
        height: '40px',
        borderRadius: '5px',
        minWidth: '250px',
        maxWidth: '250px',
        backgroundColor: 'white',
    },
    toggleButton: {
        textTransform: 'none',
        transition: 'background 0.25s ease-in-out, color 0.3s ease-in-out, font-size 0.25s ease-in-out',
        border: 'none',
        borderRadius: '5px !important',
        width: "120px",
        '&.paid': {
            fontSize: '11px',
            backgroundColor: `${theme.palette.primary.main} !important`,
            color: 'white !important',
        },
        '&.unpaid': {
            fontSize: '10px',
            backgroundColor: 'inherit',
            color: `${theme.palette.primary.main5} !important`,
        },
    },
    paymentTable: {
        maxWidth: '100%',
        border: '1px solid #E2E8F0',
        '& td': {
            fontSize: '16px',
            color: '#2A2A2A'
        },
        '& th': {
            fontSize: '18px',
            backgroundColor: theme.palette.primary.main,
        },
        '& td th': {
            textAlign: 'left',
            whiteSpace: 'nowrap',
            width: "fit-content",
            fontSize: '12px'
        },
        // Center last two columns (th and td)
        '& th:last-child, & td:last-child': {
            textAlign: 'center',
        },
        '& th:nth-last-child(2), & td:nth-last-child(2)': {
            textAlign: 'center',
        },
    },
    paginationWrapper: {
        display: "flex",
        justifyContent: 'end',
        alignItems: 'center',
        padding: "30px 0"
    },
    viewButton: {
        width: "120px",
        backgroundColor: theme.palette.primary.main,
        textTransform: "none",
        fontSize: '15px',
    },
    pickedButton: {
        width: "120px",
        backgroundColor: theme.palette.primary.main,
        textTransform: "none",
        fontSize: '15px',
        pointerEvents: 'none'
    },
    downloadButton: {
        width: "120px",
        backgroundColor: "#36AB32",
        textTransform: "none",
        fontSize: '15px',
    },
    menuItem: {
        width: '160px',
        display: 'block',
        textAlign: 'center',
        '&.selected': {
            backgroundColor: theme.palette.primary.main,
            color: '#ffffff',
            display: 'block',
            textAlign: 'center',
        },
        '&:hover': {
            backgroundColor: theme.palette.primary.main6,
            color: 'initial',
        },
    },
}));

export default usePaymentTrackingStyles;
