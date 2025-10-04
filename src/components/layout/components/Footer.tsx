import { Box, Typography, IconButton, Divider } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box
            sx={{
                backgroundColor: '#012868',
                padding: '95px 120px 25px 120px',
            }}
        >
            <Box sx={{
                color: '#ffffff', display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'flex-start',
                alignItems: { xs: 'flex-start', sm: 'flex-start' },
                gap: { xs: 8, sm: 4, md: 20 },
            }}>
                {/* Left Section: Logo and Description */}
                <Box sx={{ maxWidth: '366px' }}>
                    {/* <Typography sx={{ fontWeight: '600', fontSize: '24px', marginBottom: '18px', color: '#ffffff' }}>
                        Logo
                    </Typography> */}
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/pngs/pa-white.png`}
                        alt="Parker's Auction"
                        style={{ width: '35%', paddingBottom: '10px', margin: 0, cursor: 'pointer' }}
                        onClick={() => {
                            if (location.pathname === '/home') {
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            } else {
                                navigate('/home');
                            }
                        }}
                    />
                    <Typography mb={'16px'} ml={'8px'} variant="body2" sx={{ lineHeight: 1.8, fontSize: '16px', fontWeight: 400 }}>
                        Parker's Auction - Your reliable destination for quality auctions, rare finds, and unbeatable deals. Experience secure bidding and smart buying, every time.
                    </Typography>
                    {/* <Typography variant="body2" sx={{ lineHeight: 1.8, fontSize: '16px', fontWeight: 400 }}>
                        volutpat integer vel. In rhoncus
                        elementum nunc, malesuada mi sed. Nibh est sit lobortis id semper.
                    </Typography> */}
                </Box>

                {/* Middle Section: Useful Links */}
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: '600', fontSize: '24px', marginBottom: '18px', color: '#ffffff' }}>
                        Useful Links
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Link to="#" style={{ color: '#ffffff', textDecoration: 'none' }}>
                            Auctions
                        </Link>
                        <Link to="#" style={{ color: '#ffffff', textDecoration: 'none' }}>
                            View Catalog
                        </Link>
                        <Link to="#" style={{ color: '#ffffff', textDecoration: 'none' }}>
                            Testimonial
                        </Link>
                        <Link to="#" style={{ color: '#ffffff', textDecoration: 'none' }}>
                            Features
                        </Link>
                    </Box>
                </Box>
            </Box>

            {/* Right Section: Social Icons */}
            <Box display={'flex'} justifyContent={'flex-end'}>
                <Box sx={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <IconButton sx={{ color: '#ffffff' }}>
                        <FacebookIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#ffffff' }}>
                        <InstagramIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#ffffff' }}>
                        <TwitterIcon />
                    </IconButton>
                </Box>

            </Box>
            <Divider sx={{ backgroundColor: '#ffffff' }} />
            <Typography mt={3} variant="body2" sx={{ fontSize: '16px', fontWeight: 400, textAlign: 'center', color: '#ffffff' }}>
                © 2025 All Right Reserved
            </Typography>
        </Box>
    )
}

export default Footer