import { Box, Card, CardMedia } from '@mui/material'
import React from 'react'
import useLandingPageStyles from '../LandingPageStyles'

const CardMediaSection = () => {
    const classes = useLandingPageStyles();
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: "95px 0" }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: "16px", width: "100%", }}>
                <Card className={classes.card}>
                    <CardMedia
                        component="img"
                        sx={{
                            maxHeight: "423px",

                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: '20px'
                        }}
                        image="/assets/pngs/land1.png"
                        alt="Card 1"
                    />
                </Card>
                <Card className={classes.card}>
                    <CardMedia
                        component="img"
                        sx={{

                            maxHeight: "423px",
                            objectFit: "cover",
                            objectPosition: "center",
                            borderRadius: '20px'

                        }}
                        image="/assets/pngs/land2.png"
                        alt="Card 2"
                    />
                </Card>
            </Box>
        </Box>
    )
}

export default CardMediaSection