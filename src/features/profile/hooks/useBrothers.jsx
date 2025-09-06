import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getBrothers } from "../store/profileSlice";

export const useBrothers = () => {
    const { brothers = [], loadingBrothers, brothersError, user } = useSelector(
        (state) => state.profile
    );
    const dispatch = useDispatch();

    // useEffect(() => {
    //     if (brothers.length === 0) {
    //     dispatch(getBrothers());
    //     }
    // }, [dispatch, brothers.length]);

    useEffect(() => {
    if (user?.id) {
        dispatch(getBrothers()); 
    }
    }, [dispatch, user?.id]);      

    return {
        brothers,
        loadingBrothers,
        brothersError,
        refreshBrothers: () => dispatch(getBrothers()),
    };
};
