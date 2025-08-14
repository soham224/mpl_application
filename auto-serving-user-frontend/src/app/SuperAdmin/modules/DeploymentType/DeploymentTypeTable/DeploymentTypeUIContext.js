import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../utils/UIHelpers";

const DeploymentTypeUIContext = createContext();

export function useDeploymentTypeUIContext() {
  return useContext(DeploymentTypeUIContext);
}

export function DeploymentTypeUIProvider({ deploymentTypeUIEvents, children }) {
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
    openNewDeploymentTypeDialog:
      deploymentTypeUIEvents.newDeploymentTypeBtnClick,
    openEditDeploymentTypeDialog:
      deploymentTypeUIEvents.editDeploymentTypeBtnClick,
    openChangeStatusDeploymentTypeDialog:
      deploymentTypeUIEvents.changeStatusDeploymentTypeBtnClick
  };

  return (
    <DeploymentTypeUIContext.Provider value={value}>
      {children}
    </DeploymentTypeUIContext.Provider>
  );
}
