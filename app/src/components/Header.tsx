import React from 'react'
import { AppBar, Toolbar, Typography, Button, IconButton  } from '@mui/material';
import { IProps } from '../types/IProps'



const Header = (props: IProps): JSX.Element => {
    const { onClick, wallet } = props
    
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    maef test-project
                </Typography>
                {wallet && wallet.connected ?
                    <span>Wallet address: {wallet.publicKey?.toBase58()}</span>
                :
                    <Button color="inherit" onClick={onClick}>Connect wallet</Button>
                }                
            </Toolbar>
        </AppBar>
    )
}

export default Header