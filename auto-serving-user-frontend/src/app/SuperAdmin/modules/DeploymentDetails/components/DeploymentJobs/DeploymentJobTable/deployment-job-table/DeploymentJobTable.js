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
import { useDeploymentJobsUIContext } from "../DeploymentJobsUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../_redux/DeploymentJobs/DeploymentJobsAction";
import { SearchText } from "../../../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../../../utils/AutoServingTable";
import { Col } from "reactstrap";

export function DeploymentJobTable() {
  const deploymentJobsUIContext = useDeploymentJobsUIContext();
  const deploymentJobsUIProps = useMemo(() => deploymentJobsUIContext, [
    deploymentJobsUIContext
  ]);

  // Table columns
  const columns = [
    {
      dataField: "id",
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
      dataField: "user_details.company_name",
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
        openNewDeploymentJobDialog:
          deploymentJobsUIProps.openNewDeploymentJobDialog,
        openViewDeploymentJobDialog:
          deploymentJobsUIProps.openViewDeploymentJobDialog,
        openStartDeploymentJobBtnClick:
          deploymentJobsUIProps.openStartDeploymentJobBtnClick
      },
      style: { minWidth: "152px" }
    }
  ];

  const { currentState } = useSelector(
    state =>
      (() => {
        return { currentState: state.deploymentJobs };
      })(),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    deploymentJobsUIProps.queryParams
  );

  const filterDeploymentJobs = e => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = [
      "id",
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
      deploymentJobsUIProps.queryParams,
      setFilterEntities
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchDeploymentJobs());
  }, [deploymentJobsUIProps.queryParams, dispatch]);

  useEffect(() => {
    filterDeploymentJobs();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(
            filterEntities?.length,
            deploymentJobsUIProps.queryParams
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
                    onChangeHandler={filterDeploymentJobs}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={deploymentJobsUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
