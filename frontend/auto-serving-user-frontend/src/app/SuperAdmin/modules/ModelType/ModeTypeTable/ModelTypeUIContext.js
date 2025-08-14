import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../utils/UIHelpers";

const ModelTypeUIContext = createContext();

export function useModelTypeUIContext() {
  return useContext(ModelTypeUIContext);
}

export function ModelTypeUIProvider({ modelTypeUIEvents, children }) {
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
    newModelTypeButtonClick: modelTypeUIEvents.newModelTypeButtonClick,
    openChangeStatusDialog: modelTypeUIEvents.openChangeStatusDialog,
    openEditModelTypeDialog: modelTypeUIEvents.openEditModelTypeDialog,
  };

  return (
    <ModelTypeUIContext.Provider value={value}>
      {children}
    </ModelTypeUIContext.Provider>
  );
}
