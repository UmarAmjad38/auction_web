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
                                Current and Upcoming Auctions:
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                Upload blood test reports in PDF, JPG format and get
                                the AI-generated blood report.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowOutwardIcon />}
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
                                Learn More
                            </Button>
                        </Box>
                    </Card>
                    <Card className={classes.cardStyles}>
                        <Box className={classes.toolBox}>
                            <Typography variant="h6" className={classes.titleStyles}>
                                Past Auctions:
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                User enters the health data and our platform will use GPT-4
                                to give you the right suggestions about your health.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowOutwardIcon />}
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
                                Learn More
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
                                Shipping Services:
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                Our platform gets the DNA data of the user, then
                                integrates and provides personalized insights based on
                                predisposition.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowOutwardIcon />}
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
                                Learn More
                            </Button>
                        </Box>
                    </Card>
                    <Card className={classes.cardStyles}>
                        <Box className={classes.toolBox}>
                            <Typography variant="h6" className={classes.titleStyles}>
                                Featured Products:
                            </Typography>
                            <Typography variant="body2" sx={{ marginBottom: 2 }}>
                                Get into with our professional nutritionist and trainers to
                                get maximum health benefits.
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<ArrowOutwardIcon />}
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
                                Learn More
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </Box>
        </Box>)
}

export default AllTools