import { makeStyles } from '@mui/styles';
import theme from '../../../theme';

const useHeaderStyles = makeStyles({
    logo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: "100%",
        padding: "20px 0",
    },
    navLinks: {
        display: 'flex',
        alignItems: 'center',
        gap: "10px",
        marginLeft: "20px",
        fontWeight: "600"
    },
    avatar: {
        height: '30px',
        width: '30px',
        fontSize: 16,
        border: `2px solid ${theme.palette.primary.main7}`,
        backgroundColor: theme.palette.primary.main
    },
    dialogue: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogueTitle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: "20px"
    },
    dialogueContent: {
        width: "70%",
        height: "70%",
        padding: "10px 0"
    },
    textFieldWrapper: {
        width: '100%',
        // padding: '3px 0',
    },
    label: {
        fontWeight: 600,
        fontSize: 15,
        paddingTop: '16px',
    },
    dialogueButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: "20px"
    },
    buttonWrapper: {
        width: "50%",
        height: "50px",
        marginTop: '16px',
        fontSize: 16,
    },
    textFields: {
        padding: "10px 0"
    }
});

export default useHeaderStyles;
