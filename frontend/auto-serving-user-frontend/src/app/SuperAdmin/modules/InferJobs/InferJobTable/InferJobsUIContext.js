import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../utils/UIHelpers";

const InferJobsUIContext = createContext();

export function useInferJobsUIContext() {
  return useContext(InferJobsUIContext);
}

export function InferJobsUIProvider({ inferJobsUIEvents, children }) {
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
    openNewInferJobDialog: inferJobsUIEvents.newInferJobBtnClick,
    openViewInferJobDialog: inferJobsUIEvents.openViewInferJobBtnClick,
  };

  return (
    <InferJobsUIContext.Provider value={value}>
      {children}
    </InferJobsUIContext.Provider>
  );
}
