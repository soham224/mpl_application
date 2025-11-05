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
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useModelTypeUIContext } from "../ModelTypeUIContext";
import * as actions from "../../_redux/ModelTypeAction";
import { SearchText } from "../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../utils/AutoServingTable";
import { dateTimeFormatter } from "../../../../../../utils/DateTimeFormatter";
import { Col } from "reactstrap";

export function ModelTypeTable() {
  const modelTypeUIContext = useModelTypeUIContext();
  const modelTypeUIProps = useMemo(
    () => modelTypeUIContext,
    [modelTypeUIContext]
  );

  const columns = [
    {
      dataField: "idx",
      text: "Index",
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "model_type_name",
      text: "Model Type Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "165px",
      },
    },
    {
      dataField: "model_type_description",
      text: "Model Type Description",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "created_date",
      text: "Created Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: dateTimeFormatter,
      style: {
        minWidth: 180,
      },
    },
    {
      dataField: "updated_date",
      text: "Updated Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: dateTimeFormatter,
      style: {
        minWidth: 180,
      },
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      formatter: columnFormatters.StatusColumnFormatter,
      formatExtraData: {
        openChangeStatusDialog: modelTypeUIProps.openChangeStatusDialog,
      },
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditModelTypeDialog: modelTypeUIProps.openEditModelTypeDialog,
      },
      style: {
        minWidth: "100px",
      },
    },
  ];

  // Getting current state of model types from store (Redux)
  const { currentState } = useSelector(
    (state) => ({ currentState: state.modelType }),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    modelTypeUIProps.queryParams
  );

  //Filter data for model type
  const filterModelType = (e) => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = ["id", "model_type_name", "model_type_description"];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      modelTypeUIProps.queryParams,
      setFilterEntities
    );
  };

  //State Change Handlers
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchModelTypes());
  }, [modelTypeUIProps.queryParams, dispatch]);

  useEffect(() => {
    filterModelType();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(
            filterEntities?.length,
            modelTypeUIProps.queryParams
          )
        )}
      >
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <Col xl={3} lg={6} xs={12} md={12}>
                <div className={"searchText"}>
                  <SearchText
                    reference={searchInput}
                    onChangeHandler={filterModelType}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={modelTypeUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
