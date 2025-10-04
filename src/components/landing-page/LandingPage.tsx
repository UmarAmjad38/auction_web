import {
    Box,
    Typography,
    Button,

} from "@mui/material";
import { styled } from "@mui/material/styles";
import useLandingPageStyles from "./LandingPageStyles";
import CustomTextField from "../custom-components/CustomTextField";
import AllTools from "./components/AllTools";
import Feedback from "./components/Feedback";
import FeaturedAuctions from "./components/FeaturedAuctions";
import CurrentAuctionSection from "./components/CurrentAuctionSection";
import CurrentAuctionsByLocation from "./components/CurrentAuctionsByLocation";
import CardMediaSection from "./components/CardMediaSection";
import theme from "../../theme";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AnimatedText = styled(Typography)({
    animation: "fadeIn 2s ease-in-out",
    "@keyframes fadeIn": {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
    },
});

const LandingPage = () => {
    const classes = useLandingPageStyles()
    const navigate = useNavigate();

    const [search, setSearch] = useState("")

    return (
        <Box>
            {/* Animated Text Section */}
            <Box sx={{ textAlign: "center", marginBottom: 4, padding: "0 150px" }}>
                <AnimatedText sx={{
                    fontSize: '40px',
                    fontWeight: 600,
                    lineHeight: '55px',
                    color: theme.palette.primary.main5
                }}>
                    Easy to bid,
                    <Typography component={'span'} sx={{
                        fontSize: '40px',
                        fontWeight: 600,
                        lineHeight: '55px',
                        color: theme.palette.primary.main
                    }}>
                        &nbsp;simple process
                    </Typography>
                    , and no hidden fees - your ultimate auction
                    <Typography component={'span'} sx={{
                        fontSize: '40px',
                        fontWeight: 600,
                        lineHeight: '55px',
                        color: theme.palette.primary.main
                    }}>
                        &nbsp;experience&nbsp;
                    </Typography>
                    starts here!
                </AnimatedText>
            </Box>

            {/* Search Bar Section */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
            }}>
                <CustomTextField
                    value={search}
                    onChange={(e: any) => {
                        setSearch(e.target.value)
                    }}
                    placeholder="Search for auction listings here..."
                    sx={{
                        height: '40px',
                        width: '70%',
                    }}
                    InputProps={{
                        endAdornment: (
                            <Button
                                variant={'contained'}
                                onClick={() => navigate(`/current-auctions?search=${search}`)}
                                sx={{
                                    borderRadius: '15px',
                                    margin: "10px 0",
                                    height: '40px',
                                    width: '140px',
                                    textTransform: 'none'
                                }}
                            >
                                Search
                            </Button>
                        ),
                    }}
                />
            </Box>

            {/* Card Media Section */}
            <CardMediaSection />

            {/* Current Auctions By LocationSection */}
            <CurrentAuctionsByLocation />

            {/* All Tools Section*/}
            <AllTools />

            {/* Current Auctions Section */}
            <CurrentAuctionSection />

            {/* Featured items Section */}
            <FeaturedAuctions />

            {/* About us Section */}
            {/* <Feedback /> */}

        </Box>
    );
};

export default LandingPage;