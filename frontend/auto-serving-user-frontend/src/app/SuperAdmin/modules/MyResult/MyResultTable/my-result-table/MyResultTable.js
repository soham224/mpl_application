import React, { useEffect, useMemo, useRef, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";

import {
  entitiesSorter,
  getHandlerTableChange,
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret
} from "../../../../../../_metronic/_helpers";
import * as uiHelpers from "../../../../../../utils/UIHelpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useMyResultUIContext } from "../MyResultUIContext";
import { matchSorter } from "match-sorter";
import {
  getResultMetadataForAdmin,
  getResultsForAdmin
} from "../../_redux/my-result";
import { warningToast } from "../../../../../../utils/ToastMessage";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/MyResultAction";
import { dateTimeFormatter } from "../../../../../../utils/DateTimeFormatter";

//eslint-disable-next-line
let currentPage = 0;

export function MyResultTable({ companyId, jobId, cameraId }) {
  const dispatch = useDispatch();
  const myResultUIContext = useMyResultUIContext();
  const myResultUIProps = useMemo(() => myResultUIContext, [myResultUIContext]);

  const [pageParams, setPageParams] = useState({ pageSize: 0, totalPages: 0 });
  const [currentItems, setCurrentItems] = useState([]);
  const [listLoading, setListLoading] = useState(false);

  const { currentState } = useSelector(
    state => ({ currentState: state.myResult }),
    shallowEqual
  );

  const { refreshResult } = currentState;

  function getResultMetadata(cameraId, companyId) {
    setListLoading(true);
    currentPage = 0;
    getResultMetadataForAdmin(cameraId, companyId)
      .then(response => {
        if (response && response.isSuccess) {
          setListLoading(false);
          setPageParams({
            pageSize: response.data.page_size,
            totalPages: response.data.total_pages
          });
          getResults((currentPage = 1));
        } else throw new Error();
      })
      .catch(error => {
        setListLoading(false);
        warningToast("Something went wrong !");
      });
  }

  function getResults(pageNo) {
    setListLoading(true);
    getResultsForAdmin(companyId, jobId, cameraId, pageNo)
      .then(response => {
        if (response && response.isSuccess) {
          setCurrentItems(response.data);
          dispatch(actions.setMyResults(response.data));
          currentPage = pageNo;
          setListLoading(false);
        } else throw new Error();
      })
      .catch(error => {
        setListLoading(false);
        warningToast("Something went wrong !");
      });
  }

  useEffect(() => {
    filterMyResult();
    //eslint-disable-next-line
  }, [currentItems]);

  useEffect(() => {
    //get result metadata for admin
    if (cameraId && companyId) {
      getResultMetadata(cameraId, companyId);
    }
    //eslint-disable-next-line
  }, [cameraId, companyId]);

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
      dataField: "camera_id",
      text: "Camera ID",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px"
      }
    },
    {
      dataField: "count",
      text: "Count",
      sort: true,
      formatter: (_, row) => row?.result?.detection?.length || 0
    },
    {
      dataField: "created_date.$date",
      text: "Created Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: dateTimeFormatter,
      style: {
        minWidth: "165px"
      }
    },
    {
      dataField: "updated_date.$date",
      text: "Updated Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: dateTimeFormatter,
      style: {
        minWidth: "165px"
      }
    },
    // {
    //   dataField: "is_hide",
    //   text: "Status",
    //   sort: true,
    //   formatter: columnFormatters.StatusColumnFormatter,
    //   formatExtraData: {
    //     openChangeStatusDialog: myResultUIProps.openChangeStatusDialog
    //   }
    // },
    // {
    //   dataField: "action",
    //   text: "Actions",
    //   formatter: columnFormatters.ActionsColumnFormatter,
    //   formatExtraData: {
    //     openViewMyResultDialog: myResultUIProps.openViewMyResultDialog
    //   },
    //   style: { minWidth: "164px" }
    // }
  ];

  const [filterEntities, setFilterEntities] = useState(currentItems);
  const searchInput = useRef("");
  const filterMyResult = e => {
    const searchStr = e?.target?.value || searchInput.current.value;
    let items = currentItems || [];
    if (searchStr) {
      items = matchSorter(currentItems, searchStr, {
        keys: [
          "_id.$oid",
          "camera_id",
          "created_date.$date",
          "updated_date.$date",
          "status"
        ]
      });
    }
    setFilterEntities(
      items.slice().sort(entitiesSorter(myResultUIProps.queryParams))
    );
  };

  useEffect(() => {
    const { pageNumber } = myResultUIProps.queryParams;
    getResults(pageNumber);
    //eslint-disable-next-line
  }, [myResultUIProps.queryParams, refreshResult]);

  // Table pagination properties
  const paginationOptions = {
    custom: true,
    totalSize: pageParams.pageSize * pageParams.totalPages,
    sizePerPageList: [
      { text: pageParams.pageSize, value: pageParams.pageSize }
    ],
    sizePerPage: pageParams.pageSize,
    page: myResultUIProps.queryParams.pageNumber
  };

  return (
    <>
      <PaginationProvider pagination={paginationFactory(paginationOptions)}>
        {({ paginationProps, paginationTableProps }) => {
          return (
            <Pagination
              isLoading={listLoading}
              paginationProps={paginationProps}
            >
              <div className="offset-lg-9 col-lg-3">
                <input
                  type="text"
                  className="form-control"
                  name="searchText"
                  placeholder="Search"
                  onChange={filterMyResult}
                  ref={searchInput}
                />
                <small className="form-text text-muted text-right">
                  <b>Search</b> in all fields
                </small>
              </div>
              <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table table-head-custom table-vertical-center table-horizontal-center overflow-hidden"
                bootstrap4
                remote
                keyField="_id.$oid"
                data={
                  filterEntities?.map((i, idx) => ({
                    ...i,
                    idx:
                      (paginationTableProps?.pagination?.options?.page - 1) *
                        paginationTableProps?.pagination?.options?.sizePerPage +
                      1 +
                      idx
                  })) || []
                }
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(
                  myResultUIProps.setQueryParams
                )}
                {...paginationTableProps}
              >
                <PleaseWaitMessage entities={filterEntities} />
                <NoRecordsFoundMessage entities={filterEntities} />
              </BootstrapTable>
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
