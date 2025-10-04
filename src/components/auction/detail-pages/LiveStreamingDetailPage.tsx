import React, { useCallback, useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Container, Grid, IconButton, Button, Card, CardMedia, Stack, TextField } from '@mui/material';
import { getQueryParam } from '../../../helper/GetQueryParam';
import AuctionCard from '../auction-components/AuctionCard';
import PaginationButton from '../auction-components/PaginationButton';
import useLiveStreamDetailStyles from './detail-pages-components/LiveStreamingDetailStyles';
import { getAuctionDetailById, getBiddersByLotId, getLotDetailsById } from '../../Services/Methods';
import Cookies from 'js-cookie';
import { joinRoom, leaveRoom, sendMessage, setUserName } from '../../../utils/SocketMethods';
import ClientVideoStream from './VideoStreaming';
import YouTube from 'react-youtube';

const LiveStreamingDetailPage = ({ socket }: any) => {
    const classes = useLiveStreamDetailStyles();

    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isPastLot, setIsPastLot] = useState(false);
    // const [auctionDetails, setAuctionDetails]: any = useState({})
    const [auctionLots, setAuctionLots]: any = useState([])
    const [paginationedData, setPaginationedData]: any = useState([])
    const [bidAmount, setBidAmount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [liveBidders, setLiveBidders]: any = useState([]);
    const [bidders, setBidders]: any = useState([]);
    const [bidRanges, setBidRanges]: any = useState([]);

    const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
    const client = (sessionStorage.getItem('authToken') ?
        JSON.parse(user) : Cookies.get('user')
            ? JSON.parse(user) : '')


    useEffect(() => {
        if (!isFetchingData) {
            setIsFetchingData(true);
            fetchAuctionDetails()
        }
    }, [])

    useEffect(() => {
        const lotId = parseInt(getQueryParam("lotId") + "", 10);
        if (lotId) {
            handleNextLot(lotId);
        }
    }, [auctionLots])

    useEffect(() => {
        if (!socket || !auctionLots[currentIndex]?.roomId) return;

        setUserName(socket, client.name);
        joinRoom(socket, auctionLots[currentIndex].roomId);

        const handleJoinRoomError = (message: any) => {
            fetchBidders(auctionLots[currentIndex].id)
            setLiveBidders([])
        }

        const handleChatHistory = (message: any) => {
            setLiveBidders((prevBidders: any) => [...prevBidders, message]);
            setBidders([])
        }

        const handleNewMessage = (data: any) => {
            setBidders([])
            setLiveBidders((prevBidders: any) => [...prevBidders, data]);
        };

        // socket.on("chat-history", handleChatHistory);
        socket.on("chat-history", handleChatHistory);
        socket.on("send-message-room", handleNewMessage);
        socket.on("join-room-error", handleJoinRoomError);

        return () => {
            socket.off("send-message-room", handleNewMessage);
            socket.off("chat-history", handleChatHistory);
            socket.off("join-room-error", handleJoinRoomError);
            leaveRoom(socket, auctionLots[currentIndex].roomId)
        };
    }, [socket, auctionLots, currentIndex]);


    useEffect(() => {

        const fetchLotDetails = async () => {
            try {
                const response = await getLotDetailsById(auctionLots[currentIndex]?.id);
                const ranges = response.data?.BidsRange;
                const isPast = response.data?.Lot?.IsPast;
                setIsPastLot(isPast);
                if (ranges) {
                    setBidRanges(ranges);
                    const bidRange = ranges.find((range: any) => {
                        if (bidders.length) {
                            if (bidders[bidders.length - 1].amount >= range.StartAmount
                                && bidders[bidders.length - 1].amount < range.EndAmount) {
                                return true;
                            } else {
                                return false
                            }
                        } else if (liveBidders.length) {
                            if (liveBidders[liveBidders.length - 1].amount >= range.StartAmount
                                && liveBidders[liveBidders.length - 1].amount < range.EndAmount) {
                                return true;
                            } else {
                                return false
                            }
                        }
                    });

                    const amount = liveBidders.length
                        ? liveBidders[liveBidders.length - 1].amount + (bidRange ? bidRange.BidRange : 0)
                        : bidders.length ? bidders[bidders.length - 1].amount + (bidRange ? bidRange.BidRange : 0)
                            : auctionLots[currentIndex].highestBid;

                    setBidAmount(amount);
                } else {
                    setBidRanges([]);
                    setBidAmount(0)
                }
            } catch (error) {
                console.error('Error fetching lot details:', error);
            } finally {
            }
        };
        if (auctionLots.length) {
            fetchLotDetails();
        }
    }, [auctionLots, currentIndex, bidders])

    const fetchAuctionDetails = async () => {
        try {
            const response = await getAuctionDetailById(getQueryParam("aucId"));
            const lots = response.data.Lots;
            if (lots?.length > 0) {
                const formattedLots = lots.map((item: any) => ({
                    id: item.Id,
                    lotNumber: item.LotNo,
                    name: item.ShortDescription,
                    description: item.LongDescription,
                    countDown: "N/A",
                    location: "N/A",
                    image: item.Image,
                    isPast: item.IsPast,
                    type: "current",
                    highestBid: item.BidStartAmount,
                    sold: item.IsSold,
                    roomId: item.RoomId,
                    bidAmount: item.BidStartAmount,
                    isYoutube: item.IsYoutube || false,
                    youtubeId: item.YoutubeId || "",
                    details: {
                        description: item.LongDescription,
                        date: `${item.StartDate} to ${item.EndDate}`,
                        time: `${item.StartTime} to ${item.EndTime}`,
                        orderNumber: item.OrderNo,
                        lot: item.LotNo,
                        category: item.Category,
                        subCategory: item.SubCategory,
                        winner: {
                            email: "N/A", // Replace with actual data if available
                            phone: "N/A", // Replace with actual data if available
                            location: "N/A", // Replace with actual data if available
                        },
                    },
                }));
                setAuctionLots(formattedLots)
                fetchBidders(formattedLots[currentIndex].id)
                setPaginationedData(formattedLots)
            } else {
                setAuctionLots([])
                setPaginationedData([])
            }

        } catch (error) {
        } finally {
            setIsFetchingData(false);
        }
    };

    const fetchBidders = async (id: number) => {
        try {
            const response = await getBiddersByLotId(id);
            const bidders = response.data;
            if (bidders.length > 0) {
                const formattedBidders = response.data.map((bidder: any) => ({
                    id: bidder.Id,
                    clientId: bidder.ClientId,
                    name: bidder.Name,
                    amount: bidder.Amount + " USD",
                }));
                setBidders(formattedBidders)
            } else {
                setBidders([]);
            }
        } catch (error) {
        } finally {
        }
    }
    // Handle value change in the TextField
    const updateAmount = () => {
        const range: any = bidRanges.find((range: any) =>
            bidAmount >= range.startAmount &&
            bidAmount < range.endAmount
        );
        if (range) {
            setBidAmount(bidAmount + range.bidRange);
        } else {
            setBidAmount(bidAmount + 400);
        }
    }

    // Increment the bid amount
    const handleIncrement = () => {
        setBidAmount((prev: any) => prev + 1);
    };

    // Decrement the bid amount
    const handleDecrement = () => {
        setBidAmount((prev: any) => (prev > 0 ? prev - 1 : 0)); // Ensure it doesn't go below 0
    };

    const handleNextLot = (id?: number) => {
        setCurrentIndex((prevIndex) => {
            const newIndex = auctionLots.findIndex((lot: any) => lot.id === id);
            window?.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            return newIndex !== -1 ? newIndex : prevIndex; // Set index if found, otherwise keep previous index
        });
    };

    const handleSubmit = () => {
        updateAmount()

        const roomName = auctionLots[currentIndex].roomId;
        const message = `${client.name} has placed a bid of $${bidAmount} on this item.`;
        const lotID = auctionLots[currentIndex].id;
        const clientId = client.id;
        const amount = bidAmount;

        sendMessage(socket, roomName, message, lotID, clientId, amount)

    }

    const opts = {
        height: '450',
        width: '100%',
        playerVars: { autoplay: 1 },
    };

    return (
        <Box py={2}>
            {!isFetchingData && auctionLots.length > 0 ?
                <Box>
                    <Typography sx={{ marginTop: "20px", marginBottom: "40px", fontWeight: 600, fontSize: '40px' }}  >
                        Live Video Streaming:
                    </Typography>

                    {/* Streaming Card */}
                    <Card
                        sx={{
                            padding: "30px 30px 80px 30px",
                            borderRadius: "12px",
                            boxShadow: 3,
                            position: "relative",
                            marginBottom: '60px'
                        }}
                    >
                        {/* Image Section */}
                        <Box sx={{ position: "relative", marginBottom: "35px" }}>
                            {auctionLots[currentIndex].isYoutube && auctionLots[currentIndex]?.youtubeId?
                                <YouTube
                                    videoId={auctionLots[currentIndex]?.youtubeId}
                                    opts={opts}
                                    style={{
                                        cursor: "pointer",
                                        borderRadius: "15px",
                                        width: "100%",
                                    }}
                                />
                                :
                                <ClientVideoStream
                                    lotId={auctionLots[currentIndex].id}
                                    onNoCall={
                                        <CardMedia
                                            component="img"
                                            height="300"
                                            image={auctionLots[currentIndex].image}
                                            alt="Live Auction"
                                            sx={{ borderRadius: "12px", width: '100%', height: '640px' }}
                                        />
                                    }
                                />
                            }
                            <Button
                                variant="contained"
                                color="error"
                                className={classes.liveBtn}
                            >
                                Live Stream
                            </Button>
                            <Button
                                variant="contained"
                                className={classes.nameBtn}>
                                {bidders.length > 0 ? bidders[bidders.length - 1].name
                                    : liveBidders.length > 0
                                        ? liveBidders.reduce((prev: any, current: any) => (prev.amount > current.amount ? prev : current)).sender
                                        : 'No Heighest Bidder'}

                            </Button>
                            <Button
                                variant="contained"
                                className={classes.rateBtn}
                            >
                                Highest Bid: ${bidders.length > 0 ? bidders[bidders.length - 1].amount
                                    : liveBidders.length > 0
                                        ? liveBidders.reduce((prev: any, current: any) => (prev.amount > current.amount ? prev : current)).amount
                                        : '0'}
                            </Button>
                        </Box >

                        {/* Auction Title */}
                        < Typography
                            fontSize={'35px'}
                            sx={{ fontWeight: 600, marginBottom: "18px", maxWidth: '752px', color: '#2D3748' }}
                        >
                            {auctionLots[currentIndex].name}
                        </Typography >

                        {/* Auction Description */}
                        < Typography
                            sx={{ color: "#838383", marginBottom: "18px", fontSize: '18px', lineHeight: "1.6", maxWidth: '937px' }}
                        >
                            {auctionLots[currentIndex].description}
                        </Typography >
                        {!isPastLot &&
                            <Box>
                                < Typography sx={{ fontWeight: 600, fontSize: '22px', marginBottom: "15px" }}>
                                    Place Bid
                                </Typography >
                                <Stack mb={'30px'} direction="row" alignItems="center" spacing={2}>
                                    <Box className={classes.bidAmount}>
                                        <TextField
                                            placeholder="Enter Bid Amount"
                                            variant="outlined"
                                            value={bidAmount}
                                        />
                                    </Box>
                                    {/* 
                            <IconButton
                                className={classes.iconBtn} onClick={handleIncrement}>
                                <AddIcon />
                            </IconButton>

                            <IconButton
                                className={classes.iconBtn} onClick={handleDecrement}>
                                <RemoveIcon />
                            </IconButton> */}
                                </Stack>

                                <Button
                                    variant="contained"
                                    className={classes.submitBtn}
                                    onClick={() => handleSubmit()}
                                >
                                    Submit
                                </Button>
                            </Box>}
                    </Card >

                    {auctionLots.length > 0 &&
                        <Box overflow={'auto'} pt={3}>
                            <Box className={classes.titleWrapper}>
                                < Typography
                                    sx={{ marginTop: "20px", marginBottom: "40px", fontWeight: 600, fontSize: '40px' }}
                                >
                                    Upcoming Lots:
                                </Typography>

                            </Box>

                            <Container disableGutters maxWidth={false} sx={{ mt: 3, pl: 1 }}>
                                <Grid container spacing={3}>
                                    {
                                        paginationedData
                                            .map((lot: any) => (
                                                <Grid item xs={12} sm={6} md={4} xl={3} key={lot.id}>
                                                    <AuctionCard
                                                        headerType={'lots'}
                                                        cardData={lot}
                                                        setPaginationedData={setPaginationedData}
                                                        isLiveLot={true}
                                                        handleNextLot={handleNextLot}
                                                    />
                                                </Grid>
                                            ))
                                    }


                                </Grid>
                            </Container>
                            <PaginationButton filteredData={auctionLots} setPaginationedData={setPaginationedData} />
                        </Box>
                    }



                </Box>
                :
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '70vh',
                        width: '100%',
                    }}
                >
                    <CircularProgress size={70} disableShrink />
                </Box>
            }
        </Box >
    );
};

export default LiveStreamingDetailPage;
