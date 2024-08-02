import { useSelector } from "react-redux"
import { selectAccessToken } from "../feature/slice/userAuthSlice"
import { Navigate, Outlet, useLocation} from "react-router-dom"

export default function RequireAuth() {
    const accessTokenExist = useSelector(selectAccessToken)
    const location = useLocation()

    return (
        <>
            {accessTokenExist ? <Outlet /> : <Navigate to="/login" state={{from:location}} replace/>}
        </>
    )
}