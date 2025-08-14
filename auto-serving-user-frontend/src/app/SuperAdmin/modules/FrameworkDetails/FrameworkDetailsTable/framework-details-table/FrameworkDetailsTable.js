import React, { useEffect, useMemo, useRef, useState } from "react";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import {
  entityFilter,
  getFilteredAndPaginatedEntities,
  getPaginationOptions,
  headerSortingClasses,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useFrameworkUIContext } from "../FrameworkDetailsUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/FrameworkDetailsAction";
import { SearchText } from "../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../utils/AutoServingTable";
import { dateTimeFormatter } from "../../../../../../utils/DateTimeFormatter";
import { Col } from "reactstrap";

export function FrameworkDetailsTable() {
  // Customers UI Context
  const frameworkUIContext = useFrameworkUIContext();
  const frameworkUIProps = useMemo(
    () => frameworkUIContext,
    [frameworkUIContext]
  );

  // Table columns
  const columns = [
    {
      dataField: "idx",
      text: "Index",
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "framework_name",
      text: "Framework Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "165px",
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
      dataField: "is_deprecated",
      text: "Deprecated",
      sort: true,
      formatter: columnFormatters.StatusColumnFormatter,
      formatExtraData: {
        openChangeStatusDialog:
          frameworkUIProps.openChangeStatusFrameworkDialog,
        isDeprecatedStatus: true,
      },
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
      sortCaret: sortCaret,
      formatter: columnFormatters.StatusColumnFormatter,
      formatExtraData: {
        openChangeStatusDialog:
          frameworkUIProps.openChangeStatusFrameworkDialog,
        isDeprecatedStatus: false,
      },
      headerSortingClasses,
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditFrameworkDialog: frameworkUIProps.openEditFrameworkDialog,
      },
      style: {
        minWidth: "100px",
      },
    },
  ];

  const { currentState } = useSelector(
    (state) => ({ currentState: state.frameworkDetails }),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    frameworkUIProps.queryParams
  );

  const filterFramework = (e) => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = ["id", "framework_name", "framework_version_number"];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      frameworkUIProps.queryParams,
      setFilterEntities
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchFrameworkDetails());
  }, [frameworkUIProps.queryParams, dispatch]);

  useEffect(() => {
    filterFramework();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(
            filterEntities?.length,
            frameworkUIProps.queryParams
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
                    onChangeHandler={filterFramework}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={frameworkUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
