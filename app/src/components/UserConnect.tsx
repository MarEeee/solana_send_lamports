import React, { useState } from 'react'
import { Button, CircularProgress, TextField, Typography } from "@mui/material"
import { IUserProps } from '../types/IProps';


const UserConnect = (props: IUserProps) => {
    const {onClick, balance, isLoading, sendDonation} = props
    const [lamports, setLamports] = useState<string>('');
    
    return (
        <article style={{display:'flex', flexDirection:'column'}}>
            <Typography>                    
                Glad to see you ! Please enter donation amount
            </Typography>
            <TextField
                label="Amount"
                type="number"
                InputLabelProps={{
                    shrink: true,
                }}
                placeholder="0"
                value={lamports}
                onChange={e=>setLamports(e.target.value)}
                error={Number(lamports) > balance}
            />
            <span>Available balance: {balance} SOL</span>
            <div style = {{display: 'flex'}}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={()=>sendDonation(Number(lamports))}
                    disabled={!lamports || Number(lamports) > balance || isLoading}
                >
                    {isLoading ? <CircularProgress/> : 'Send donation'}
                </Button>
                <Button variant="outlined" color="error" onClick={onClick}>
                    Disconnect wallet
                </Button>
            </div>
        </article>
    )
}

export default UserConnect