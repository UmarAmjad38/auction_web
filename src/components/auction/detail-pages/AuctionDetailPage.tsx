import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Card,
    CardMedia,
    Grid,
    CircularProgress,
    Container,
    IconButton,
    Divider,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Menu,
    MenuItem,
    capitalize,
} from "@mui/material";
import useDetailStyles from "./detail-pages-components/DetailPageStyles";
import { getQueryParam } from "../../../helper/GetQueryParam";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation, useNavigate } from "react-router-dom";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import AuctionCard from "../auction-components/AuctionCard";
import {
    getAllLocations,
    getAuctionDetailById,
    getCitiesByState,
    getCurrentLocations,
    getCurrentLots,
    getCurrentLotsByLocation,
    getPastLocations,
    getPastLots,
    getPastLotsByLocation,
    getStatesByCountry,
    getWatchlist,
} from "../../Services/Methods";
import PaginationButton from "../auction-components/PaginationButton";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CustomTextField from "../../custom-components/CustomTextField";
import theme from "../../../theme";
import Cookies from "js-cookie";
import CloseIcon from "@mui/icons-material/Close";

const AuctionDetailPage = () => {
    const classes = useDetailStyles();

    const [auctionDetails, setAuctionDetails]: any = useState([]);
    const [paginationedData, setPaginationedData]: any = useState([]);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [auctionLots, setAuctionLots] = useState<any[]>([]);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isCurrentAuction, setIsCurrentAuction] = useState(false);

    const [favouriteLots, setFavouriteLots]: any = useState([]);

    const user: any = sessionStorage.getItem("authToken") || Cookies.get("user");
    const clientId = sessionStorage.getItem("authToken")
        ? JSON.parse(user).id
        : Cookies.get("user")
            ? JSON.parse(user).id
            : "";

    // Filter location states:
    const [selectedLocation, setSelectedLocation]: any = useState("");
    const [filteredData, setFilteredData]: any = useState([]);
    const [stateId, setStateId]: any = useState(0);
    const [cityId, setCityId]: any = useState(0);
    const [locations, setLocations]: any = useState([]);
    const [states, setStates]: any = useState([]);

    useEffect(() => {
        if (stateId !== 0 && cityId === 0 && selectedLocation === "") {
            fetchCitiesByState();
        } else if (stateId !== 0 && cityId !== 0 && selectedLocation === "") {
            fetchAddresses();
        } else if (selectedLocation !== "") {
            setPaginationedData(
                filteredData.filter(
                    (item: any) =>
                        item.cityId === cityId &&
                        item.stateId === stateId &&
                        item.address === selectedLocation
                )
            );
        } else {
            setPaginationedData(filteredData);
            setLocations(states);
        }
    }, [selectedLocation, cityId, stateId]);

    const fetchCitiesByState = async () => {
        try {
            const response = await getCitiesByState(stateId);
            const cities = response.data;
            if (cities.length > 0) {
                const updatedCities = cities;
                setLocations(updatedCities);
            } else {
                setLocations([]);
            }
        } catch (error) {
        } finally {
        }
    };

    const fetchAddresses = async () => {
        try {
            const locationResponse = await getAllLocations();
            const addresses = locationResponse.data;
            if (addresses.length > 0) {
                const updatedAddresses = addresses.sort((a: any, b: any) =>
                    a.localeCompare(b)
                ); // alphabetically ordered
                setLocations(updatedAddresses);
            } else {
                setLocations([]);
            }
        } catch (error) {
        } finally {
        }
    };

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                // Critical request:
                const response = await getWatchlist(clientId);
                if (response.data && response.data.length > 0) {
                    const allLots = response.data.map((item: any) => item.Lots);

                    const updatedData = allLots.map((item: any) => ({
                        id: item.Id,
                        name: item.Name,
                        image: item.Image,
                        date: `${item.StartDate} to ${item.EndDate}`,
                        time: `${item.StartTime} to ${item.EndTime}`,
                        details: {
                            location: `${item.City}, ${item.Country}`,
                            dateRange: `${item.StartDate} to ${item.EndDate}`,
                            lotsAvailable: item.TotalLots, // Replace with actual data if available
                        },
                    }));
                    setFavouriteLots(updatedData);
                } else {
                    setFavouriteLots([]);
                }
            } catch (error) { }
        };
        if (clientId)
            fetchWatchlist();
    }, []);

    useEffect(() => {
        if (!isFetchingData) {
            setIsFetchingData(true);
            fetchAuctionDetails();
        }
    }, []);

    const fetchAuctionDetails = async () => {
        try {
            const response = await getAuctionDetailById(getQueryParam("aucId"));
            const auction = response.data.Auction;
            const lots = response.data.Lots;

            if (auction) {
                const formattedAuctionDetails = {
                    id: auction.Id,
                    name: auction.Name,
                    image: auction.Image,
                    type: auction.IsPast ? "past" : "current",
                    details: {
                        location: `${auction.City}, ${auction.Country}`,
                        dateRange: `${auction.StartDate} to ${auction.EndDate}`,
                        lotsAvailable: `${auction.TotalLots} Lots Available`,
                    },

                    dateRange: `${auction.StartDate} to ${auction.EndDate}`,
                    timeRange: `${auction.StartTime} to ${auction.EndTime}`,
                    previewDateRange: `${auction.PrevStartDate} to ${auction.PrevEndDate}`,
                    previewTimeRange: `${auction.PrevStartTime} to ${auction.PrevEndTime}`,
                    checkoutDateRange: `${auction.PrevStartDate} to ${auction.PrevEndDate}`,

                    description: auction.Description,
                    notes: auction.Notes,

                    liveStreaming: auction.LiveStreaming,
                    startDate: auction.StartDate,
                    endDate: auction.EndDate,
                    startTime: auction.StartTime,
                    endTime: auction.EndTime,
                    prevStartDate: auction.PrevStartDate,
                    prevEndDate: auction.PrevEndDate,
                    prevStartTime: auction.PrevStartTime,
                    prevEndTime: auction.PrevEndTime,
                    checkoutDate: auction.CheckOutDate,

                    country: auction.Country,
                    state: auction.State,
                    zipCode: auction.ZipCode,
                    city: auction.City,
                    address: auction.Address,
                    fullAddress: `Street ${auction.Address}, ${auction.City}, ${auction.ZipCode}, ${auction.State}, ${auction.Country}`,
                    shippingMethod: auction.ShippingMethod,
                    termsConditions: auction.TermsConditions,
                    paymentTerms: auction.PaymentTerms,
                    // termsConditions: "Welcome to our auction! By participating, you agree to our terms: All bids are binding and non-retractable. Items are sold without warranty, expressed or implied. Payment must be completed within 48 hours of auction close. Shipping costs are borne by the buyer, and delivery timelines may vary. We reserve the right to cancel or reschedule auctions without prior notice. Unauthorized use of our platform is prohibited. All sales are final; no returns or refunds will be entertained.",
                    // paymentTerms: "Welcome to our auction! By participating, you agree to our terms: All bids are binding and non-retractable. Items are sold without warranty, expressed or implied. Payment must be completed within 48 hours of auction close. Shipping costs are borne by the buyer, and delivery timelines may vary. We reserve the right to cancel or reschedule auctions without prior notice. Unauthorized use of our platform is prohibited. All sales are final; no returns or refunds will be entertained.",
                    createdAt: auction.CreatedAt,
                    updatedAt: auction.UpdateddAt,
                    isDeleted: auction.IsDeleted,
                    isSold: auction.IsSold,
                    totalLots: auction.TotalLots,
                };
                setIsCurrentAuction(formattedAuctionDetails.type === "current");
                setAuctionDetails(formattedAuctionDetails);

                // Format and set lots
                if (lots && lots.length > 0) {
                    const formattedLots = lots.map((item: any) => {
                        // Determine if lot is live or ended
                        const [day, month, year] = item.EndDate.split('-').map(Number);
                        const endDateTime = new Date(year, month - 1, day);
                        const [time, period] = item.EndTime.split(' ');
                        let [hours, minutes] = time.split(':').map(Number);
                        if (period.toLowerCase() === 'pm' && hours !== 12) hours += 12;
                        if (period.toLowerCase() === 'am' && hours === 12) hours = 0;
                        endDateTime.setHours(hours, minutes, 0, 0);
                        const now = new Date();
                        const isLive = endDateTime.getTime() > now.getTime();

                        return {
                            id: item.Id,
                            lotNumber: item.LotNo,
                            name: item.ShortDescription,
                            endDate: item.EndDate,
                            endTime: item.EndTime,
                            description: item.LongDescription,
                            countDown: "N/A",
                            location: "N/A",
                            image: item.Image,
                            type: "current",
                            bidAmount: item.BidStartAmount,
                            sold: item.IsSold,
                            date: `${item.StartDate} to ${item.EndDate}`,
                            time: `${item.StartTime} to ${item.EndTime}`,
                            auctionId: item.AuctionId,
                            cityId: item.CityId,
                            stateId: item.StateId,
                            address: item.Address,
                            isLive: isLive,
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
                        };
                    });
                    const liveLots = formattedLots.filter((lot: any) => lot.isLive);
                    setAuctionLots(liveLots);
                    setPaginationedData(liveLots);

                    // Fetch locations
                    const locationResponse = await getStatesByCountry(1);
                    if (locationResponse.data && locationResponse.data.length > 0) {
                        const updatedLocation = locationResponse.data;
                        setLocations(updatedLocation);
                        setStates(updatedLocation);
                    } else {
                        setLocations([]);
                    }
                } else {
                    setAuctionLots([]);
                    setPaginationedData([]);
                    setLocations([]);
                }
            } else {
                setAuctionDetails(null);
                setAuctionLots([]);
                setPaginationedData([]);
                setLocations([]);
            }
        } catch (error) {
        } finally {
            setIsFetchingData(false);
        }
    };



    useEffect(() => {
        if (selectedLocation) {
            setPaginationedData(
                auctionLots.filter((item: any) => item.address === selectedLocation)
            );
        } else {
            setPaginationedData(auctionLots);
        }
    }, [selectedLocation]);

    const isFaverited = (lotId: any) => {
        return favouriteLots.some((lot: any) => lot.id === lotId);
    };

    const handleFilterChange = (locationId: string) => {
        if (!stateId) {
            setStateId(locationId);
        } else if (!cityId) {
            setCityId(locationId);
        } else {
            setSelectedLocation((prev: any) =>
                prev === locationId ? null : locationId
            );
            handleMenuClose();
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <Box sx={{ padding: "10px 0" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography className={classes.title}>{auctionDetails.name}</Typography>
            </Box>

            {!isFetchingData ? (
                <Box>
                    <Grid container spacing={4} pb={4}>
                        {/* Left Section */}
                        <Grid item xs={12} md={6}>
                            <Card className={classes.card} elevation={2}>
                                {/* Main Image */}
                                <CardMedia
                                    component="img"
                                    image={auctionDetails.image}
                                    alt="Auction Image"
                                    className={classes.media}
                                    height={300}
                                />
                            </Card>

                            <Box paddingTop={3}>
                                {[
                                    {
                                        title: "Terms and Conditions",
                                        content: auctionDetails.termsConditions,
                                    },
                                    {
                                        title: "Payment Information",
                                        content: auctionDetails.paymentTerms,
                                    },
                                    {
                                        title: "Pickup and Shipping Details",
                                        content: auctionDetails.shippingMethod
                                            ? `We offer shipping for this lot. Please contact us for a quote. We use UPS, USPS, and FedEx for all shipping. We can also accommodate local pickup.`
                                            : "No shipping method for this lot.",
                                    },
                                ].map((item, index) => (
                                    <Accordion
                                        sx={{
                                            marginBottom: index !== 2 ? "6px" : 0, // Adds 6px margin except for the last item
                                            borderRadius: "8px", // Optional, for better UI
                                            boxShadow: "none",
                                            border: "1px solid #E2E8F0",
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
                            </Box>
                        </Grid>

                        {/* Right Section */}
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Typography
                                    sx={{
                                        fontSize: "22px",
                                        fontWeight: 600,
                                        color: theme.palette.primary.main11,
                                        flex: 1,
                                    }}
                                >
                                    Auction Details:
                                </Typography>
                                <Typography
                                    sx={{
                                        color: theme.palette.primary.main5,
                                        fontSize: "12px",
                                        paddingTop: "4px",
                                        textAlign: "justify",
                                    }}
                                >
                                    {auctionDetails.description}
                                </Typography>

                                <Divider sx={{ my: 2 }} />
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "70%",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "start",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Box
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <FiberManualRecordIcon
                                                sx={{ width: "15px", height: "15px" }}
                                                color="primary"
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: "18px",
                                                    color: theme.palette.primary.main11,
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Start & End Date
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <FiberManualRecordIcon
                                                sx={{
                                                    width: "15px",
                                                    height: "15px",
                                                    visibility: "hidden",
                                                }}
                                                color="primary"
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    color: theme.palette.primary.main1,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {auctionDetails.dateRange?.replaceAll("-", "/")}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "start",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Box
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <FiberManualRecordIcon
                                                sx={{ width: "15px", height: "15px" }}
                                                color="primary"
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: "18px",
                                                    color: theme.palette.primary.main11,
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Location
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <FiberManualRecordIcon
                                                sx={{
                                                    width: "15px",
                                                    height: "15px",
                                                    visibility: "hidden",
                                                }}
                                                color="primary"
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    color: theme.palette.primary.main1,
                                                    fontWeight: "500",
                                                }}
                                            >
                                                {auctionDetails.details?.location}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Divider sx={{ my: 2 }} />

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "start",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <FiberManualRecordIcon
                                            sx={{ width: "15px", height: "15px" }}
                                            color="primary"
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: "18px",
                                                color: theme.palette.primary.main11,
                                                fontWeight: "600",
                                            }}
                                        >
                                            Preview Date and Time
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <FiberManualRecordIcon
                                            sx={{
                                                width: "15px",
                                                height: "15px",
                                                visibility: "hidden",
                                            }}
                                            color="primary"
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                color: theme.palette.primary.main1,
                                                fontWeight: "500",
                                            }}
                                        >
                                            {auctionDetails.previewDateRange?.replaceAll("-", "/")}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "start",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <FiberManualRecordIcon
                                            sx={{ width: "15px", height: "15px" }}
                                            color="primary"
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: "18px",
                                                color: theme.palette.primary.main11,
                                                fontWeight: "600",
                                            }}
                                        >
                                            Checkout Date and Time
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <FiberManualRecordIcon
                                            sx={{
                                                width: "15px",
                                                height: "15px",
                                                visibility: "hidden",
                                            }}
                                            color="primary"
                                        />
                                        <Typography
                                            sx={{
                                                fontSize: "12px",
                                                color: theme.palette.primary.main1,
                                                fontWeight: "500",
                                            }}
                                        >
                                            {auctionDetails.checkoutDate?.replaceAll("-", "/") ||
                                                "N / A"}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "70%",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "start",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Box
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <FiberManualRecordIcon
                                                sx={{ width: "15px", height: "15px" }}
                                                color="primary"
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: "18px",
                                                    color: theme.palette.primary.main11,
                                                    fontWeight: "600",
                                                }}
                                            >
                                                Type
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                                        >
                                            <FiberManualRecordIcon
                                                sx={{
                                                    width: "15px",
                                                    height: "15px",
                                                    visibility: "hidden",
                                                }}
                                                color="primary"
                                            />
                                            <Typography
                                                sx={{
                                                    fontSize: "12px",
                                                    color: theme.palette.primary.main1,
                                                    fontWeight: "500",
                                                }}
                                                textTransform={"capitalize"}
                                            >
                                                {auctionDetails.type}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box overflow={"auto"} pt={3}>
                        <Box className={classes.titleWrapper}>
                            <Typography className={classes.title}>
                                All Auction Listing
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                width: "100%",
                                padding: "20px 0",
                            }}
                        >
                            <CustomTextField
                                value={search}
                                onChange={(e: any) => {
                                    if (e.target.value === "") {
                                        setSearchTerm("");
                                    }
                                    setSearch(e.target.value);
                                }}
                                placeholder="Search for auction listings here..."
                                className={classes.searchField}
                                InputProps={{
                                    endAdornment: (
                                        <Button
                                            variant={"contained"}
                                            className={classes.searchButton}
                                            onClick={() => setSearchTerm(search)}
                                        >
                                            Search
                                        </Button>
                                    ),
                                }}
                            />

                            <Box className={classes.buttonContainer}>
                                <Button
                                    variant="contained"
                                    className={classes.filterButton}
                                    onClick={handleMenuOpen}
                                    startIcon={<FilterAltIcon />}
                                    disabled={!locations.length ? true : false}
                                >
                                    Location
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    {locations.map((location: any) => (
                                        <MenuItem
                                            key={location.Id ? location.id : location}
                                            onClick={() =>
                                                handleFilterChange(location.Id ? location.Id : location)
                                            }
                                            className={`${classes.menuItem} ${selectedLocation === location ? "selected" : ""
                                                }`}
                                        >
                                            {location.Name ? location.Name : location}
                                        </MenuItem>
                                    ))}
                                </Menu>
                                {selectedLocation !== "" || stateId > 0 || cityId > 0 ? (
                                    <IconButton
                                        onClick={() => {
                                            setStateId(0);
                                            setCityId(0);
                                            setSelectedLocation("");
                                        }}
                                    >
                                        <CloseIcon style={{ color: "red" }} />
                                    </IconButton>
                                ) : null}
                            </Box>
                        </Box>

                        <Container disableGutters maxWidth={false} sx={{ mt: 3, pl: 1 }}>
                            <Grid container spacing={3}>
                                {paginationedData.filter((lot: any) => {
                                    if (!searchTerm) return true; // Show all if no search term
                                    const lowerCaseTerm = searchTerm?.toLowerCase();
                                    return (
                                        lot.id?.toString().includes(searchTerm) || // Match ID
                                        lot.name?.toLowerCase().includes(lowerCaseTerm) || // Match Name
                                        lot.details.location?.toLowerCase()?.includes(lowerCaseTerm) // Match Location
                                    );
                                }).length > 0 ? (
                                    paginationedData
                                        .filter((lot: any) => {
                                            if (!searchTerm) return true; // Show all if no search term
                                            const lowerCaseTerm = searchTerm.toLowerCase();
                                            return (
                                                lot.id.toString().includes(searchTerm) || // Match ID
                                                lot.name.toLowerCase().includes(lowerCaseTerm) || // Match Name
                                                lot.details.location
                                                    ?.toLowerCase()
                                                    .includes(lowerCaseTerm) // Match Location
                                            );
                                        })
                                        .map((lot: any) => (
                                            <Grid item xs={12} sm={6} md={4} xl={3} key={lot.id}>
                                                <AuctionCard
                                                    headerType={"lots"}
                                                    cardData={lot}
                                                    isFaverited={isFaverited(lot.id)}
                                                    setPaginationedData={setPaginationedData}
                                                />
                                            </Grid>
                                        ))
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: "50vh",
                                            width: "100%",
                                        }}
                                    >
                                        <Typography sx={{ fontSize: "25px", fontWeight: 700 }}>
                                            {searchTerm || selectedLocation ? (
                                                <>
                                                    No match found for{" "}
                                                    <span style={{ color: theme.palette.primary.main }}>
                                                        "{searchTerm || selectedLocation}"
                                                    </span>
                                                </>
                                            ) : (
                                                "No lots available for this auction"
                                            )}
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Container>
                        <PaginationButton
                            filteredData={auctionLots}
                            setPaginationedData={setPaginationedData}
                        />
                    </Box>
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "70vh",
                        width: "100%",
                    }}
                >
                    <CircularProgress size={70} disableShrink />
                </Box>
            )}
        </Box>
    );
};

export default AuctionDetailPage;
