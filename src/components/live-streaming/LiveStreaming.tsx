import { useState, useEffect } from 'react';
import {
    Box,
    Fade,
    Container,
    Grid,
    CircularProgress,
    Typography,
} from '@mui/material';
import AuctionCard from '../auction/auction-components/AuctionCard';
import AuctionHeader from '../auction/auction-components/AuctionHeader';
import PaginationButton from '../auction/auction-components/PaginationButton';
import { getAllLocations, getCitiesByState, getCurrentLiveAuctions, getStatesByCountry } from '../Services/Methods';
import NoRecordFound from '../../utils/NoRecordFound';
import { ErrorMessage, SuccessMessage } from '../../utils/ToastMessages';
import theme from '../../theme';


const LiveStreaming = () => {
    const [isCurrentAuction, setIsCurrentAuction] = useState(true); // Toggle between Current and Past Auctions
    const [fadeIn, setFadeIn] = useState(false); // Fade control state
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [searchTerm, setSearchTerm]: any = useState(""); // Filtered data state

    // Filter location states:
    const [selectedLocation, setSelectedLocation]: any = useState("");
    const [filteredData, setFilteredData]: any = useState([]);
    const [paginationedData, setPaginationedData]: any = useState([]);
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
            setPaginationedData(filteredData.filter((item: any) => item.cityId === cityId && item.stateId === stateId && item.address === selectedLocation))
        } else {
            setPaginationedData(filteredData);
            setLocations(states);
        }
    }, [selectedLocation, cityId, stateId])

    const fetchCitiesByState = async () => {
        try {
            const response = await getCitiesByState(stateId);
            const cities = response.data;
            if (cities.length > 0) {
                const updatedCities = cities;
                setLocations(updatedCities);
            } else {
                setLocations([])
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
                const updatedAddresses = addresses.sort((a: any, b: any) => a.localeCompare(b)); // alphabetically ordered
                setLocations(updatedAddresses);
            } else {
                setLocations([])
            }
        } catch (error) {
        } finally {
        }
    };

    useEffect(() => {
        if (!isFetchingData) {
            setIsFetchingData(true)
            fetchLiveStreamingData();
        }
    }, [isCurrentAuction])

    const fetchLiveStreamingData = async () => {
        try {
            const response = await getCurrentLiveAuctions()
            if (response.data && response.data.length > 0) {
                const updatedData = response.data.map((item: any) => ({
                    id: item.Id,
                    name: item.Name,
                    image: item.Image,
                    description: item.Description,
                    isLive: item.LiveStreaming,
                    cityId: item.CityId,
                    stateId: item.StateId,
                    address: item.Address,
                    details: {
                        location: `${item.City}, ${item.Country}`,
                        dateRange: `${item.StartDate} to ${item.EndDate}`,
                        lotsAvailable: item.TotalLots // Replace with actual data if available
                    }
                }));

                setFilteredData(updatedData);
                setPaginationedData(updatedData)
            } else {
                setFilteredData([]);
                setPaginationedData([])
            }

            const locationResponse = await getStatesByCountry(1);
            if (locationResponse.data && locationResponse.data.length > 0) {
                const updatedLocation = locationResponse.data;
                setLocations(updatedLocation);
                setStates(updatedLocation);
            } else {
                setLocations([]);
            }

            setIsFetchingData(false)

        } catch (error) {
            setIsFetchingData(false)
        }
    };

    // Filtered Data based on `type` and `location`
    useEffect(() => {

        setFadeIn(false); // Trigger fade-out
        setTimeout(() => {
            setFadeIn(true); // Trigger fade-in after filtering
            // setFilteredData(liveStreamData);
        }, 200);
    }, []);


    return (
        <Box>
            <AuctionHeader
                headerType={"live"}
                isCurrent={isCurrentAuction}
                onToggle={() => setIsCurrentAuction((prev) => !prev)}
                setSearchTerm={setSearchTerm}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                cityId={cityId}
                stateId={stateId}
                setCityId={setCityId}
                setStateId={setStateId}
                locations={locations}
            />
            <Box sx={{ minHeight: "70vh" }}>
                {!isFetchingData && paginationedData?.length ?
                    <Fade in={fadeIn} timeout={200}>
                        <Container disableGutters maxWidth={false} sx={{ mt: 3 }}>
                            <Grid container spacing={3}>

                                {paginationedData
                                    .filter((auction: any) => {
                                        if (!searchTerm) return true; // Show all if no search term
                                        const lowerCaseTerm = searchTerm.toLowerCase();
                                        return (
                                            auction.id.toString().includes(searchTerm) || // Match ID
                                            auction.name.toLowerCase().includes(lowerCaseTerm) || // Match Name
                                            auction.details.location.toLowerCase().includes(lowerCaseTerm) // Match Location
                                        );
                                    })
                                    .length > 0 ? (
                                    paginationedData
                                        .filter((auction: any) => {
                                            if (!searchTerm) return true; // Show all if no search term
                                            const lowerCaseTerm = searchTerm.toLowerCase();
                                            return (
                                                auction.id.toString().includes(searchTerm) || // Match ID
                                                auction.name.toLowerCase().includes(lowerCaseTerm) || // Match Name
                                                auction.details.location.toLowerCase().includes(lowerCaseTerm) // Match Location
                                            );
                                        })
                                        .map((auction: any) => (
                                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={auction.id}>
                                                <AuctionCard
                                                    headerType={"live"}
                                                    cardData={auction}
                                                    setPaginationedData={setPaginationedData}
                                                />
                                            </Grid>
                                        ))
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: '50vh',
                                            width: '100%',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '25px', fontWeight: 700 }}>
                                            No match found for <span style={{ color: theme.palette.primary.main }}> "{searchTerm}"</span>
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Container>
                    </Fade>

                    : isFetchingData ?
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
                        :
                        <NoRecordFound />
                }
            </Box>

            <PaginationButton filteredData={filteredData} setPaginationedData={setPaginationedData} />

        </Box>
    );
};

export default LiveStreaming;
