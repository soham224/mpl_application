import React, {createContext, useCallback, useContext, useState} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "../../../../../../../utils/UIHelpers";

const ViewAIModelUIContext = createContext();

export function useAIModelUIContext() {
    return useContext(ViewAIModelUIContext);
}

export function AIModelUIProvider({aiModelUIEvents , children}) {
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
        openEditAIModelDialog: aiModelUIEvents.openEditAIModelDialog,
        openViewAIModelsDetailsDialog: aiModelUIEvents.openViewAIModelsDetailsDialog,
        openChangeStatusDialog: aiModelUIEvents.openChangeStatusDialog
    };

    return <ViewAIModelUIContext.Provider value={value}>{children}</ViewAIModelUIContext.Provider>;
}
