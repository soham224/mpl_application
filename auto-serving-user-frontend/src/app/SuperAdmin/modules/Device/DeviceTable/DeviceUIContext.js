import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../utils/UIHelpers";

const DeviceUIContext = createContext();

export function useDeviceUIContext() {
  return useContext(DeviceUIContext);
}

export function DeviceUIProvider({ deviceUIEvents, children }) {
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
    openNewDeviceDialog: deviceUIEvents.newDeviceButtonClick,
    openEditDeviceDialog: deviceUIEvents.editDeviceButtonClick,
    openChangeStatusDialog: deviceUIEvents.changeDeviceStatusButtonClick
  };

  return (
    <DeviceUIContext.Provider value={value}>
      {children}
    </DeviceUIContext.Provider>
  );
}
