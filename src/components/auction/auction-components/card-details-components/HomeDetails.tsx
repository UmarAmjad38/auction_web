import { Box, Button, Typography } from '@mui/material';
import PlaceIcon from '@mui/icons-material/Place';
import WatchLaterRoundedIcon from '@mui/icons-material/WatchLaterRounded';
import ViewInArRoundedIcon from '@mui/icons-material/ViewInArRounded';
import { useAuctionDetailStyles } from '../AuctionStyles';
import theme from '../../../../theme';
import { useState, useEffect } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const HomeDetails = ({ homeData }: any) => {
    const classes = useAuctionDetailStyles();

    return (
        <Box className={classes.lotContainer}>
            <Box mb={'20px'} display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                <CalendarTodayIcon sx={{ color: theme.palette.primary.main, fontSize: '15px' }} />
                <Typography className={classes.text} ml={1}>{homeData.date.replaceAll('-', '/')}</Typography>
            </Box>
        </Box>
    );
};

export default HomeDetails;
