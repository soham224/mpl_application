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
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useDeploymentTypeUIContext } from "../DeploymentTypeUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/DeploymentTypeAction";
import { SearchText } from "../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../utils/AutoServingTable";
import { dateTimeFormatter } from "../../../../../../utils/DateTimeFormatter";
import { Col } from "reactstrap";

export function DeploymentTypeTable() {
  // Customers UI Context
  const deploymentTypeUIContext = useDeploymentTypeUIContext();
  const deploymentTypeUIProps = useMemo(() => deploymentTypeUIContext, [
    deploymentTypeUIContext
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
      dataField: "deployment_type_name",
      text: "Deployment Type Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "165px"
      }
    },
    {
      dataField: "deployment_type_description",
      text: "Deployment Type Description",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: "created_date",
      text: "Created Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: dateTimeFormatter,
      style: {
        minWidth: 183
      }
    },
    {
      dataField: "updated_date",
      text: "Updated Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: dateTimeFormatter,
      style: {
        minWidth: 183
      }
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.StatusColumnFormatter,
      formatExtraData: {
        openChangeStatusDeploymentTypeDialog:
          deploymentTypeUIProps.openChangeStatusDeploymentTypeDialog
      },
      headerSortingClasses
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditDeploymentTypeDialog:
          deploymentTypeUIProps.openEditDeploymentTypeDialog
      }
      /*style: {
                minWidth: "100px",
            },*/
    }
  ];

  const { currentState } = useSelector(
    state => ({ currentState: state.deploymentType }),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    deploymentTypeUIContext.queryParams
  );

  const filterDeploymentType = e => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = ["id", "deployment_type_name", "deployment_type_description"];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      deploymentTypeUIProps.queryParams,
      setFilterEntities
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchDeploymentTypes());
  }, [deploymentTypeUIProps.queryParams, dispatch]);
  useEffect(() => {
    filterDeploymentType();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(
            filterEntities?.length,
            deploymentTypeUIProps.queryParams
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
                    onChangeHandler={filterDeploymentType}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={deploymentTypeUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
