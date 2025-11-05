import React, { useEffect, useMemo, useRef, useState } from "react";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  entityFilter,
  getFilteredAndPaginatedEntities,
  getPaginationOptions,
  headerSortingClasses,
  sortCaret,
} from "../../../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../../../_metronic/_partials/controls";
import { useAIModelUIContext } from "../ViewAIModelUIContext";
import * as actions from "../../../../_redux/AiModelAction";
import { SearchText } from "../../../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../../../utils/AutoServingTable";

export function ViewAIModelTable() {
  const aiModelUIContext = useAIModelUIContext();
  const aiModelUIProps = useMemo(() => aiModelUIContext, [aiModelUIContext]);

  const columns = [
    {
      dataField: "id",
      text: "ID",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "model_name",
      text: "Model Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "165px",
      },
    },
    {
      dataField: "model_cpu_infer_speed",
      text: "CPU Infer Speed",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "model_gpu_infer_speed",
      text: "GPU Infer Speed",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "model_version_id",
      text: "Version Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "model_accuracy",
      text: "Accuracy",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "model_size",
      text: "Model Size",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "model_depth",
      text: "Model Depth",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "framework_version_number",
      text: "Framework Version No.",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.StatusColumnFormatter,
      headerSortingClasses,
      formatExtraData: {
        openChangeStatusDialog: aiModelUIProps.openChangeStatusDialog,
      },
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditAIModelDialog: aiModelUIProps.openEditAIModelDialog,
        openViewAIModelsDetailsDialog:
          aiModelUIProps.openViewAIModelsDetailsDialog,
      },
      style: {
        minWidth: "125px",
      },
    },
  ];

  const { currentState } = useSelector(
    (state) => ({ currentState: state.aiModel }),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    entities || filterEntities,
    aiModelUIProps.queryParams
  );

  const filterAIModel = (e) => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = [
      "id",
      "model_name",
      "model_cpu_infer_speed",
      "model_gpu_infer_speed",
      "model_version_id",
      "model_accuracy",
      "model_size",
      "model_depth",
      "framework_version_number",
    ];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      aiModelUIProps.queryParams,
      setFilterEntities
    );
  };

  //State Change Handlers
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchAIModel()).then(() => filterAIModel());
    //eslint-disable-next-line
  }, [aiModelUIProps.queryParams, dispatch]);

  useEffect(() => {
    filterAIModel();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(entities?.length, aiModelUIProps.queryParams)
        )}
      >
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <SearchText
                reference={searchInput}
                onChangeHandler={filterAIModel}
              />
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={aiModelUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
