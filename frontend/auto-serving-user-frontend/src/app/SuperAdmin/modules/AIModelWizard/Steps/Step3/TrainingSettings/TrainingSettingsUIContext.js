import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./ExampleUIHelpers";

const TrainingSettingsUIContext = createContext();

export function useUsersUIContext() {
    return useContext(TrainingSettingsUIContext);
}

export const ExampleUIConsumer = TrainingSettingsUIContext.Consumer;

export function UsersUIProvider({usersUIEvents , children}) {
    const [queryParams, setQueryParamsBase] = useState(initialFilter);
    const [ids, setIds] = useState([]);
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

    const initUser = {
        id: undefined,
        userEmailId: "",
        companyEmailId: "",
        companyName: "",
        companyWebsite: "",
        companyContact: "",
        status: 0,
        // dateOfBbirth: "",
        // ipAddress: "",
        // type: 1
    };

    const value = {
        queryParams,
        setQueryParamsBase,
        ids,
        setIds,
        setQueryParams,
        initUser,
        newUserButtonClick: usersUIEvents.newUserButtonClick,
        openDeleteUserDialog: usersUIEvents.openDeleteUserDialog,
        openEditUserDialog: usersUIEvents.openEditUserDialog,
    };

    return <TrainingSettingsUIContext.Provider value={value}>{children}</TrainingSettingsUIContext.Provider>;
}
