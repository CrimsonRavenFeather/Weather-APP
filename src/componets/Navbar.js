import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import userContext from '../context/user_context'

export default function Navbar() {
    const { user, set_user, refreshToken, set_refreshToken } = useContext(userContext)
    
    const logOut = () =>{
        set_user('')
        set_refreshToken('')
    }

    return (
        <>
            <nav className="navbar bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Weather app</Link>
                    {user !="" && <Link className="navbar-brand" onClick={logOut} to="/">UnAuthorize</Link>}
                </div>
            </nav>
        </>
    )
}

