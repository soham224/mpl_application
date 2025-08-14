import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../utils/UIHelpers";

const SupervisorUIContext = createContext();

export function useSupervisorUIContext() {
  return useContext(SupervisorUIContext);
}

export function SupervisorUIProvider({ children }) {
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
  };

  return (
    <SupervisorUIContext.Provider value={value}>
      {children}
    </SupervisorUIContext.Provider>
  );
}
