import React, {createContext, useCallback, useContext, useState} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "../../../../../../../utils/UIHelpers";

const MyEventUIContext = createContext();

export function useMyEventUIContext() {
    return useContext(MyEventUIContext);
}

export function MyEventUIProvider({ myEventUIEvents, children }) {
    const [queryParams, setQueryParamsBase] = useState(initialFilter);
    const setQueryParams = useCallback((nextQueryParams) => {
        setQueryParamsBase((prevQueryParams) => {
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
        // openViewMyResultDialog: myResultUIEvents.openViewMyResultBtnClick,
        openChangeStatusDialog: myEventUIEvents.openChangeStatusBtnClick,
        openCardsClick: myEventUIEvents.openCardsClick,
    };

    return (
        <MyEventUIContext.Provider value={value}>
            {children}
        </MyEventUIContext.Provider>
    );
}
