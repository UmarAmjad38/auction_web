import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, ToggleButton, ToggleButtonGroup, Menu, MenuItem, IconButton } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import useAuctionHeaderStyles from './AuctionHeaderStyles';
import CustomTextField from '../../custom-components/CustomTextField';
import CloseIcon from '@mui/icons-material/Close';
import theme from '../../../theme';
import { getQueryParam } from '../../../helper/GetQueryParam';

const AuctionHeader = ({
    headerType = 'current-auctions', // Default to 'auction'
    isCurrent,
    onToggle,
    setSearchTerm,
    selectedLocation,
    setSelectedLocation,
    filterLots,
    cityId,
    stateId,
    setCityId,
    setStateId,
    locations,
}: any) => {
    const classes = useAuctionHeaderStyles();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [search, setSearch]: any = useState(""); // Filtered data state


    useEffect(() => {
        const searchedTerm = getQueryParam('search');
        if (searchedTerm) {
            setSearch(searchedTerm)
            setSearchTerm(searchedTerm);
            const url = new URL(window.location.href);
            url.searchParams.delete('search');
            window.history.replaceState({}, '', url);
        }
    }, []);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleFilterChange = (locationId: string) => {
        if (!stateId) {
            setStateId(locationId);
        } else if (!cityId) {
            setCityId(locationId);
        } else {
            setSelectedLocation((prev: any) => (prev === locationId ? null : locationId));
            handleMenuClose();
        }
    };


    const handleSearchChange = () => {
        setSearchTerm(search);
    };

    return (
        <Box>
            <Typography
                sx={{
                    fontSize: '40.85px',
                    fontWeight: 600,
                    color: theme.palette.primary.main1,
                    padding: "10px 0"
                }}
            >
                {headerType === 'listings' ? "All Lots Listing"
                    : headerType === 'live' ? "Live Stream"
                        : headerType === 'watchlist' ? "Watchlist:"
                            : "Current Auction"
                }
            </Typography>
            {
                headerType !== "watchlist" &&
                <Box className={classes.root}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: "60%", padding: "20px 0" }}>
                        <CustomTextField
                            value={search}
                            onChange={(e: any) => {
                                if (e.target.value === "") {
                                    setSearchTerm("");
                                }
                                setSearch(e.target.value)
                            }}
                            placeholder="Search for auction listings here..."
                            className={classes.searchField}
                            InputProps={{
                                endAdornment: (
                                    <Button variant={'contained'} className={classes.searchButton} onClick={handleSearchChange}>
                                        Search
                                    </Button>
                                ),
                            }}
                        />
                    </Box>

                    <Box className={classes.buttonContainer}>
                        <Box className={classes.toggleContainer}>
                            <ToggleButtonGroup
                                value={isCurrent ? 'current' : 'past'}
                                exclusive
                                onChange={onToggle}
                                sx={{ maxHeight: '30px' }}
                            >
                                <ToggleButton
                                    value="current"
                                    className={`${classes.toggleButton} ${isCurrent ? 'current' : 'past'}`}
                                >
                                    Current {(headerType === 'lots' || headerType === 'listings') ? 'Lots' : 'Auctions'}
                                </ToggleButton>
                                <ToggleButton
                                    value="past"
                                    className={`${classes.toggleButton} ${!isCurrent ? 'current' : 'past'}`}
                                >
                                    Past {(headerType === 'lots' || headerType === 'listings') ? 'Lots' : 'Auctions'}
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        <Button
                            variant="contained"
                            className={classes.filterButton}
                            onClick={handleMenuOpen}
                            startIcon={<FilterAltIcon />}
                            disabled={!locations.length ? true : false}
                        >
                            Location
                        </Button>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                            {locations.map((location: any) => (
                                <MenuItem
                                    key={location.Id ? location.id : location}
                                    onClick={() => handleFilterChange(location.Id ? location.Id : location)}
                                    className={`${classes.menuItem} ${selectedLocation === location ? 'selected' : ''}`}
                                >
                                    {location.Name ? location.Name : location}
                                </MenuItem>
                            ))}
                        </Menu>
                        {(selectedLocation !== "" || stateId > 0 || cityId > 0) ? (
                            <IconButton onClick={() => { setStateId(0); setCityId(0); setSelectedLocation(""); }}>
                                <CloseIcon style={{ color: 'red' }} />
                            </IconButton>)
                            : null
                        }
                    </Box>
                </Box>
            }
        </Box >
    );
};

export default AuctionHeader;
