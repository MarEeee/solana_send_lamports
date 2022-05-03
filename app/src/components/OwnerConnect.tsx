import React, { useState } from 'react'
import { Button, CircularProgress, TextField, Typography } from "@mui/material"
import { IOwnerProps } from '../types/IProps';


const OwnerConnect = (props: IOwnerProps) => {
    const {onClick, balance, isLoading, withdrawDonations} = props
    
    return (
        <article style={{display:'flex', flexDirection:'column'}}>
            <Typography>                    
                Glad to see you ! Here you can withdraw funds
            </Typography>
            <span> Fund funds available: {balance} SOL</span>
            <div style = {{display: 'flex'}}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={withdrawDonations}
                >
                    {isLoading ? <CircularProgress/> : 'Withdraw funds'}
                </Button>
                <Button variant="outlined" color="error" onClick={onClick}>
                    Disconnect wallet
                </Button>
            </div>
        </article>
    )
}

export default OwnerConnect