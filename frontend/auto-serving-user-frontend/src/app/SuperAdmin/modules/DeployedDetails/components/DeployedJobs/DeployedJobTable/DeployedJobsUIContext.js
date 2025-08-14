import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../../../utils/UIHelpers";

const DeployedJobsUIContext = createContext();

export function useDeployedJobsUIContext() {
  return useContext(DeployedJobsUIContext);
}

export function DeployedJobsUIProvider({ deployedJobsUIEvents, children }) {
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
    openViewDeployedJobDialog: deployedJobsUIEvents.openViewDeployedJobBtnClick,
    openStopDeploymentJobDialog: deployedJobsUIEvents.stopDeploymentJobBtnClick
  };

  return (
    <DeployedJobsUIContext.Provider value={value}>
      {children}
    </DeployedJobsUIContext.Provider>
  );
}
