import { useEffect } from "react";
import { request } from "./APIRequestService";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { LocationSlice } from "../app/Admin/modules/Locations/_redux/LocationSlice";
import Cookies from "universal-cookie";

const { actions } = LocationSlice;
const cookies = new Cookies(); // ✅ Use a single instance of Cookies

// ✅ fetchData now accepts isAuthorized and user from props instead of using useSelector
export const fetchData = async (dispatch, isAuthorized, user) => {
    if (!isAuthorized) {
        console.warn("User is not authorized. Skipping API call.");
        return;
    }

    const data = {
        time_period: 3,
        label_list: ["vehicle_stoppage", "traffic_congestions"],
    };

    try {
        const response = await request({
            method: "POST",
            endpoint: "/get_popup_data", // Replace with actual endpoint
            body: JSON.stringify(data),
        });

        if (response?.data?.length > 0) {
            dispatch(actions.popupData(response.data)); // ✅ Dispatch action
        }
    } catch (error) {
        console.error("API fetch error:", error);
    }
};

const FetchDataIneveryFiveMin = () => {
    const dispatch = useDispatch();

    const { isAuthorized, user } = useSelector(
        ({ auth }) => ({
            isAuthorized: !!auth.user?.id && !!cookies.get("access_token"), // ✅ Ensuring boolean value
            user: auth.user,
        }),
        shallowEqual
    );

    useEffect(() => {

        if (!isAuthorized) return; // ✅ Prevent unnecessary intervals if user is unauthorized

        const interval = setInterval(() => {
            fetchData(dispatch, isAuthorized, user);
        }, 180000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [isAuthorized, dispatch]); // ✅ Only depend on isAuthorized and dispatch

    return null; // No UI needed
};

export default FetchDataIneveryFiveMin;
