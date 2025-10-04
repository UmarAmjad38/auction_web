import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import TempComponent from './TempComponent';
import AppProvider from '../components/layout/AppProvider';
import AuctionDetailPage from '../components/auction/detail-pages/AuctionDetailPage';
import LiveStreamingDetailPage from '../components/auction/detail-pages/LiveStreamingDetailPage';
import { ToastContainer } from 'react-toastify';

import Authentication from '../components/authentication/Authentication';
import CurrentAuctions from '../components/auction/CurrentAuctions';
import AuctionListings from '../components/auction/AuctionListings';
import MyBids from '../components/bids/MyBids';
import Invoices from '../components/invoices/Invoices';
import WatchList from '../components/auction/auction-components/Watchlist';
import LiveStreaming from '../components/live-streaming/LiveStreaming';
import LotDetailPage from '../components/auction/detail-pages/LotDetailPage';
import Cart from '../components/auction/auction-components/Cart';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';



// Page Components
const LandingPage = React.lazy(() => import('../components/landing-page/LandingPage'));
// const Auction = React.lazy(() => import('../components/auction/Auction'));
// ProtectedRoute Component
const PublicRoute = ({ children }: any) => {
    return <AppProvider>{children}</AppProvider>;
};

const ProtectedRoute = ({ isAuthenticated, children }: any) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    return <AppProvider>{children}</AppProvider>;
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string);

const Routing = ({ isAuthenticated, setIsAuthenticated, socket }: any) => {

    const location = useLocation()
    useEffect(() => {
        const handleRouteChange = (url: any) => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        };
        window.addEventListener('popstate', () => handleRouteChange(window.location.pathname));
        return () => window.removeEventListener('popstate', handleRouteChange);
    }, []);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, [location.pathname]);

    return (
        <Box style={{ display: 'flex' }}>
            {/* Main Content Area */}
            <Box style={{ flex: 1 }}>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>

                        {/* Login Route */}
                        <Route
                            path="/signup"
                            element={isAuthenticated ? <Navigate to="/home" /> : <Authentication setIsAuthenticated={setIsAuthenticated} />}
                        />

                        <Route path="/card-details" element={<Authentication setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/login" element={<Authentication setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/forgot-password" element={<Authentication setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/reset-password" element={<Authentication setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/new-password" element={<Authentication setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/email-verification" element={<Authentication setIsAuthenticated={setIsAuthenticated} />} />

                        {/* Protected Routes */}
                        <Route
                            path="/"
                            element={<Navigate to="/home" />}
                        />
                        <Route
                            path="/home"
                            element={
                                <PublicRoute>
                                    <LandingPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/current-auctions"
                            element={
                                <PublicRoute>
                                    <CurrentAuctions />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/current-auctions/details"
                            element={
                                <PublicRoute >
                                    <AuctionDetailPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/listings"
                            element={
                                <PublicRoute>
                                    <AuctionListings />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/listings/details"
                            element={
                                <PublicRoute>
                                    <LotDetailPage />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/live"
                            element={
                                <PublicRoute>
                                    <LiveStreaming />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/live/details"
                            element={
                                <PublicRoute >
                                    <LiveStreamingDetailPage socket={socket} />
                                </PublicRoute>
                            }
                        />
                        <Route
                            path="/invoices"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Invoices />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/bids"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <MyBids />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/watchlist"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <WatchList />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute isAuthenticated={isAuthenticated}>
                                    <Elements stripe={stripePromise}>
                                        <Cart />
                                    </Elements>
                                </ProtectedRoute>
                            }
                        />


                        <Route path="/logout" element={<TempComponent setIsAuthenticated={setIsAuthenticated} />} />

                    </Routes>
                </Suspense>
                <ToastContainer />
            </Box>
        </Box>
    );
};

export default Routing;

