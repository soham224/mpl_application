import React, { useEffect, useMemo, useRef, useState } from "react";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";

import {
  entityFilter,
  getFilteredAndPaginatedEntities,
  getPaginationOptions,
  headerSortingClasses,
  sortCaret
} from "../../../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../../../_metronic/_partials/controls";
import { useDeployedJobsUIContext } from "../DeployedJobsUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../_redux/DeployedJobs/DeployedJobsAction";
import { SearchText } from "../../../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../../../utils/AutoServingTable";
import { Col } from "reactstrap";

export function DeployedJobTable() {
  const deployedJobsUIContext = useDeployedJobsUIContext();
  const deployedJobsUIProps = useMemo(() => deployedJobsUIContext, [
    deployedJobsUIContext
  ]);

  // Table columns
  const columns = [
    {
      dataField: "idx",
      text: "Index",
      style: {
        minWidth: "55px"
      }
    },
    {
      dataField: "api_endpoint",
      text: "API Endpoint",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: "instance_id",
      text: "Instance Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: "instance_status",
      text: "Instance Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row, rowIndex) => (
        <span
          className={`label label-lg label-light-${
            row.instance_status === "terminated" ? "danger" : "success"
          } label-inline`}
        >
          {`${row.instance_status === "terminated" ? "Terminated" : "Running"}`}
        </span>
      ),
      style: { minWidth: "118px" }
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openViewDeployedJobDialog:
          deployedJobsUIProps.openViewDeployedJobDialog,
        openStopDeploymentJobDialog:
          deployedJobsUIProps.openStopDeploymentJobDialog
      },
      style: { minWidth: "164px" }
    }
  ];

  const { currentState } = useSelector(
    state =>
      (() => {
        return { currentState: state.deployedJobs };
      })(),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    deployedJobsUIProps.queryParams
  );

  const filterDeployedJobs = e => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = ["id", "api_endpoint", "instance_id", "instance_status"];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      deployedJobsUIProps.queryParams,
      setFilterEntities
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchDeployedJobs());
  }, [deployedJobsUIProps.queryParams, dispatch]);

  useEffect(() => {
    filterDeployedJobs();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(
            filterEntities?.length,
            deployedJobsUIProps.queryParams
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
                    onChangeHandler={filterDeployedJobs}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={deployedJobsUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
