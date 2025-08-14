import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../utils/UIHelpers";

const UsersUIContext = createContext();

export function useUsersUIContext() {
  return useContext(UsersUIContext);
}

export function UsersUIProvider({ usersUIEvents, children }) {
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
    newUserButtonClick: usersUIEvents.newUserButtonClick,
    openEditUserDialog: usersUIEvents.openEditUserDialog,
    openUserServiceDialog : usersUIEvents.openUserServiceDialog,
    openViewUsersDetailsDialog: usersUIEvents.openViewUsersDetailsDialog,
    openChangeStatusDialog: usersUIEvents.openChangeStatusDialog,
  };

  return (
    <UsersUIContext.Provider value={value}>{children}</UsersUIContext.Provider>
  );
}
