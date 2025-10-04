import { Box, Grid, Typography, Stack, Avatar, Card, CardContent, Rating } from '@mui/material'
import useLandingPageStyles from '../LandingPageStyles'

const Feedback = () => {
    const classes = useLandingPageStyles()

    return (
        <Box sx={{ py: 18, px: 4 }}>
            <Grid container spacing={4} alignItems="center">
                {/* Left Section */}
                <Grid item xs={12} md={6}>
                    <Typography
                        sx={{ fontWeight: "700", fontSize: '40px', color: "#021526", mb: '14px' }}
                    >
                        What <Typography className={classes.member}
                            color={'primary'} component={'span'}>Our Member's</Typography>
                        <br />
                        Saying About Us
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ color: "text.secondary", mb: 4, maxWidth: '423px' }}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sem
                        velit viverra amet faucibus.
                    </Typography>
                    {/* Avatars */}
                    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: "center" }}>

                        <Stack direction="row" spacing={-2} sx={{ alignItems: "center" }}>
                            {["/assets/pngs/user1.png", "/assets/pngs/user2.png", "/assets/pngs/user3.png", "/assets/pngs/user4.png", "/assets/pngs/user5.png", "/assets/pngs/user6.png"].map((src, index) => (
                                <Avatar
                                    key={index}
                                    alt={`User ${index + 1}`}
                                    src={src}
                                    sx={{
                                        border: "2px solid white",
                                        width: 48,
                                        height: 48,
                                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                            ))}
                        </Stack>
                        <Typography sx={{ ml: 2, fontWeight: 600, fontSize: '16px' }}>
                            100+ Reviews
                        </Typography>
                    </Box>

                </Grid>

                {/* Right Section */}
                <Grid item xs={12} md={6}>
                    <Card className={classes.ratingCard}>
                        <CardContent>
                            <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>

                                <Stack direction="row" spacing={2} alignItems="center">
                                    {/* Avatar */}
                                    <Avatar
                                        alt="Jane Cooper"
                                        src="/assets/pngs/user4.png"
                                        sx={{ width: 56, height: 56 }}
                                    />
                                    {/* Name and Date */}
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '16px' }}>
                                            Jane Cooper
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "text.secondary" }}
                                        >
                                            12/4/17
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Rating */}
                                <Rating
                                    value={5}
                                    size="large"
                                    readOnly
                                    sx={{ color: "#FFD700" }}
                                />
                            </Box>

                            {/* Review Text */}
                            <Typography
                                variant="body2"
                                sx={{ color: "text.secondary", mt: '45px', fontSize: '16px', fontWeight: 400 }}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                Sem velit viverra amet faucibus. Lorem ipsum dolor sit
                                amet, consectetur adipiscing elit. Sem velit viverra amet
                                faucibus. Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sem velit viverra amet faucibus.
                            </Typography>


                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Feedback