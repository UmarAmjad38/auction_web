import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    CardMedia,
    Grid,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Divider,
    TextField,
} from "@mui/material";
import useDetailStyles from "./detail-pages-components/DetailPageStyles";
import { getQueryParam } from "../../../helper/GetQueryParam";

import { useNavigate } from "react-router-dom";
import { getLotDetailsById, placeBidRequest } from "../../Services/Methods";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import theme from "../../../theme";
import Cookies from "js-cookie";
import { ErrorMessage, SuccessMessage } from "../../../utils/ToastMessages";

const LotDetailPage = () => {
    const classes = useDetailStyles();
    const navigate = useNavigate();

    const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
    const client = (sessionStorage.getItem('authToken') ?
        JSON.parse(user) : Cookies.get('user')
            ? JSON.parse(user) : '');

    const [lotDetails, setLotDetails]: any = useState({})
    const [isFetchingData, setIsFetchingData] = useState(false)
    const [bidAmount, setBidAmount] = useState(0)
    const [amount, setAmount] = useState(bidAmount);

    const [lotImages, setLotImages] = useState([]);
    const [countdown, setCountdown] = useState('');
    const [bidRanges, setBidRanges]: any = useState([]);

    // const fakeBidRanges = [
    //     {
    //         id: 1,
    //         startAmount: 51,
    //         endAmount: 200,
    //         bidRange: 50,
    //     },
    //     {
    //         id: 2,
    //         startAmount: 200,
    //         endAmount: 502,
    //         bidRange: 100,
    //     },
    //     {
    //         id: 3,
    //         startAmount: 503,
    //         endAmount: 653,
    //         bidRange: 50,
    //     },
    //     {
    //         id: 4,
    //         startAmount: 653,
    //         endAmount: 1253,
    //         bidRange: 200,
    //     },
    // ];

    useEffect(() => {
    }, []);

    useEffect(() => {
        const calculateCountdown = () => {
            if (!lotDetails?.endDate || !lotDetails?.endTime) {
                setCountdown(''); // Handle missing data
                return;
            }

            // Split endDate into MM-DD-YYYY format
            const [day, month, year] = lotDetails.endDate.split('-').map(Number);

            // Create a Date object in LOCAL TIME
            const endDateTime = new Date(year, month - 1, day);

            // Extract hours and minutes from endTime (assume 12-hour format with AM/PM)
            const [time, period] = lotDetails.endTime.split(' ');
            let [hours, minutes] = time.split(':').map(Number);

            if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
            if (period.toLowerCase() === 'am' && hours === 12) hours = 0;

            // Set correct hours & minutes
            endDateTime.setHours(hours, minutes, 0, 0);

            if (isNaN(endDateTime.getTime())) {
                setCountdown(''); // Invalid date
                return;
            }

            const now = new Date();
            const remainingTime = endDateTime.getTime() - now.getTime();

            if (remainingTime > 0) {
                const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
                const seconds = Math.floor((remainingTime / 1000) % 60);

                setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
            } else {
                setCountdown(''); // Auction ended
            }
        };

        calculateCountdown(); // Initial calculation
        const interval = setInterval(calculateCountdown, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [lotDetails?.endDate, lotDetails?.endTime]);

    useEffect(() => {
        if (!isFetchingData) {
            setIsFetchingData(true);
            fetchLotDetails();
        }
    }, [])

    const fetchLotDetails = async () => {
        try {
            const response = await getLotDetailsById(getQueryParam('lotId'));
            const lot = response.data?.Lot;
            const images: any = [
                ...(lot.Image ? [lot.Image] : []),
                ...(response.data?.Images || []).map((img: any) => img.Image)
            ];
            const bidsRange = response.data?.BidsRange || [];

            if (lot) {
                const formattedLotDetails = {
                    id: lot.Id,
                    auctionId: lot.AuctionId,
                    lotNumber: lot.LotNo,
                    name: lot.ShortDescription,
                    description: lot.LongDescription,
                    countDown: "N/A", // Update if you calculate countdown elsewhere
                    location: "N/A", // Replace with actual location if available
                    image: lot.Image,
                    isPast: lot.IsPast,
                    type: lot.IsPast ? "past" : "current",
                    highestBid: lot.BidStartAmount,
                    sold: lot.IsSold,
                    buyerPremium: lot.BuyerPremium,
                    currency: lot.Currency,
                    images: images,
                    startDate: lot.StartDate,
                    endDate: lot.EndDate,
                    startTime: lot.StartTime,
                    endTime: lot.EndTime,
                    date: `${lot.StartDate} to ${lot.EndDate}`,
                    time: `${lot.StartTime} to ${lot.EndTime}`,
                    isLive: lot.IsLive,
                    details: {
                        description: lot.LongDescription,
                        date: `${lot.StartDate} to ${lot.EndDate}`,
                        time: `${lot.StartTime} to ${lot.EndTime}`,
                        orderNumber: lot.OrderNo,
                        lot: lot.LotNo,
                        category: lot.Category,
                        subCategory: lot.SubCategory,
                        auctionId: lot.AuctionId,
                        createdAt: lot.CreatedAt,
                        updatedAt: lot.UpdateddAt,
                    },
                    bidsRange: bidsRange.map((bid: any) => ({
                        id: bid.Id,
                        startAmount: bid.StartAmount,
                        endAmount: bid.EndAmount,
                        bidRangeAmount: bid.BidRange,
                    })),
                };
                setBidRanges(formattedLotDetails.bidsRange)
                setLotImages(images)
                setLotDetails(formattedLotDetails);
                const bidRange = formattedLotDetails.bidsRange.find((range: any) =>
                    formattedLotDetails.highestBid >= range.startAmount &&
                    formattedLotDetails.highestBid < range.endAmount
                );
                setBidAmount(formattedLotDetails.highestBid + (bidRange ? bidRange.bidRangeAmount : 0));
                setAmount(formattedLotDetails.highestBid + (bidRange ? bidRange.bidRangeAmount : 0));
            } else {
                setLotDetails([]);
                setLotImages([])
            }
        } catch (error) {
            setIsFetchingData(false);
        } finally {
            setIsFetchingData(false);
        }
    };

    const placeBid = async (payload: any) => {
        try {
            const response = await placeBidRequest(payload);
            if (response.status === 201) {
                
                // const range: any = bidRanges.find((range: any) =>
                //     bidAmount >= range.startAmount &&
                //     bidAmount < range.endAmount
                // );
                // if (range) {
                //     setBidAmount(bidAmount + range.bidRangeAmount);
                //     setAmount(bidAmount + range.bidRangeAmount);
                // } else {
                //     setBidAmount(bidAmount + 400);
                //     setAmount(bidAmount + 400);
                // }

                SuccessMessage('Bid placed successfully');
                // Re-fetch lot details to update current bid and next bid amount
                fetchLotDetails();
            } else {
                ErrorMessage('Failed to place bid');
            }
        } catch (error) {
            console.error('Failed to place bid', { variant: 'error' });
        }
    }

    const handleBidNow = () => {
        if (!client.id) {
            navigate('/login', { replace: true });  // This replaces current history entry
        } else {
            placeBid({ ClientId: client.id, LotId: lotDetails.id, Amount: bidAmount })
        }
    }

    return (

        <Box pt={'10px'} pb={'180px'}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography className={classes.title}>
                    Listing Details:
                </Typography>
            </Box>

            <Grid width={'100%'} ml={0} mt={'10px'} container spacing={4} justifyContent={'space-between'}>
                {/* Left Section */}
                <Grid item xs={12} md={6} className={classes.cardGrid}>
                    {/* Main Image */}
                    <CardMedia
                        component="img"
                        image={lotImages.length ? lotImages[0] : "/assets/pngs/list-detail.png"} // Replace with your image URL
                        alt="Main Product"
                        sx={{
                            width: "100%",
                            height: "363px",
                            borderRadius: "20px",
                            mb: 2,
                        }}
                    />
                    {/* Thumbnail Images */}
                    <Grid container spacing={2}>
                        {lotImages.slice(0, 4).map((img) => (
                            <Grid item xs={3} key={img}>
                                <CardMedia
                                    component="img"
                                    image={img || `${process.env.PUBLIC_URL}/assets/pngs/placeholder.png`}
                                    alt="Thumbnail"
                                    sx={{
                                        width: "100%",
                                        height: "100px",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Right Section */}
                <Grid sx={{ padding: '0 !important' }} item xs={12} md={5}>
                    {/* Product Details */}
                    <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '22px' }}>
                        {lotDetails.name}
                    </Typography>

                    <Typography sx={{ fontSize: "16px", fontWeight: 500, color: "#212121" }}>
                        ID: #{lotDetails.id}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography mb={'10px'} sx={{ fontSize: "18px", fontWeight: 600, color: "#2D3748" }}>
                        Date and Time
                    </Typography>

                    {/* Date and Time */}
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
                        <Box sx={{ display: "flex", alignItems: "center", flex: 0.7 }} >
                            <CalendarTodayIcon sx={{ fontSize: 15, color: "#012868", mr: 1 }} />
                            <Typography sx={{ fontSize: "14px", color: "#2D3748", fontWeight: 500, marginRight: '20px' }}>
                                {lotDetails.details?.date.replaceAll('-', '/')}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", flex: 0.7 }}>
                            <AccessTimeFilledIcon sx={{ fontSize: 15, color: "#012868", mr: 1 }} />
                            {countdown !== "" ?
                                <Typography sx={{ fontSize: "14px", color: "#757575", fontWeight: 500 }}>
                                    {countdown}
                                </Typography>
                                :
                                <Typography color={theme.palette.secondary.main} whiteSpace={'nowrap'}>
                                    Lot Ended
                                </Typography>
                            }
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Current Bid */}
                    <Typography
                        sx={{ fontSize: "25px", fontWeight: 600, color: '#012868', mt: 3, mb: '10px' }}
                    >
                        Current Bid: <span style={{ color: "#212121" }}>${lotDetails.highestBid}</span>
                    </Typography>

                    <Divider sx={{ my: 2 }} />
                    {!lotDetails.isPast &&
                        <Box>
                            {/* Bid Now Button */}
                            <Button
                                variant="outlined"
                                sx={{
                                    width: "326px",
                                    height: "64px",
                                    borderColor: "#012868",
                                    color: "#212121",
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    borderRadius: '14px',
                                    textTransform: 'none'
                                }}
                                onClick={() => handleBidNow()}
                            >
                                Bid Now: ${bidAmount}
                            </Button>

                            {/* <Divider sx={{ my: 2 }} /> */}

                            {/* Bid Price Section */}
                            {/* <Typography sx={{ fontWeight: 600, mt: '30px', fontSize: '18px' }}>Bid Price</Typography>
                            <Box className={classes.bidAmount} sx={{ display: "flex", alignItems: "center", mt: '10px' }}>
                                <TextField
                                    placeholder="Enter Your Bid Amount"
                                    variant="outlined"
                                    sx={{ flex: 1, mr: '10px' }}
                                    value={amount}
                                    onChange={(e: any) => setAmount(e.target.value)}
                                // inputProps={{ readOnly: true }}
                                />

                                <Button
                                    className={classes.submitBtn}
                                    variant="contained"
                                    onClick={() => handleBidNow()}
                                    disabled={amount < bidAmount}
                                >
                                    Submit
                                </Button>
                            </Box> */}
                        </Box>
                    }
                </Grid>
            </Grid>

            {/* Additional Details */}
            <Grid mt={'20px'} container spacing={2}>
                <Grid className={classes.lotDetail} item xs={12}>
                    <Typography sx={{ fontSize: "12px", color: "#012868", fontWeight: 600 }}>

                        Order Number:
                        <span style={{ color: "#212121" }}>#{lotDetails.details?.orderNumber}</span>
                        &nbsp;&nbsp;

                        Lot: <span style={{ color: "#212121" }}>{lotDetails.id}</span>
                        &nbsp;&nbsp;

                        Category:
                        <span style={{ color: "#212121" }}> &nbsp;{lotDetails.details?.category}</span>
                        &nbsp;&nbsp;

                        Sub-Category:
                        <span style={{ color: "#212121" }}> &nbsp;{lotDetails.details?.subCategory}</span>
                    </Typography>
                </Grid>
            </Grid>

            {/* Accordion Section */}
            <Grid width={'100%'} ml={0} mt={'20px'} container spacing={4} justifyContent={'space-between'}>

                <Grid item xs={12} md={6} sx={{ mt: 4 }} className={classes.accordianGrid}>
                    {[
                        { title: "Terms and Conditions", content: lotDetails?.termCondition || "No terms found for this lot!" },
                        { title: "Payment Information", content: lotDetails?.paymentTerms || "No terms found for this lot!" },
                        {
                            title: "Pickup and Shipping Details", content:
                                `We offer shipping for this lot. Please contact us for a quote. We use UPS, USPS, and FedEx for all shipping. We can also accommodate local pickup.`
                        },
                    ].map((item, index) => (
                        <Accordion
                            sx={{
                                marginBottom: index !== 2 ? '6px' : 0, // Adds 6px margin except for the last item
                                borderRadius: "8px", // Optional, for better UI
                                boxShadow: 'none',
                                border: '1px solid #E2E8F0'
                            }}
                            key={index}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                className={classes.accordianSummary}
                            >
                                {item.title}
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>{item.content}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Grid>
            </Grid>
        </Box >
    );
};

export default LotDetailPage;
