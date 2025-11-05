import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";

const DeployedJobsUIContext = createContext();

export function useDeployedJobsUIContext() {
  return useContext(DeployedJobsUIContext);
}

export function DeployedJobsUIProvider({ deployedJobsUIEvents, children }) {
  const [queryParams, setQueryParamsBase] = useState({
    sortOrder: "asc", // asc||desc
    sortField: "idxx",
    pageNumber: 1,
    pageSize: 10
  });
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
    openViewDeployedRTSPJobDialog:
      deployedJobsUIEvents.openViewDeployedRTSPJobBtnClick,
    openViewCameraSettingsDialog:
      deployedJobsUIEvents.openViewCameraSettingsBtnClick
  };

  return (
    <DeployedJobsUIContext.Provider value={value}>
      {children}
    </DeployedJobsUIContext.Provider>
  );
}
