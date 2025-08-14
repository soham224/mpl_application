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
} from "../../../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../../../_metronic/_partials/controls";
import { useDeployedRTSPJobsUIContext } from "../DeployedRTSPJobsUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../_redux/DeployedRTSPJobs/DeployedRTSPJobsAction";
import { SearchText } from "../../../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../../../utils/AutoServingTable";
import { Col } from "reactstrap";

export function DeployedRTSPJobTable() {
  const deployedRTSPJobsUIContext = useDeployedRTSPJobsUIContext();
  const deployedRTSPJobsUIProps = useMemo(
    () => deployedRTSPJobsUIContext,
    [deployedRTSPJobsUIContext]
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
      style: { minWidth: "118px" },
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openViewDeployedRTSPJobDialog:
          deployedRTSPJobsUIProps.openViewDeployedRTSPJobDialog,
        openStopDeploymentRTSPJobDialog:
          deployedRTSPJobsUIProps.openStopDeploymentRTSPJobDialog,
      },
      style: { minWidth: "175px" },
    },
    {
      dataField: "settings",
      text: "Settings",
      formatter: columnFormatters.SettingsColumnFormatter,
      formatExtraData: {
        openViewLabelSettingsDialog:
          deployedRTSPJobsUIProps.openViewLabelSettingsDialog,
        openViewCameraSettingsDialog:
          deployedRTSPJobsUIProps.openViewCameraSettingsDialog,
      },
      style: { minWidth: "125px" },
    },
  ];

  const { currentState } = useSelector(
    (state) =>
      (() => {
        return { currentState: state.deployedRTSPJobs1 };
      })(),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    deployedRTSPJobsUIProps.queryParams
  );

  const filterDeployedRTSPJobs = (e) => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = ["idx", "api_endpoint", "instance_id", "instance_status"];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      deployedRTSPJobsUIProps.queryParams,
      setFilterEntities
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchDeployedRTSPJobs());
  }, [deployedRTSPJobsUIProps.queryParams, dispatch]);
  useEffect(() => {
    filterDeployedRTSPJobs();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(
            filterEntities?.length,
            deployedRTSPJobsUIProps.queryParams
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
                    onChangeHandler={filterDeployedRTSPJobs}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={deployedRTSPJobsUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
