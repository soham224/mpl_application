import React, { createContext, useCallback, useContext, useState } from "react";
import { isEqual, isFunction } from "lodash";
import { initialFilter } from "../../../../../../../utils/UIHelpers";

const MyResultUIContext = createContext();

export function useMyResultUIContext() {
  return useContext(MyResultUIContext);
}

export function MyResultUIProvider({ myResultUIEvents, children }) {
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
    openViewMyResultDialog: myResultUIEvents.openViewMyResultBtnClick,
    openChangeStatusDialog: myResultUIEvents.openChangeStatusBtnClick,
    openCardsClick: myResultUIEvents.openCardsClick,
  };

  return (
    <MyResultUIContext.Provider value={value}>
      {children}
    </MyResultUIContext.Provider>
  );
}
