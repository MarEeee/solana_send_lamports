import Wallet from "@project-serum/sol-wallet-adapter"

export interface IProps {
    onClick: () => void
    wallet?: Wallet
}

export interface IMainProps extends IProps {
    balance: number
    isOwner : boolean   
    sendDonation: (lampoertsAmount: number) => void
    withdrawDonations: () => void
    isLoading: boolean
}
export interface IUsersProps {
    balance: number
    onClick: () => void 
    isLoading: boolean
}

export interface IUserProps extends IUsersProps {    
    sendDonation: (lampoertsAmount: number) => void   
}

export interface IOwnerProps extends IUsersProps {
    withdrawDonations: () => void
}