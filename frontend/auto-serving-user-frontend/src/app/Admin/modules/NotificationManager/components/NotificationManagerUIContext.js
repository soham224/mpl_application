import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../utils/UIHelpers";

const NotificationManagerUIContext = createContext();

export function useNotificationManagerUIContext() {
  return useContext(NotificationManagerUIContext);
}

export function NotificationManagerUIProvider({ notificationManagerPageBaseUrlUIEvents, children }) {
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
    openNewNotificationManagerDialog: notificationManagerPageBaseUrlUIEvents.newNotificationManagerBtnClick,
    openEditNotificationManagerDialog: notificationManagerPageBaseUrlUIEvents.editNotificationManagerBtnClick,
    openChangeStatusNotificationManagerDialog:
    notificationManagerPageBaseUrlUIEvents.changeStatusNotificationManagerBtnClick
  };

  return (
    <NotificationManagerUIContext.Provider value={value}>
      {children}
    </NotificationManagerUIContext.Provider>
  );
}
