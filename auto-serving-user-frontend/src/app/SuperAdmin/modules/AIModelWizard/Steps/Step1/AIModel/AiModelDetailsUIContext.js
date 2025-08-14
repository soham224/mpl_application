import React, {createContext, useContext, useState, useCallback} from "react";
import {isEqual, isFunction} from "lodash";
import {initialFilter} from "./AiModelUIHelper";

const AiModelDetailsUIContext = createContext();

export function useAIModelUIContext() {
    return useContext(AiModelDetailsUIContext);
}

export const ExampleUIConsumer = AiModelDetailsUIContext.Consumer;

export function AIModelUIProvider({usersUIEvents , children}) {
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

    const initAIModel = {
                model_name: '',
                model_description: '',
                model_cpu_infer_speed: '',
                model_gpu_infer_speed: '',
                model_version_id: '',
                model_accuracy: '',
                framework_version_number: '',
                model_type_id: '',
                model_device_id: '',
                model_size: '',
                model_depth: '',
                model_framework_id: '',
                status: false,
                model_id: ''
    };

    const value = {
        queryParams,
        setQueryParamsBase,
        ids,
        setIds,
        setQueryParams,
        initAIModel,
        newUserButtonClick: usersUIEvents.newUserButtonClick,
        openDeleteUserDialog: usersUIEvents.openDeleteUserDialog,
        openEditUserDialog: usersUIEvents.openEditUserDialog,
    };

    return <AiModelDetailsUIContext.Provider value={value}>{children}</AiModelDetailsUIContext.Provider>;
}
