import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../utils/UIHelpers";

const FrameworkUIContext = createContext();

export function useFrameworkUIContext() {
  return useContext(FrameworkUIContext);
}

export function FrameworkUIProvider({ frameworkDetailsUIEvents, children }) {
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
    openNewFrameworkDialog: frameworkDetailsUIEvents.newFrameworkBtnClick,
    openEditFrameworkDialog: frameworkDetailsUIEvents.editFrameworkBtnClick,
    openChangeStatusFrameworkDialog:
      frameworkDetailsUIEvents.changeStatusFrameworkBtnClick,
  };

  return (
    <FrameworkUIContext.Provider value={value}>
      {children}
    </FrameworkUIContext.Provider>
  );
}
