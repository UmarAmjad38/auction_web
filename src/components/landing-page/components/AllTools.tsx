import { Box, Typography, Card, Button } from '@mui/material'
import React from 'react'
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import useLandingPageStyles from '../LandingPageStyles';

const AllTools = () => {
    const classes = useLandingPageStyles()

    return (
        <Box>
            <Typography
                variant="h4"
                sx={{
                    textAlign: "center",
                    marginBottom: '54px',
                }}
                className={classes.heading}
            >
                All the tools you
                <Typography className={classes.headingSpan} component={'span'}>
                    &nbsp;need&nbsp;
                </Typography>
                in one place
            </Typography>

            <Box className={classes.toolsWrapper}>
                <Box className={classes.toolsInfo}>

                    <Card className={classes.cardStyles}>
                        <Box className={classes.toolBox}>
                            <Typography className={classes.titleStyles}>
                                Current Auctions:
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                Discover the latest art auctions happening now. Browse through active listings, explore details, and place your bids in real time to secure your favorite artwork.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowOutwardIcon />}
                                onClick={() => window.open('https://parkersauction.com/current-auctions', '_blank')}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 500,
                                    backgroundColor: "#001F54",
                                    "&:hover": {
                                        backgroundColor: "#002D7E",
                                    },
                                    width: '140px',
                                    heught: '42px'
                                }}
                            >
                                Explore
                            </Button>
                        </Box>
                    </Card>
                    <Card className={classes.cardStyles}>
                        <Box className={classes.toolBox}>
                            <Typography variant="h6" className={classes.titleStyles}>
                                Past Auctions:
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                View results from previous auctions, check final bid prices, and explore which artworks were sold. Perfect for understanding market trends and valuation.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowOutwardIcon />}
                                onClick={() => window.open('https://parkersauction.com/current-auctions?filter=past', '_blank')}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 500,
                                    backgroundColor: "#001F54",
                                    "&:hover": {
                                        backgroundColor: "#002D7E",
                                    },
                                    width: '140px',
                                    heught: '42px'
                                }}
                            >
                                Explore
                            </Button>
                        </Box>
                    </Card>
                </Box>

                {/* Center Image */}
                <Box
                    sx={{
                        flex: 0.43,
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img
                        src="/assets/pngs/post-bidding.png"
                        alt="Auction Illustration"
                        style={{
                            maxWidth: "100%",
                            borderRadius: "12px",
                            padding: '10px',
                            border: '1px solid #E2E8F0'
                        }}
                    />
                </Box>

                {/* Right Column */}
                <Box className={classes.toolsInfo}>
                    <Card className={classes.cardStyles}>
                        <Box className={classes.toolBox}>
                            <Typography variant="h6" className={classes.titleStyles}>
                                Listings:
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                Browse our complete collection of art pieces available for sale. Each listing includes artist details, starting bid, and estimated value for quick insights.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowOutwardIcon />}
                                onClick={() => window.open('https://parkersauction.com/listings', '_blank')}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 500,
                                    backgroundColor: "#001F54",
                                    "&:hover": {
                                        backgroundColor: "#002D7E",
                                    },
                                    width: '140px',
                                    heught: '42px'
                                }}
                            >
                                Explore
                            </Button>
                        </Box>
                    </Card>
                    <Card className={classes.cardStyles}>
                        <Box className={classes.toolBox}>
                            <Typography variant="h6" className={classes.titleStyles}>
                                Live Streams:
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                Watch ongoing auctions live on our platform. Experience the thrill of bidding in real time and never miss a moment from any active auction event.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowOutwardIcon />}
                                onClick={() => window.open('https://parkersauction.com/live', '_blank')}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 500,
                                    backgroundColor: "#001F54",
                                    "&:hover": {
                                        backgroundColor: "#002D7E",
                                    },
                                    width: '140px',
                                    heught: '42px'
                                }}
                            >
                                Explore
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </Box>
        </Box>)
}

export default AllTools