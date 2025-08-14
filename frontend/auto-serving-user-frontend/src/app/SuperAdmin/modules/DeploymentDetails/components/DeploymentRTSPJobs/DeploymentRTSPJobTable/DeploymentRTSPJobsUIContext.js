import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../../../utils/UIHelpers";

const DeploymentRTSPJobsUIContext = createContext();

export function useDeploymentRTSPJobsUIContext() {
  return useContext(DeploymentRTSPJobsUIContext);
}

export function DeploymentRTSPJobsUIProvider({
  deploymentRTSPJobsUIEvents,
  children
}) {
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

  const value = {
    queryParams,
    setQueryParamsBase,
    ids,
    setIds,
    setQueryParams,
    openNewDeploymentRTSPJobDialog:
      deploymentRTSPJobsUIEvents.newDeploymentRTSPJobBtnClick,
    openViewDeploymentRTSPJobDialog:
      deploymentRTSPJobsUIEvents.openViewDeploymentRTSPJobBtnClick,
    openStartDeploymentRTSPJobDialog:
      deploymentRTSPJobsUIEvents.openStartDeploymentRTSPJobBtnClick
  };

  return (
    <DeploymentRTSPJobsUIContext.Provider value={value}>
      {children}
    </DeploymentRTSPJobsUIContext.Provider>
  );
}
