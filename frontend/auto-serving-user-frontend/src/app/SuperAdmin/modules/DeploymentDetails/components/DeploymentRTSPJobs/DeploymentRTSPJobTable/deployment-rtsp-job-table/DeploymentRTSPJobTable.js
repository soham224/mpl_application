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
import { useDeploymentRTSPJobsUIContext } from "../DeploymentRTSPJobsUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../_redux/DeploymentRTSPJobs/DeploymentRTSPJobsAction";
import { SearchText } from "../../../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../../../utils/AutoServingTable";
import { Col } from "reactstrap";

export function DeploymentRTSPJobTable() {
  const deploymentRTSPJobsUIContext = useDeploymentRTSPJobsUIContext();
  const deploymentRTSPJobsUIProps = useMemo(() => deploymentRTSPJobsUIContext, [
    deploymentRTSPJobsUIContext
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
      dataField: "image_size",
      text: "Image Size",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px"
      }
    },
    {
      dataField: "iou_threshold",
      text: "IOU Threshold",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px"
      }
    },
    {
      dataField: "confidence_threshold",
      text: "Confidence Threshold",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px"
      }
    },
    {
      dataField: "model_details.model_name",
      text: "Model",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" }
    },
    {
      dataField: "deployment_type.deployment_type_name",
      text: "Deployment Type",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "150px" }
    },
    {
      dataField: "user_details.company.company_name",
      text: "Company",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (cellContent, row, rowIndex) => (
        <span
          className={`label label-lg label-light-${
            row.status ? "primary" : "warning"
          } label-inline`}
        >
          {`${row.status ? "Deployed" : "Not Deployed"}`}
        </span>
      ),
      style: { minWidth: "118px" }
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openNewDeploymentRTSPJobDialog:
          deploymentRTSPJobsUIProps.openNewDeploymentRTSPJobDialog,
        openViewDeploymentRTSPJobDialog:
          deploymentRTSPJobsUIProps.openViewDeploymentRTSPJobDialog,
        openStartDeploymentRTSPJobDialog:
          deploymentRTSPJobsUIProps.openStartDeploymentRTSPJobDialog
      },
      style: { minWidth: "152px" }
    }
  ];

  const { currentState } = useSelector(
    state =>
      (() => {
        return { currentState: state.deploymentRTSPJobs1 };
      })(),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    deploymentRTSPJobsUIProps.queryParams
  );

  const filterDeploymentRTSPJobs = e => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = [
      "idx",
      "image_size",
      "iou_threshold",
      "confidence_threshold",
      "model_details.model_name",
      "deployment_type.deployment_type_name",
      "user_details.company_name"
    ];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      deploymentRTSPJobsUIProps.queryParams,
      setFilterEntities
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchDeploymentRTSPJobs());
  }, [deploymentRTSPJobsUIProps.queryParams, dispatch]);

  useEffect(() => {
    filterDeploymentRTSPJobs();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(
            filterEntities?.length,
            deploymentRTSPJobsUIProps.queryParams
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
                    onChangeHandler={filterDeploymentRTSPJobs}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={deploymentRTSPJobsUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
