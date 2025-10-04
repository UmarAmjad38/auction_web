// AppProviderStyles.tsx
import { makeStyles } from '@mui/styles';

export const useAppProviderStyles = makeStyles({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: (props: { isHomePage: boolean }) => props.isHomePage ? 'linear-gradient(to bottom, rgba(47, 131, 233, 0.2), rgba(47, 131, 233, 0))' : 'unset',
        backgroundSize: (props: { isHomePage: boolean }) => props.isHomePage ? '100% 45%' : 'unset',
        backgroundRepeat: (props: { isHomePage: boolean }) => props.isHomePage ? 'no-repeat' : 'unset',
        backgroundPosition: (props: { isHomePage: boolean }) => props.isHomePage ? 'top' : 'unset',
        backgroundColor: (props: { isHomePage: boolean }) => props.isHomePage ? 'none' : 'rgba(244, 244, 244, 0.5)',
        position: 'relative',
    },
    childContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: "0 80px"
    },
    header: {
        padding: "40px 80px",
        backgroundColor: (props: { isHomePage: boolean }) => props.isHomePage ? 'transparent' : 'white'
    }
});