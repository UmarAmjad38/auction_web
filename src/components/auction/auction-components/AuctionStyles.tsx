import { makeStyles } from '@mui/styles';
import theme from '../../../theme';

export const useAuctionCardStyles = makeStyles({
    card: {
        padding: "15px",
        borderRadius: "15px",
        minHeight: '-webkit-fill-available'
    },
    description: {
        color: theme.palette.primary.main2,
        fontSize: "12px",
        width: "100%"
    },
    media: {
        cursor: "pointer",
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        },
        borderRadius: "15px",
    },
    liveMedia: {
        cursor: "pointer",
        borderRadius: "15px",
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    content: {
        marginTop: "30px",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
    },
    title: {
        fontSize: "22px",
        fontWeight: 600,
        color: theme.palette.primary.main1,
        flex: 1,
    },
    catalogButton: {
        height: "37.47px",
        width: "98.47px",
        textTransform: 'none',
        marginLeft: 15,
        fontSize: 12,
        padding: 0,
    },
    nextButton: {
        height: "37.47px",
        width: "150px",
        textTransform: 'none',
        border: `1px solid ${theme.palette.primary.main}`,
        color: "black",
        fontSize: 12,
        padding: 0,
    },
    selectButton: {
        textTransform: "none",
        fontSize: "13px",
        width: "150px",
        height: "37.47px",
    },
    actionButtons: {
        display: 'flex',
        alignItems: 'start',
        gap: 15,
        // marginTop: "20px"
    },
    actionButton: {
        textTransform: "none",
        fontSize: "13px",
        width: "95px",
        height: "37.47px",
    },
    smallTitle: {
        marginLeft: 15,
        fontWeight: "600",
        fontSize: "11px"

    },
    liveButton: {
        backgroundColor: "#C91818",
        position: 'absolute',
        top: "10px",
        left: "10px",
        pointerEvents: 'none', // Prevent interaction while keeping styles
        opacity: 0.9, // Maintain original appearance
        width: "70px",
        height: "37.47px",
        fontSize: "13px",
        textTransform: "none"
    },
    soldButton: {
        backgroundColor: "#009045",
        position: 'absolute',
        top: "10px",
        left: "10px",
        pointerEvents: 'none', // Prevent interaction while keeping styles
        opacity: 0.9, // Maintain original appearance
        width: "98.34px",
        height: "37.47px",
        fontSize: "13px",
        textTransform: "none"
    },
    unSoldButton: {
        backgroundColor: "#C91818",
        position: 'absolute',
        top: "10px",
        left: "10px",
        pointerEvents: 'none', // Prevent interaction while keeping styles
        opacity: 0.9, // Maintain original appearance
        width: "98.34px",
        height: "37.47px",
        fontSize: "13px",
        textTransform: "none"
    },
    unSoldButtonLive: {
        backgroundColor: "#C91818",
        position: 'absolute',
        top: "10px",
        left: "10px",
        pointerEvents: 'none', // Prevent interaction while keeping styles
        opacity: 0.9, // Maintain original appearance
        width: "200px",
        height: "37.47px",
        fontSize: "13px",
        textTransform: "none"
    },
    button1: {
        backgroundColor: "#C91818",
        position: 'absolute',
        top: "10px",
        left: "10px",
        opacity: 0.9, // Maintain original appearance
        width: "200px",
        height: "37.47px",
        fontSize: "13px",
        textTransform: "none"
    },
    button2: {
        backgroundColor: "#C91818",
        position: 'absolute',
        bottom: "10px",
        left: "37%", // Horizontally center it
        opacity: 0.9, // Maintain original appearance
        width: "200px",
        height: "37.47px",
        fontSize: "13px",
        textTransform: "none"
    },
    button3: {
        backgroundColor: theme.palette.primary.main,
        pointerEvents: 'none', // Prevent interaction while keeping styles
        opacity: 0.9, // Maintain original appearance
        width: "170px",
        height: "37.47px",
        fontSize: "12px",
        textTransform: "none"
    },
    joinButton: {
        textTransform: "none",
        fontSize: "13px",
        width: "95px",
        height: "37.47px",
    },
    viewButton: {
        textTransform: "none",
        fontSize: "13px",
        width: "175px",
        height: "37.47px",
    },
    bidButton: {
        fontSize: "13px",
        fontWeight: 600,
        width: "100%",
        height: "37.47px",
        textTransform: 'none'
    },
    submitBtn: {
        fontSize: "11px",
        fontWeight: 600,
        // width: "120px",
        // height: '39.99px',
        textTransform: 'capitalize',
        // marginTop: '12px'
    }
});

// Utility to get query parameter value
const getQueryParam = (key: string) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(key);
};

export const useAuctionDetailStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: "column",
        gap: 10,
    },
    containerLive: {
        display: 'flex',
        flexDirection: "row",
        gap: 20,
    },
    lotContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
    },
    row: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 16,
    },
    iconText: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    flexItem: {
        // flex: '1',
    },
    text: {
        fontSize: "15px",
        color: theme.palette.primary.main2,
    },
    textLive: {
        fontSize: "16px",
        color: theme.palette.primary.main10,
    },
    viewButton: {
        textTransform: "none",
        fontSize: "13px",
        width: "175px",
        height: "37.47px",
    },
});