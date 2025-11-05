import React, {createContext, useCallback, useContext, useState} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "../../../../../utils/UIHelpers";

const HorizontalManagementUIContext = createContext();

export function useHorizontalManagementUIContext() {
    return useContext(HorizontalManagementUIContext);
}

export function HorizontalManagementUIProvider({ children}) {
    const [queryParams, setQueryParamsBase] = useState(initialFilter);
    const setQueryParams = useCallback(nextQueryParams => {
        setQueryParamsBase(prevQueryParams => {
            if (isFunction(nextQueryParams)) {
                nextQueryParams = nextQueryParams(prevQueryParams);
            }
            if (isEqual(prevQueryParams, nextQueryParams)) {
                return prevQueryParams;
            }

            return nextQueryParams;
        });
    }, []);

    const value = {
        queryParams,
        setQueryParams,
    };

    return <HorizontalManagementUIContext.Provider value={value}>{children}</HorizontalManagementUIContext.Provider>;
}
