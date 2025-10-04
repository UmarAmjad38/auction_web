import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Pagination, Stack, Button, ToggleButton, ToggleButtonGroup, Fade, CircularProgress, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getBidHistory } from "../Services/Methods";
import NoRecordFound from "../../utils/NoRecordFound";
import PaymentViewModal from "./BidsViewModal";
import usePaymentTrackingStyles from "../invoices/InvoicesStyles";
import CustomTextField from "../custom-components/CustomTextField";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Cookies from "js-cookie";

const PaymentTracking = () => {
    const classes = usePaymentTrackingStyles();

    const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
    const client = (sessionStorage.getItem('authToken') ?
        JSON.parse(user) : Cookies.get('user')
            ? JSON.parse(user) : '')

    const [invoices, setInvoices]: any = useState([]);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const [page, setPage] = useState<number>(0);
    const [selectedInvoice, setSelectedInvoice] = useState({});
    const [isWinning, setIsWinning] = useState<boolean>(true);
    const [viewDetails, setViewDetails] = useState(false);

    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");


    const rowsPerPage = 10;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);


    useEffect(() => {
        if (!isFetchingData) {
            setIsFetchingData(true)
            fetchBidHistory();
        }
    }, [isWinning])

    // useEffect(() => {
    //     fetchBidHistory();
    // }, [isWinning])

    const handleFilterChange = (filter: any) => {
        setIsWinning(filter);
        handleMenuClose();
    };

    const fetchBidHistory = async () => {

        const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
        const clientId = (sessionStorage.getItem('authToken') ?
            JSON.parse(user).id : Cookies.get('user')
                ? JSON.parse(user).id : '')

        try {
            const response = isWinning
                ? await getBidHistory(client.id, true)
                : await getBidHistory(client.id, false);

            if (response.data && response.data.length > 0) {

                const formattedResponse = response.data.map((bid: any) => ({
                    id: bid.Id,
                    name: bid.Name,
                    highestBidderName: bid.HighestBidder,
                    totalBids: bid.TotalBids || 0,
                    currentPrice: `$${bid.CurrentPrice}`,
                    lot: bid.Lot,
                    client: bid.Client,
                }));

                setInvoices(formattedResponse);

            } else {
                setInvoices([]);
            }

        } catch (error) {
        } finally {
            setIsFetchingData(false)
        }
    };

    const handleChangePage = (_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage - 1); // Adjust for 0-based index
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPage(0);
    };

    const handleViewButton = (ind: number) => {
        setSelectedInvoice(invoices[ind]);
        setViewDetails(true)
    }
    // Calculate the number of pages based on the length of tableData
    const totalPages = Math.ceil(invoices.length / rowsPerPage);

    const handleSearchChange = (searchVal: any) => {
        if (searchVal === "") {
            setSearchTerm("");
        }
        setSearch(searchVal)
    };

    return (
        <Box >
            <Box className={classes.header}>
                <Typography className={classes.title}>Bid History</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: "60%", padding: "20px 0" }}>
                    <CustomTextField
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by Product Name, highest bidder name or current price..."
                        className={classes.searchField}
                        InputProps={{
                            endAdornment: (
                                <Button variant={'contained'} className={classes.searchButton} onClick={() => setSearchTerm(search)}>
                                    Search
                                </Button>
                            ),
                        }}
                    />
                </Box>

                <Box className={classes.buttonContainer}>
                    <Button
                        variant="contained"
                        className={classes.filterButton}
                        // onClick={handleMenuOpen}
                        startIcon={<FilterAltIcon />}
                        onClick={handleMenuOpen}
                    >
                        Filter
                    </Button>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem
                            onClick={() => handleFilterChange(true)}
                            className={`${classes.menuItem} ${isWinning ? 'selected' : ''}`}
                        >
                            Won
                        </MenuItem>

                        <MenuItem
                            onClick={() => handleFilterChange(false)}
                            className={`${classes.menuItem} ${!isWinning ? 'selected' : ''}`}
                        >
                            Lost
                        </MenuItem>
                    </Menu>
                    {/* <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        {locations.map((location: any) => (
                            <MenuItem
                                key={location}
                                onClick={() => handleFilterChange(location)}
                                className={`${classes.menuItem} ${selectedLocation === location ? 'selected' : ''}`}
                            >
                                {location}
                            </MenuItem>
                        ))}
                    </Menu> */}
                </Box>
            </Box>

            {!isFetchingData && invoices.length > 0 ?
                <Box>
                    <Table className={classes.paymentTable} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: '#19549F' }}>
                            <TableRow>
                                <TableCell sx={{ color: "white" }}>ID</TableCell>
                                <TableCell sx={{ color: "white" }}>Product Name</TableCell>
                                <TableCell sx={{ color: "white" }}>Highest Bidder Name</TableCell>
                                <TableCell sx={{ color: "white" }}>Total Bids</TableCell>
                                <TableCell sx={{ color: "white" }}>Current Price</TableCell>
                                <TableCell sx={{ color: "white" }}>Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices
                                .filter((bid: any) => {
                                    if (!searchTerm) return true; // Show all if no search term
                                    const lowerCaseTerm = searchTerm.toLowerCase();
                                    return (
                                        bid.name.toString().toLowerCase().includes(searchTerm) || // Match ID
                                        bid.highestBidderName.toLowerCase().includes(lowerCaseTerm) || // Match Name
                                        bid.currentPrice.toLowerCase().includes(lowerCaseTerm) // Match Location
                                    );
                                })
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, index: number) => (
                                    <TableRow key={row.id + index}>
                                        <TableCell>#{row.id}</TableCell>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.highestBidderName}</TableCell>
                                        <TableCell>{row.totalBids}</TableCell>
                                        <TableCell>{row.currentPrice}</TableCell>
                                        <TableCell>
                                            <Button variant={'contained'} className={classes.viewButton} onClick={() => handleViewButton(index)}>
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                    <Box className={classes.paginationWrapper}>
                        <Stack spacing={0}>
                            <Pagination
                                count={totalPages} // Set the total pages dynamically
                                page={page + 1} // Adjust for 1-based index
                                onChange={handleChangePage}
                                variant="outlined"
                                shape="rounded"
                            />
                        </Stack>
                    </Box>
                </Box>
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
                    <Box sx={{ maxHeight: "65vh" }}>
                        <NoRecordFound />
                    </Box>
            }

            <PaymentViewModal open={viewDetails} onClose={() => setViewDetails(false)} invoice={selectedInvoice} />
        </Box >
    );
};

export default PaymentTracking;

