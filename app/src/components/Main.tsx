import React, { useState } from 'react'
import { Typography, Button, TextField, CircularProgress } from '@mui/material'
import { IMainProps } from '../types/IProps'
import UserConnect from './UserConnect'
import OwnerConnect from './OwnerConnect'




const Main = (props: IMainProps):JSX.Element => {
    const { onClick, wallet, balance, isOwner, sendDonation, withdrawDonations, isLoading } = props

    return (
        <section style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '90vh'}}>
            {wallet && wallet.connected ?
            <>
                {isOwner ? 
                    <OwnerConnect
                        onClick={onClick}
                        balance={balance}
                        withdrawDonations={withdrawDonations}
                        isLoading={isLoading}
                    />
                :
                    <UserConnect
                        onClick={onClick}
                        balance={balance}
                        sendDonation={sendDonation}
                        isLoading={isLoading}
                    />
                }
            </> 
            :
            <>
                <Typography>
                    Welcome to make a donation - connect your wallet.
                </Typography>            
                <Button variant="outlined" onClick={onClick}>Connect wallet</Button>
            </>
            }
            
        </section>
    )
}


export default Main