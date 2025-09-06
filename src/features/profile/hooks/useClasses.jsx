import { useSelector, useDispatch } from "react-redux";
import { getClasses } from "../store/profileSlice";
import { useEffect } from "react";

export const useClasses = () => {
    const { classes = [], loadingClasses, classesError } = useSelector(
        (state) => state.profile
    );
    const dispatch = useDispatch();

    useEffect(() => {
        if (classes.length === 0) {
        dispatch(getClasses());
        }
    }, [dispatch, classes.length]);

    return {
        classes,
        loadingClasses,
        classesError,
        refreshClasses: () => dispatch(getClasses()),
    };
};
