import { Card, CardMedia, Typography, Button, Tooltip, Box, TextField, IconButton, InputAdornment } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuctionCardStyles } from './AuctionStyles';
import AuctionDetails from './card-details-components/AuctionDetails';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import HomeDetails from './card-details-components/HomeDetails';
import LotDetails from './card-details-components/LotDetails';
import CurrentAuctionDetails from './card-details-components/CurrentAuctionDetails';
import Cookies from 'js-cookie';
import { ErrorMessage, SuccessMessage } from '../../../utils/ToastMessages';
import { addToWatchlist } from '../../Services/Methods';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';


const AuctionCard = ({
    headerType,
    cardData,
    isFaverited,
    setPaginationedData,
    isLiveLot,
    handleNextLot,
    liveLotFromListing
}: any) => {
    const classes = useAuctionCardStyles();
    const navigate = useNavigate();
    const location = useLocation();

    const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
    const dispatch = useDispatch();

    const [faverite, setFaverite] = useState(isFaverited)

    const handleCardMediaClick = () => {
        if (liveLotFromListing) {
            return navigate(`/live/details?aucId=${cardData.auctionId}&lotId=${cardData.id}`);
        } else if (isLiveLot) {
            return handleNextLot(cardData.id);
        }
        if (headerType === "live") {
            navigate(`/live/details?aucId=${cardData.id}`);
        } else if (headerType === "lots") {
            navigate(`/listings/details?lotId=${cardData.id}`);
        } else {
            navigate(`/current-auctions/details?aucId=${cardData.id}`);
        }
    };

    const handleBidNow = () => {
        if (user) {
            navigate(`/cart?aucId=${cardData.id}`)
        } else {
            navigate('/login')
        }
    }

    const handleAddWatchList = async (id: any) => {
        const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
        const clientId = (sessionStorage.getItem('authToken') ?
            JSON.parse(user).id : Cookies.get('user')
                ? JSON.parse(user).id : '')

        try {
            const response = await addToWatchlist(clientId, id)
            if (response.data) {
                response.data === "Removed from Wish List..."
                    ? SuccessMessage('Removed from watchlist!')
                    : SuccessMessage('Added to watchlist!')

                setFaverite(!faverite);

                if (response.data === "Removed from Wish List..." && location.pathname === '/watchlist') {
                    setPaginationedData((prev: any) => prev.filter((lot: any) => lot.id !== id))
                    // setHidden(true); // Hide card when removed
                }
            }
        } catch {
            ErrorMessage('Error adding to watchlist!')
        }
    };

    const handleSubmit = () => {
        if (cardData.isLive) {
            navigate(`/live/details?aucId=${cardData.auctionId}&lotId=${cardData.id}`)
        } else {
            navigate(`/listings/details?lotId=${cardData.id}`)
        }
    }

    return (
        <Card className={classes.card} elevation={2}>
            {/* Auction Image */}
            <Box sx={{
                position: 'relative', // Ensure the button is positioned relative to the Box
            }}>
                <CardMedia
                    onClick={handleCardMediaClick}
                    component="img"
                    height={"267"}
                    image={cardData.image}
                    alt={headerType === "Auction" ? "Auction" : "Lot" + " Image"}
                    className={classes.media}
                />
                {headerType === "lots"
                    && (sessionStorage.getItem('authToken') || Cookies.get('user'))
                    && (
                        <IconButton
                            sx={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                backgroundColor: '#012868',
                                color: '#ffffff',
                                '&:hover': { backgroundColor: '#001c48' },
                                boxShadow: 2,
                            }}
                            onClick={() => handleAddWatchList(cardData.id)} // Add your action here
                        >
                            {faverite ?
                                <FavoriteRoundedIcon />
                                :
                                <FavoriteBorderIcon />
                            }
                        </IconButton>
                    )}
                {
                    ((headerType === "lots" && cardData.isPast) || headerType === "live") &&

                    <Button
                        variant="contained"
                        size="small"
                        className={headerType === "live" ? classes.unSoldButtonLive : `${classes.soldButton} ${!cardData.sold ? classes.unSoldButton : ''}`}
                    >
                        {headerType === "live" && cardData?.isLive ? "Live Streaming Auction" : cardData.sold ? "Sold" : "Unsold"}
                    </Button>
                }
                {
                    (location.pathname === "/listings" && cardData.isLive) &&

                    <Button
                        variant="contained"
                        size="small"
                        className={classes.liveButton}
                    >
                        Live
                    </Button>
                }

            </Box>
            <Box className={classes.contentWrapper}>
                {/* Auction Details */}
                <Box className={classes.content}>
                    {/* Title */}
                    <Tooltip title={cardData.name}>
                        <Typography className={classes.title} gutterBottom>
                            {cardData.name?.length > 43 ? `${cardData.name.substring(0, 33)}...` : cardData.name}
                        </Typography>
                    </Tooltip>


                </Box>

                {/* Location, Date, and Lots */}
                {headerType === "auction" ? (
                    <AuctionDetails auction={cardData} />
                ) : headerType === "lots" ? (
                    <LotDetails lotData={cardData} />
                ) : headerType === "current-auction" || headerType === "live" ? (
                    <CurrentAuctionDetails auctionDetails={cardData} />
                ) :
                    <HomeDetails homeData={cardData} />
                }

                {/* Action Buttons */}
                <Box className={classes.actionButtons}>
                    {headerType === "auction" || headerType === "home" ?
                        <Button className={classes.viewButton} variant={"contained"} onClick={() => navigate(`/current-auctions/details?aucId=${cardData.id}`)} >
                            View Auction
                        </Button>
                        : headerType === "lots" ?
                            <Box display={'flex'} flexDirection={'column'} width={'100%'}>
                                <Button className={classes.bidButton} variant="contained" color="primary" onClick={() => handleBidNow()}>
                                    Bid Now ${cardData.bidAmount}
                                </Button>
                                {user &&
                                    <Box>
                                        <Typography m={'10px 0'} sx={{ fontSize: '12px', color: '#212121', fontWeight: 500 }}>
                                            You can enter your custom Amount
                                        </Typography>
                                        {/* <Box className={classes.lotDetails}>
                                            <Box minHeight={'40px'}>
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        flex: 1,
                                                        // width: '175px',
                                                        height: '31px',
                                                        '& .MuiInputBase-input::placeholder': {
                                                            fontSize: '13px',
                                                        },
                                                    }}
                                                    placeholder="Enter Bid Amount"
                                                />
                                            </Box>


                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.submitBtn}
                                                onClick={() => handleSubmit()}
                                            >
                                                Submit
                                            </Button>
                                        </Box> */}

                                        <Box >
                                            <TextField
                                                type='number'
                                                variant="outlined"
                                                size="small"
                                                placeholder="Enter Bid Amount"
                                                fullWidth
                                                sx={{
                                                    mb: 1,
                                                    flex: 1,
                                                    height: '31px',
                                                    '& .MuiInputBase-input::placeholder': { fontSize: '13px' },
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                className={classes.submitBtn}
                                                                onClick={handleSubmit}
                                                                sx={{ height: '31px', minWidth: '100px' }}
                                                            >
                                                                Submit
                                                            </Button>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                }
                            </Box>
                            : headerType === "live" ?
                                <Button onClick={() => navigate(`/live/details?aucId=${cardData.id}`)} className={classes.bidButton} variant="contained" color="primary">
                                    Join Auction
                                </Button>
                                : <Button className={classes.bidButton} variant="contained" color="primary" onClick={() => navigate(`/current-auctions/details?aucId=${cardData.id}`)} >
                                    View Auction
                                </Button>
                    }
                </Box>
            </Box>

        </Card >
    );
};

export default AuctionCard;
