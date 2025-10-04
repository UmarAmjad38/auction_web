import { makeStyles } from "@mui/styles";

const useLandingPageStyles = makeStyles((theme: any) => ({
    heading: {
        fontSize: '40px',
        fontWeight: 600,
        lineHeight: '55px',
        color: theme.palette.primary.main5
    },
    headingSpan: {
        fontSize: '40px',
        fontWeight: 600,
        lineHeight: '55px',
        color: theme.palette.primary.main
    },
    searchBar: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    searchField: {
        height: '40px',
        width: '70%',
        // marginBottom: "40px"
    },
    searchButton: {
        borderRadius: '15px',
        margin: "10px 0",
        height: '40px',
        width: '140px',
        textTransform: 'none'
    },
    card: {
        borderRadius: '20px !important',
        padding: '10px !important',
        maxWidth: '620px !important',
        gap: '20px !important'
    },
    mediaCards: {
        paddingTop: '95px',
        paddingBottom: '36px'
    },
    headingStyles: {
        fontSize: '40px',
        fontWeight: 600
    },
    locationSection: {
        display: 'flex',
        flexDirection: 'column'
    },
    locationCards: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '45px'
    },
    cardStyles: {
        height: "267px",
        maxWidth: '320px',
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: '1px solid #E2E8F0'
    },
    titleStyles: {
        fontSize: '22px',
        fontWeight: 600,
        color: "#001F54",
        marginBottom: "40px",
    },
    allAuctions: {
        borderRadius: '6px',
        display: 'flex',
        justifyContent: 'center',
        alignSelf: 'center',
        height: '64px',
        width: '400px',
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '18px'
    },
    member: {
        fontSize: '40px',
        fontWeight: 700
    },
    ratingCard: {
        borderRadius: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        border: '1px solid #A8A8A8',
        maxWidth: '590px',
        padding: '54px 44px 75px 52px'
    },
    toolsWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: "10px",
        // flexWrap: 'wrap', // Ensures wrapping on smaller screens
    },
    toolsInfo: {
        flex: 0.3,
        display: 'flex',
        flexDirection: 'column',
        gap: "10px",
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    toolBox: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItmes: 'start',
        padding: "16px"
    },
    currentAuctionCard: {
        maxWidth: "386px",
        width: '-webkit-fill-available',
        height: '460px'
    }
}));

export default useLandingPageStyles;
