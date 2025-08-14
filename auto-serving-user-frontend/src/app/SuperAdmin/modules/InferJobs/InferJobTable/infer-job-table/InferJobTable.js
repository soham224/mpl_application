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
import { useInferJobsUIContext } from "../InferJobsUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/InferJobsAction";
import { SearchText } from "../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../utils/AutoServingTable";
import { Col } from "reactstrap";

export function InferJobTable() {
  const inferJobsUIContext = useInferJobsUIContext();
  const inferJobsUIProps = useMemo(() => inferJobsUIContext, [
    inferJobsUIContext
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
      style: {
        minWidth: "165px"
      }
    },
    {
      dataField: "user_details.company.company_name",
      text: "Company",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openNewInferJobDialog: inferJobsUIProps.openNewInferJobDialog,
        openViewInferJobDialog: inferJobsUIProps.openViewInferJobDialog
      },
      style: {
        minWidth: "100px"
      }
    }
  ];

  const { currentState } = useSelector(
    state => ({ currentState: state.inferJobs }),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    inferJobsUIProps.queryParams
  );

  const filterInferJobs = e => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = [
      "id",
      "image_size",
      "iou_threshold",
      "confidence_threshold",
      "model_details.model_name",
      "user_details.user_email"
    ];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      inferJobsUIProps.queryParams,
      setFilterEntities
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchInferJobs());
  }, [inferJobsUIProps, dispatch]);

  useEffect(() => {
    filterInferJobs();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(
            filterEntities?.length,
            inferJobsUIProps.queryParams
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
                    onChangeHandler={filterInferJobs}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={inferJobsUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
