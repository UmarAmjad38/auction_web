import { Dialog, DialogContent, IconButton, Typography, Box, Divider } from '@mui/material';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import useWinnerModalStyle from '../auction/detail-pages/detail-pages-components/WinnerModalStyles';
import { WidthFull } from '@mui/icons-material';

const InvoiceViewModal = ({ open, onClose, invoice }: any) => {
    const classes = useWinnerModalStyle();
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
            sx={{
                "& .MuiDialog-paper": {
                    height: "80vh",
                    overflowY: 'scroll',
                    '&::-webkit-scrollbar': {
                        width: 0, background: 'transparent'
                    }
                },
            }} // Adjust height here
        >
            <Box p={2}>
                <DialogContent className={classes.invoiceModalContent}>
                    <Typography variant='h4' py={2}>
                        Lot Details
                    </Typography>
                    <Box style={{ padding: '10px' }}>
                        <Box
                            key={invoice.id}
                            className={classes.bidderDetails}
                        >
                            {/* Bidder Image */}
                            <Box className={classes.bidderImageBox}>
                                <Box
                                    component="img"
                                    src={invoice.image || `${process.env.PUBLIC_URL}/assets/pngs/bidder.png`}
                                    alt={invoice.name}
                                    className={classes.bidderImage}
                                />
                                <Typography className={classes.bidderName}>
                                    {invoice.name}
                                </Typography>
                            </Box>

                            {/* Bidder Details */}
                            <Box className={classes.detailsWrapper}>
                                <Box className={classes.detail}>
                                    <Typography className={classes.bidderHeading}>
                                        Lot Id
                                    </Typography>
                                    <Typography className={classes.bidderValue}>
                                        #{invoice.lotId}
                                    </Typography>
                                </Box>
                                <Box className={classes.detail}>
                                    <Typography className={classes.bidderHeading}>
                                        Lot Number
                                    </Typography>
                                    <Typography className={classes.bidderValue}>
                                        {invoice.lotNo}
                                    </Typography>
                                </Box>
                                <Box className={classes.detail}>
                                    <Typography className={classes.bidderHeading}>
                                        Location
                                    </Typography>
                                    <Typography className={classes.bidderValue}>
                                        {invoice.location}
                                    </Typography>
                                </Box>
                                <Box className={classes.detail}>
                                    <Typography className={classes.bidderHeading}>
                                        Description
                                    </Typography>
                                    <Typography className={classes.bidderValue}>
                                        {invoice.shortDescription}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Typography variant='h4' py={2}>
                        Invoice Details
                    </Typography>
                    <Box className={classes.invoiceWrapper}>
                        <Box
                            key={invoice.id}
                            className={classes.bidderDetails}
                        >
                            {/* Invoice Details */}
                            <Box style={{ padding: '10px', width: '100%' }}>
                                {[
                                    { label: 'ID', value: `#${invoice.invoiceId}` },
                                    { label: 'Auction ID', value: `#${invoice.auctionId}` },
                                    { label: 'Product Description', value: invoice.shortDescription },
                                    { label: 'Pickup Status', value: invoice.isPicked ? 'Picked' : 'Not Picked' },
                                    { label: 'Date', value: invoice.bidCreatedAt },
                                    { label: 'Current Price', value: `$${invoice.bidAmount}` },
                                ].map((detail, index) => (
                                    <Box
                                        key={index}
                                        className={classes.bidderDetails}
                                    >
                                        <Box sx={{ flex: 0.3 }}>
                                            <Typography textAlign={'left'} className={classes.bidderHeading}>
                                                {detail.label}:
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 0.7 }}>
                                            <Typography textAlign={'left'} className={classes.paymentValue}>
                                                {detail.value}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>

            </Box>
        </Dialog>
    );
};

export default InvoiceViewModal;
