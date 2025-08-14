import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../../../utils/UIHelpers";

const DeployedRTSPJobsUIContext = createContext();

export function useDeployedRTSPJobsUIContext() {
  return useContext(DeployedRTSPJobsUIContext);
}

export function DeployedRTSPJobsUIProvider({
  deployedRTSPJobsUIEvents,
  children
}) {
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
    openViewDeployedRTSPJobDialog:
      deployedRTSPJobsUIEvents.openViewDeployedRTSPJobBtnClick,
    openStopDeploymentRTSPJobDialog:
      deployedRTSPJobsUIEvents.stopDeploymentRTSPJobBtnClick,
    openViewLabelSettingsDialog:
      deployedRTSPJobsUIEvents.openViewLabelSettingsBtnClick,
    openViewCameraSettingsDialog:
      deployedRTSPJobsUIEvents.openViewCameraSettingsBtnClick
  };

  return (
    <DeployedRTSPJobsUIContext.Provider value={value}>
      {children}
    </DeployedRTSPJobsUIContext.Provider>
  );
}
