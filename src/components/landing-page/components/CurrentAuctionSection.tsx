import { Box, Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import AuctionCard from '../../auction/auction-components/AuctionCard'
import useLandingPageStyles from '../LandingPageStyles'
import { getFeaturedAuctions, getFeaturedLots } from '../../Services/Methods'
import { useNavigate } from 'react-router-dom'

const CurrentAuctions = () => {
    const classes = useLandingPageStyles();
    const navigate = useNavigate();

    const [isFetchingData, setIsFetchingData] = useState(false);
    const [filteredData, setFilteredData]: any = useState([]);

    useEffect(() => {
        if (!isFetchingData) {
            setIsFetchingData(true)
            fetchAuctionData();
        }
    }, [])

    const fetchAuctionData = async () => {
        try {
            // Critical request:
            let response = await getFeaturedAuctions()
            if (response.data && response.data.length > 0) {

                const updatedData = response.data.map((item: any) => ({
                    id: item.Id,
                    name: item.Name,
                    image: item.Image,
                    endDate: item.EndDate,
                    endTime: item.EndTime,
                    date: `${item.StartDate} to ${item.EndDate}`,
                    time: `${item.StartTime} to ${item.EndTime}`,
                    details: {
                        location: `${item.City}, ${item.Country}`,
                        dateRange: `${item.StartDate} to ${item.EndDate}`,
                        lotsAvailable: item.TotalLots // Replace with actual data if available
                    }
                }));
                setFilteredData(updatedData.length > 2 ? updatedData.slice(0, 3) : updatedData);
            } else {
                setFilteredData([]);
            }

        } catch (error) {
            console.error('Error fetching auction data:', error);
        } finally {
            setIsFetchingData(false)
        }
    };

    const handleViewAllAuctions = () => {
        navigate('/current-auctions')
    }

    return (
        <Box className={classes.locationSection} py={10}>
            <Box sx={{ textAlign: "center", marginBottom: '54px' }}>
                <Typography className={classes.headingStyles} color="primary">
                    Our Current Auctions
                </Typography>
            </Box>
            <Box className={classes.locationCards} sx={{ marginBottom: '40px' }}>
                {filteredData.length ? filteredData.map((auction: any, index: number) => (
                    <Box sx={{
                        maxWidth: "386px",
                        width: '-webkit-fill-available',
                    }} key={index}>
                        <AuctionCard
                            headerType={"auction"}
                            cardData={auction}
                        />
                    </Box>
                ))
                    :
                    <Box pb={4} >
                        <Box p={8}>
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/pngs/norecord.png`}
                                alt="No Record"
                                style={{ width: '100%', height: '100%' }}
                            />
                        </Box>
                        <Typography variant="h6" color="textSecondary">
                            No current auctions found!
                        </Typography>
                    </Box>
                }
            </Box>

            <Button className={classes.allAuctions} variant={"contained"} onClick={handleViewAllAuctions}>
                View  All Auctions
            </Button>
        </Box >
    )
}

export default CurrentAuctions
