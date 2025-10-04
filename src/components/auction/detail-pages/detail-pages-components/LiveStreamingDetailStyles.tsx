import { makeStyles } from '@mui/styles';
import theme from '../../../../theme';

const useLiveStreamDetailStyles = makeStyles(() => ({
    titleWrapper: {
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        gap: 15,
    },
    liveMedia: {
        cursor: "pointer",
        borderRadius: "15px",
        width: "100%",
    },
    countBadge: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: "100px",
        backgroundColor: theme.palette.primary.main,
        color: 'white',
        padding: "10px",
        fontSize: "12px",
        width: "10px",
        height: "10px",
    },
    cardContainer: {
        display: 'flex',
        gap: "15px",
        overflowX: 'scroll',
        padding: "10px 10px",
        '&::-webkit-scrollbar': {
            height: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
            height: '100px',
            backgroundColor: theme.palette.primary.main4,
            borderRadius: '10px',
        },
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        // padding: "10px",
        '@media (max-width: 600px)': {
            flexDirection: 'column',
        },
    },
    title: {
        fontSize: '30px',
        fontWeight: 600,
        color: theme.palette.primary.main,
    },
    card: {
        position: 'relative',
        padding: "12px",
        borderRadius: "20px",
    },
    mediaSection: {
        flex: 7,
        display: 'flex',
        flexDirection: 'column',
        // gap: theme.spacing(2),
    },
    cardMedia: {
        width: '100%',
        height: 'auto',
        borderRadius: "10px",
    },
    mediaButtonsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    mediaButton: {
        flex: 1,
        margin: "10px",
    },
    itemName: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    nextLotButton: {
        alignSelf: 'center',
        marginTop: "10px",
    },
    description: {
        textAlign: 'justify',
        margin: "10px",
    },
    detailsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: "10px",
    },
    detail: {
        fontSize: "13px",
    },
    rightSection: {
        flex: 3,
        display: 'flex',
        flexDirection: 'column',
        padding: "0 10px",
        // backgroundColor: "green",
    },
    liveBiddersHeader: {
        color: theme.palette.primary.main,
        fontWeight: '600',
        fontSize: "20px",
        marginBottom: "4px",
    },
    liveBiddersList: {
        maxHeight: '90vh',
        overflowY: 'hidden',
        // overflowX: 'hidden',
    },
    liveBidderItem: {
        padding: "10px",
        border: "1px solid #E2E8F0",
        borderRadius: "15px",
        marginBottom: "5px",
    },
    bidderBox: {
        display: "flex",
        flexDirection: "column",
        padding: "2px",
        marginLeft: "10px"
    },
    bidAmount: {
        '& .MuiInputBase-root': {
            width: "592px",
            height: "80px",
            borderRadius: "22px",
            backgroundColor: "#F7F9FC",
            border: '1px solid #E2E8F0',
            fontSize: '20px',
            padding: '20px 10px'
        }
    },
    liveBtn: {
        position: "absolute",
        top: "30px",
        left: "30px",
        backgroundColor: "#D32F2F",
        color: "#FFFFFF",
        fontWeight: 500,
        fontSize: '18px',
        textTransform: "none",
        width: '178px',
        height: '60px'
    },
    nameBtn: {
        position: "absolute",
        top: "30px",
        right: "295px",
        backgroundColor: "#012868",
        color: "#FFFFFF",
        textTransform: "none",
        fontWeight: 500,
        fontSize: '18px',
        padding: '18px 30px'
    },
    rateBtn: {
        position: "absolute",
        top: "30px",
        right: "30px",
        backgroundColor: "#012868",
        color: "#FFFFFF",
        textTransform: "none",
        fontWeight: 500,
        fontSize: '18px',
        padding: '18px 30px'
    },
    iconBtn: {
        border: "1px solid #E2E8F0",
        width: "40px",
        height: "40px",
        borderRadius: "50%"
    },
    submitBtn: {
        backgroundColor: "#012868",
        color: "#FFFFFF",
        textTransform: "none",
        width: '225px',
        height: '54px',
        fontSize: '20px',
        fontWeight: 500,
        borderRadius: '6px'
    },
    bidderName: { fontSize: "16px", color: theme.palette.primary.main10 },
    bidderMessage: { fontSize: "12px", color: theme.palette.primary.main10 },
}));

export default useLiveStreamDetailStyles;
