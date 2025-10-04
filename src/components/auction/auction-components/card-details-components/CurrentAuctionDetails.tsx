import { Box, Button, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import WatchLaterRoundedIcon from '@mui/icons-material/WatchLaterRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import { useAuctionDetailStyles } from '../AuctionStyles';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import theme from '../../../../theme';

const AuctionDetails = ({ auctionDetails }: any) => {
    const classes = useAuctionDetailStyles();

    return (
        <Box className={classes.container}>

            <Typography color='#2A2A2A' fontSize={'14px'} fontWeight={500}>
                {auctionDetails.details.address}
            </Typography>

            <Box className={classes.row}>
                {/* Date Range */}
                <Box mb={'20px'} className={`${classes.iconText} ${classes.flexItem}`}>
                    <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                        <CalendarTodayIcon sx={{ color: theme.palette.primary.main, fontSize: '15px' }} />
                        <Typography className={classes.text} ml={1}>
                            {auctionDetails.details.dateRange.replaceAll('-', '/')}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* Row 2 */}
            {/* Lots Available */}
            {/* <Box className={classes.row}>
                <Box className={classes.iconText}>
                    <ViewInArRoundedIcon fontSize="small" color="primary" />
                    <Typography className={classes.text}>
                        {auctionDetails.lotsAvailable > 0 ? auctionDetails.lotsAvailable : "No"}&nbsp;
                        {auctionDetails.lotsAvailable > 1 ? "Lots" : "Lot"}&nbsp;Available
                    </Typography>
                </Box>
            </Box> */}
        </Box>
    );
};

export default AuctionDetails;
