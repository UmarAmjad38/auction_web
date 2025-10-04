import { useState, useEffect } from 'react';
import {
    Box,
    Fade,
    Container,
    Grid,
    CircularProgress,
} from '@mui/material';
import NoRecordFound from '../../../utils/NoRecordFound';
import { getWatchlist } from '../../Services/Methods';
import AuctionCard from './AuctionCard';
import AuctionHeader from './AuctionHeader';
import PaginationButton from './PaginationButton';
import Cookies from 'js-cookie';



const WatchList = () => {
    const [fadeIn, setFadeIn] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const [isCurrentAuction, setIsCurrentAuction] = useState(true);
    const [selectedLocation, setSelectedLocation]: any = useState(null);
    const [filteredData, setFilteredData]: any = useState([]);
    const [paginationedData, setPaginationedData]: any = useState([]);
    const [searchTerm, setSearchTerm]: any = useState("");

    const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
    const clientId = (sessionStorage.getItem('authToken') ?
        JSON.parse(user).id : Cookies.get('user')
            ? JSON.parse(user).id : '')

    useEffect(() => {
        if (!isFetchingData) {

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
                        setFilteredData(updatedData);
                        setPaginationedData(updatedData)
                    } else {
                        setFilteredData([]);
                        setPaginationedData([])
                    }

                } catch (error) {
                } finally {
                    setIsFetchingData(false)
                }
            };
            if (clientId) {
                setIsFetchingData(true)
                fetchWatchlist();
            }

        }
    }, [])

    // Filtered Data based on `type` and `location`
    useEffect(() => {

        setFadeIn(false); // Trigger fade-out
        setTimeout(() => {
            setFadeIn(true); // Trigger fade-in after filtering
        }, 300);
    }, [paginationedData]);


    const isFaverited = (lotId: any) => {
        return filteredData.some((lot: any) => lot.id === lotId);
    }


    return (
        <Box sx={{ padding: "10px 0" }}>
            <AuctionHeader
                headerType={"watchlist"}
                isCurrent={isCurrentAuction}
                onToggle={() => {
                    if (!isFetchingData) {
                        setIsCurrentAuction((prev) => !prev)
                    }
                }}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                locations={[]}
                setSearchTerm={setSearchTerm}
            />

            <Box>
                {!isFetchingData && paginationedData?.length ?
                    <Fade in={fadeIn} timeout={300}>
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
                                    .map((auction: any) => (
                                        <Grid item xs={12} sm={6} md={4} xl={3} key={auction.id}>
                                            <AuctionCard
                                                headerType={"lots"}
                                                cardData={auction}
                                                isFaverited={isFaverited(auction.id)}
                                                setPaginationedData={setPaginationedData}
                                            />
                                        </Grid>
                                    ))}
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

export default WatchList;
