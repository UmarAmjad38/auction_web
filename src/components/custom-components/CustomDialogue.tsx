import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress } from '@mui/material'
import React from 'react'
import theme from '../../theme';

const CustomDialogue = ({ type, title, message, openDialogue, handleCloseModal, handleConfirmModal, isDeleting }: any) => {
    return (
        <Dialog open={openDialogue} onClose={handleCloseModal} >
            <DialogTitle>
                {title}
                {/* {type === "delete" ? "Confirm Deletion" : "Confirm Submission"} */}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ padding: "20px", gap: 1 }}>
                {type !== "addALot" &&
                    <Button
                        variant={'outlined'}
                        sx={{
                            textTransform: 'none',
                            width: '95px',
                            height: '37.47px'
                        }}
                        onClick={handleCloseModal}
                        color={"primary"}

                    >
                        {type === "delete" ? "Cancel" : "No"}

                    </Button>
                }
                <Button
                    variant={'contained'}
                    onClick={handleConfirmModal}
                    color={type === "delete" ? "error" : "primary"}
                    autoFocus
                    sx={{
                        textTransform: 'none',
                        width: '95px',
                        height: '37.47px'
                    }}
                >
                    {isDeleting ? <CircularProgress size={25} sx={{ color: theme.palette.primary.main3 }} /> :
                        type === "delete" ? "Delete" : type === "addALot" ? "Continue" : "Yes"
                    }

                </Button>

            </DialogActions>
        </Dialog >
    )
};

export default CustomDialogue