import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Pagination, Stack, Button, ToggleButton, ToggleButtonGroup, Fade, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import usePaymentTrackingStyles from "./InvoicesStyles";
import { getPaidInvoices, getUnpaidInvoices } from "../Services/Methods";
import NoRecordFound from "../../utils/NoRecordFound";
import { useNavigate } from "react-router-dom";
import InvoiceViewModal from "./InvoiceViewModal";
import Cookies from "js-cookie";
import { generateInvoiceHtml } from "./InvoiceTemplate";

const Invoices = () => {
    const classes = usePaymentTrackingStyles();
    const navigate = useNavigate();

    const [invoices, setInvoices]: any = useState([]);
    const [isFetchingData, setIsFetchingData] = useState(false);

    const [page, setPage] = useState<number>(0);
    const [selectedInvoice, setSelectedInvoice] = useState({});
    const [paidInvoice, setPaidInvoice] = useState<boolean>(true);
    const [viewDetails, setViewDetails] = useState(false);
    const rowsPerPage = 10;

    const user: any = sessionStorage.getItem('authToken') || Cookies.get('user');
    const clientId = (sessionStorage.getItem('authToken') ?
        JSON.parse(user).id : Cookies.get('user')
            ? JSON.parse(user).id : '')

    useEffect(() => {
        fetchInvoices();
    }, [paidInvoice])

    const fetchInvoices = async () => {
        setIsFetchingData(true)
        try {
            const response = paidInvoice
                ? await getPaidInvoices(clientId)
                : await getUnpaidInvoices(clientId);

            if (response.data && response.data.length > 0) {




                const formattedInvoices = response.data.map((invoice: any) => {
                    const bidDateParts = invoice.BidCreatedAt.split("-"); // Split "DD-MM-YYYY"
                    const bidDate = new Date(`${bidDateParts[2]}-${bidDateParts[1]}-${bidDateParts[0]}`); // Convert to Date object
                    bidDate.setDate(bidDate.getDate() + 3); // Add 3 days

                    const formattedPaymentDueDate = `${String(bidDate.getDate()).padStart(2, "0")}-${String(bidDate.getMonth() + 1).padStart(2, "0")}-${bidDate.getFullYear()}`; // Format as DD-MM-YYYY

                    return {
                        id: invoice.Id,
                        bidId: invoice.BidId,
                        lotId: invoice.LotId,
                        isPicked: invoice.IsPicked,
                        invoiceId: invoice.InvoiceId,
                        auctionId: invoice.AuctionId,
                        bidAmount: invoice.BidAmount,
                        bidCreatedAt: invoice.BidCreatedAt,
                        paymentDueDate: formattedPaymentDueDate, // Added payment due date
                        orderNo: invoice.OrderNo,
                        lotNo: invoice.LotNo,
                        location: invoice.Location,
                        shortDescription: invoice.ShortDescription,
                        longDescription: invoice.LongDescription,
                        image: invoice.Image,
                        bidStartAmount: invoice.BidStartAmount
                    };
                });

                setInvoices(formattedInvoices);
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

    const handleToggleInvoice = () => {
        if (!isFetchingData) {
            setPage(0);
            setPaidInvoice(!paidInvoice);
        }
    }
    const handleViewButton = (ind: number) => {
        setSelectedInvoice(invoices[ind]);
        setViewDetails(true)
    }

    const handlePayNow = (paymentId: any, lotId: number) => {
        navigate(`/cart?paymentId=${paymentId}&lotId=${lotId}`)
    }
    // Calculate the number of pages based on the length of tableData. Keep it
    const totalPages = Math.ceil(invoices.length / rowsPerPage);

    const handleInvoiceDownload = (ind: number) => {
        const invoice = invoices[ind];

        const invoiceHtml = generateInvoiceHtml(invoice);
        const blob = new Blob([invoiceHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice-${invoice.invoiceId}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Box >
            <Box className={classes.header}>
                <Typography className={classes.title}>{paidInvoice ? "Paid Invoices" : "Unpaid Invoices"}</Typography>
                <Box className={classes.toggleContainer}>
                    <ToggleButtonGroup
                        value={paidInvoice ? 'paid' : 'unpaid'}
                        exclusive
                        onChange={handleToggleInvoice}
                        sx={{ maxHeight: '30px' }}
                    >
                        <ToggleButton
                            value="paid"
                            className={`${classes.toggleButton} ${paidInvoice ? 'paid' : 'unpaid'}`}
                        >
                            Paid Invoices
                        </ToggleButton>
                        <ToggleButton
                            value="unpaid"
                            className={`${classes.toggleButton} ${!paidInvoice ? 'paid' : 'unpaid'}`}
                        >
                            Unpaid Invoices
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {!isFetchingData && invoices.length > 0 ?
                <Box>
                    <Table className={classes.paymentTable} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: '#19549F' }}>
                            <TableRow>
                                <TableCell sx={{ color: "white" }}>Item Description</TableCell>
                                <TableCell sx={{ color: "white" }}>Date Purchase</TableCell>
                                <TableCell sx={{ color: "white" }}>Payment Due Date</TableCell>
                                <TableCell sx={{ color: "white" }}>{paidInvoice ? "Pickup Status" : "Action"}</TableCell>
                                <TableCell sx={{ color: "white" }}>{paidInvoice ? "Details" : "Status"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, index: number) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.shortDescription}</TableCell>
                                    <TableCell>{row.bidCreatedAt}</TableCell>
                                    <TableCell>{row.paymentDueDate}</TableCell>
                                    <TableCell>
                                        {paidInvoice ?
                                            <Button variant={'contained'} className={classes.pickedButton}>{row.isPicked ? "Picked" : "Not Picked"}</Button>
                                            :
                                            <Button variant={'contained'} className={classes.viewButton} onClick={() => handleViewButton(index)}>View</Button>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {paidInvoice ?
                                            <Button variant={'contained'} className={classes.downloadButton} onClick={() => handleInvoiceDownload(index)}>Download</Button>
                                            :
                                            <Button variant={'contained'} className={classes.downloadButton} onClick={() => handlePayNow(row.id, row.lotId)}>Pay Now</Button>
                                        }
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

            <InvoiceViewModal open={viewDetails} onClose={() => setViewDetails(false)} invoice={selectedInvoice} />
        </Box >
    );
};

export default Invoices;
