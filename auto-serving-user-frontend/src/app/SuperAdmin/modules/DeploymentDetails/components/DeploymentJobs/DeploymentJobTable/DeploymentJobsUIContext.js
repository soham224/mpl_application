import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../../../utils/UIHelpers";

const DeploymentJobsUIContext = createContext();

export function useDeploymentJobsUIContext() {
  return useContext(DeploymentJobsUIContext);
}

export function DeploymentJobsUIProvider({ deploymentJobsUIEvents, children }) {
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
    openNewDeploymentJobDialog: deploymentJobsUIEvents.newDeploymentJobBtnClick,
    openViewDeploymentJobDialog:
      deploymentJobsUIEvents.openViewDeploymentJobBtnClick,
    openStartDeploymentJobBtnClick:
      deploymentJobsUIEvents.startDeploymentJobBtnClick
  };

  return (
    <DeploymentJobsUIContext.Provider value={value}>
      {children}
    </DeploymentJobsUIContext.Provider>
  );
}
