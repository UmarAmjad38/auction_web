import { useState, useEffect } from 'react';
import {
    Box,
    Fade,
    Container,
    Grid,
    CircularProgress,
    Typography,
} from '@mui/material';
import AuctionCard from './auction-components/AuctionCard';
import AuctionHeader from './auction-components/AuctionHeader';
import PaginationButton from './auction-components/PaginationButton';
import {
    getAllLocations,
    getCitiesByState,
    getCurrentLocations, getCurrentLots, getCurrentLotsByLocation,
    getPastLocations, getPastLots, getPastLotsByLocation, getStatesByCountry, getWatchlist
} from '../Services/Methods';
import NoRecordFound from '../../utils/NoRecordFound';
import theme from '../../theme';
import Cookies from 'js-cookie';

const AuctionListings = () => {
    const [fadeIn, setFadeIn] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isCurrentAuction, setIsCurrentAuction] = useState(true);
    const [searchTerm, setSearchTerm]: any = useState("");
    const [favouriteLots, setFavouriteLots]: any = useState([]);

    const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
    const clientId = (sessionStorage.getItem('authToken') ?
        JSON.parse(user).id : Cookies.get('user')
            ? JSON.parse(user).id : '')

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

        const fetchWatchlist = async () => {

            try {
                // Critical request:
                const response = await getWatchlist(clientId)
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
                            lotsAvailable: item.TotalLots // Replace with actual data if available
                        }
                    }));
                    setFavouriteLots(updatedData);
                } else {
                    setFavouriteLots([]);
                }

            } catch (error) {

            }
        };
        if(clientId)
        fetchWatchlist();

    }, [])

    useEffect(() => {
        if (!isFetchingData) {
            setIsFetchingData(true)
            fetchAuctionData();
        }
    }, [isCurrentAuction])

    const fetchAuctionData = async () => {
        try {
            // Critical request:
            let response;
            if (isCurrentAuction) {
                response = await getCurrentLots()
            } else {
                response = await getPastLots();
            }


            if (response.data && response.data.length > 0) {
                const updatedData = response.data.map((item: any) => ({
                    id: item.Id,
                    auctionId: item.AuctionId,
                    name: item.ShortDescription,
                    image: item.Image,
                    isLive: item.IsLive,
                    date: `${item.StartDate} to ${item.EndDate}`,
                    time: `${item.StartTime} to ${item.EndTime}`,
                    endDate: item.EndDate,
                    endTime: item.EndTime,
                    bidAmount: item.BidStartAmount,
                    cityId: item.CityId,
                    stateId: item.StateId,
                    address: item.Address,
                    details: {
                        dateRange: `${item.StartDate} to ${item.EndDate}`,
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


        } catch (error) {

        } finally {
            setIsFetchingData(false)
        }
    };

    // Filtered Data based on `type` and `location`
    useEffect(() => {

        setFadeIn(false); // Trigger fade-out
        setTimeout(() => {
            setFadeIn(true); // Trigger fade-in after filtering
        }, 300);
    }, [paginationedData]);

    const isFaverited = (lotId: any) => {
        return favouriteLots.some((lot: any) => lot.id === lotId);
    }


    return (
        <Box sx={{ padding: "10px 0" }}>
            <AuctionHeader
                headerType={"listings"}
                isCurrent={isCurrentAuction}
                onToggle={() => {
                    if (!isFetchingData) {
                        setIsCurrentAuction((prev) => !prev)
                    }
                }}
                setSearchTerm={setSearchTerm}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                cityId={cityId}
                stateId={stateId}
                setCityId={setCityId}
                setStateId={setStateId}
                locations={locations}
            />

            <Box>
                {!isFetchingData && paginationedData?.length ?
                    <Fade in={fadeIn} timeout={300}>
                        <Container disableGutters maxWidth={false} sx={{ mt: 3 }}>
                            <Grid container spacing={3}>
                                {paginationedData
                                    .filter((lot: any) => {
                                        if (!searchTerm) return true; // Show all if no search term
                                        const lowerCaseTerm = searchTerm.toLowerCase();
                                        return (
                                            lot.id.toString().includes(searchTerm) || // Match ID
                                            lot.name.toLowerCase().includes(lowerCaseTerm)
                                        );
                                    })
                                    .length > 0 ? (
                                    paginationedData
                                        .filter((lot: any) => {
                                            if (!searchTerm) return true; // Show all if no search term
                                            const lowerCaseTerm = searchTerm.toLowerCase();
                                            return (
                                                lot.id.toString().includes(searchTerm) || // Match ID
                                                lot.name.toLowerCase().includes(lowerCaseTerm)
                                            );
                                        })
                                        .map((lot: any) => (
                                            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={lot.id}>
                                                <AuctionCard
                                                    headerType={"lots"}
                                                    cardData={lot}
                                                    isFaverited={isFaverited(lot.id)}
                                                    setPaginationedData={setPaginationedData}
                                                    liveLotFromListing={lot.isLive}
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

        </Box >
    );
};

export default AuctionListings;
