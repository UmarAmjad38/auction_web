import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import theme from '../../theme';

interface CustomNavLinkProps {
    isSelected: boolean;
}


const CustomNavLink = styled(Link, { shouldForwardProp: (prop) => prop !== 'isSelected' })<CustomNavLinkProps>(({ isSelected }) => ({

    fontWeight: isSelected ? 700 : 500,
    padding: "8px",
    borderRadius: "4px",
    textDecoration: 'none',
    color: isSelected ? theme.palette.primary.main : theme.palette.primary.main1,
    transition: 'background-color 0.3s ease',
    '&:hover': {
        backgroundColor: theme.palette.primary.main6,
    },
}));

export default CustomNavLink;
