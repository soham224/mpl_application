import React, { useEffect, useMemo, useRef, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import {
  entitiesSorter,
  getHandlerTableChange,
  getPaginationOptions,
  headerSortingClasses,
  NoRecordsFoundMessage,
  PleaseWaitMessage,
  sortCaret
} from "../../../../../../../../_metronic/_helpers";
import * as uiHelpers from "../../../../../../../../utils/UIHelpers";
import { Pagination } from "../../../../../../../../_metronic/_partials/controls";
import { matchSorter } from "match-sorter";
import { getResultMetadata, getResults } from "../../../../_redux/MyResultApi";
import { warningToast } from "../../../../../../../../utils/ToastMessage";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../../../_redux/MyResultAction";
import { CSVDownloader } from "../../../../../../../../utils/CSVDownloader";
import { dateTimeFormatter } from "../../../../../../../../utils/DateTimeFormatter";
import { Col, Row } from "reactstrap";
import * as moment from "moment";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import VisibilityIcon from "@material-ui/icons/Visibility";
import {MyResultViewDialog} from "../my-result-view-dialog/MyResultViewDialog";

// eslint-disable-next-line
let currentPage;
export function MyResultTable({
  jobId,
  cameraName,
  selectedLabel,
  startDate,
  endDate,
  selctedCameraId,
  locationIdList
}) {
  const dispatch = useDispatch();
  // const myResultUIContext = useMyResultUIContext();
  // const myResultUIProps = useMemo(() => myResultUIContext, [myResultUIContext]);
  const [pageParams, setPageParams] = useState({
    pageSize: 0,
    totalPages: 0,
    totalCounts: 0
  });

  const [queryParams, setQueryParams] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortField: null,
    sortOrder: null
  });

  const [currentItems, setCurrentItems] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [tableData, setTableData] = useState(false);
  const [show, setShow] = useState(false);
  const [row, setRow] = useState({});
  const { currentState } = useSelector(
    state => ({ currentState: state.myResult }),
    shallowEqual
  );
  const { refreshResult } = currentState;
  function getMyResultMetadata(
    startDate,
    endDate,
    selectedLabel,
    selctedCameraId,
    pageSize
  ) {
    setListLoading(true);
    currentPage = 0;
    if (startDate && endDate) {
      getResultMetadata(
        startDate,
        endDate,
        selectedLabel,
        selctedCameraId,
        locationIdList,
        pageSize
      )
        .then(response => {
          if (response && response.isSuccess) {
            setPageParams({
              pageSize: response.data.page_size,
              totalPages: response.data.total_pages,
              totalCounts: response.data.total_count
            });
            // getMyResults((currentPage = 1), response.data.page_size);
          }
        })
        .catch(error => {
          if (error.detail) {
            setListLoading(false);
            warningToast(error.detail);
          } else {
            warningToast("Something went Wrong");
          }
        });
    }
  }

  function getMyResults(pageNo, pageSize) {
    setListLoading(true);
    getResults(
      pageSize,
      pageNo,
      jobId,
      startDate,
      endDate,
      selctedCameraId,
      selectedLabel,
      locationIdList
    )
      .then(response => {
        if (response && response.isSuccess) {
          setCurrentItems(response.data);
          dispatch(actions.setMyResults(response.data));
          currentPage = pageNo;
          setListLoading(false);
          if (response.data.length > 0) {
            setTableData(true);
          } else {
            setTableData(false);
          }
        }
      })
      .catch(err => {
        if (err.detail) {
          setListLoading(false);
          warningToast(err.detail);
        } else {
          warningToast("Something went wrong");
        }
      });
  }

  useEffect(() => {
    filterMyResult();
    // eslint-disable-next-line
  }, [currentItems]);
  const openViewMyResultDialog = (rowData) => {
    setShow(true);
    setRow(rowData)
    console.log("rowData",rowData)
  }

  // Table columns
  const columns = [
    {
      dataField: "idx",
      text: "Index",
      sort: true,
      style: {
        minWidth: "165px"
      }
    },
    {
      dataField: "camera_name",
      text: "Camera Name",
      sort: true,
      formatter: (_, row) => cameraName[parseInt(row?.camera_id)],
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
      formatter: (_, row) =>
        moment
          .utc(row?.created_date.$date)
          .local()
          .format("MMMM DD YYYY, h:mm:ss a"),
      style: {
        minWidth: "165px"
      }
    },
    {
      dataField: "labels",
      text: "labels",
      sort: true,
      formatter: (_, row) => Object.keys(row?.counts).toString()
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: (cell, row) => (
          <a
              title="Information"
              className="btn btn-icon btn-light btn-sm mx-3"
              onClick={() => openViewMyResultDialog( row)}
              style={{ cursor: "pointer" }}
          >
            <VisibilityIcon color="action" style={{ fontSize: "2rem", color: "#147b82" }} />
          </a>
      ),
      style: { minWidth: "164px" }
    }
  ];

  const csvFields = {
    index: "#",
    camera_name: "Camera Name",
    created_date: "Created Date",
    updated_date: "Updated Date",
    count: "Count"
  };

  const getCsvData = data => {
    return data?.map((d, idx) => ({
      index: idx + 1,
      camera_name: cameraName[parseInt(d.camera_id)],
      created_date: `${dateTimeFormatter(d.created_date.$date)}`.replace(
        /,/g,
        ""
      ),
      updated_date: `${dateTimeFormatter(d.updated_date.$date)}`.replace(
        /,/g,
        ""
      ),
      count: d.result?.detection?.length || 0
    }));
  };

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
      items.slice().sort(entitiesSorter(queryParams))
    );
  };
  useEffect(() => {
    if (startDate && endDate) {
      let queryparams = queryParams;
      queryparams.pageNumber = 1;
      queryparams.pageSize = 10;
      setQueryParams(queryparams);
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { pageSize } = queryParams;

    console.log("selectedLabel useEffect" , selectedLabel);
    if ((startDate && endDate) || selectedLabel || selctedCameraId) {
      getMyResultMetadata(
        startDate,
        endDate,
        selectedLabel,
        selctedCameraId,
          pageSize
      );
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const { pageNumber, pageSize } = queryParams;
    if (startDate && endDate) {
      getMyResults(pageNumber, pageSize);
    }
    // eslint-disable-next-line
  }, [queryParams]);

  return (
    <>
      <div className="separator separator-dashed mt-5 mb-5" />
      <BlockUi tag="div" blocking={listLoading} color="#147b82">
        {tableData ? (
          <PaginationProvider
            pagination={paginationFactory(
              getPaginationOptions(
                pageParams.totalCounts,
                queryParams
              )
            )}
          >
            {({ paginationProps, paginationTableProps }) => {
              return (
                <Pagination
                  isLoading={listLoading}
                  paginationProps={paginationProps}
                >
                  <>
                    <div className="row mb-5">
                      <CSVDownloader
                        className="offset-3 col-9 col-md-9 col-sm-6 col-xl-9 text-right"
                        data={getCsvData(filterEntities)}
                        filename={"RequestedModelDeployedJobDetails"}
                        fields={csvFields}
                        buttonName={"Download Job Details As XLS"}
                      />
                    </div>
                    <Row>
                      <Col
                        xl={12}
                        style={{
                          padding: "10px 40px 10px 40px",
                          minWidth: "300px"
                        }}
                      >
                        <BootstrapTable
                          wrapperClasses="table-responsive"
                          bordered={false}
                          classes="table employeeTable table-head-custom table-vertical-center table-horizontal-center overflow-hidden"
                          bootstrap4
                          remote
                          keyField="_id.$oid"
                          data={
                            filterEntities?.map((i, idx) => ({
                              ...i,
                              idx:
                                (paginationTableProps?.pagination?.options
                                  ?.page -
                                  1) *
                                  paginationTableProps?.pagination?.options
                                    ?.sizePerPage +
                                1 +
                                idx
                            })) || []
                          }
                          columns={columns}
                          defaultSorted={uiHelpers.defaultSorted}
                          onTableChange={getHandlerTableChange(
                            setQueryParams
                          )}
                          {...paginationTableProps}
                        >
                          <PleaseWaitMessage entities={null} />
                          <NoRecordsFoundMessage entities={null} />
                        </BootstrapTable>
                      </Col>
                    </Row>
                  </>
                </Pagination>
              );
            }}
          </PaginationProvider>
        ) : (
          <h3 align="center">No Data Found</h3>
        )}
      </BlockUi>
      {show &&
          <MyResultViewDialog
              row={row}
              show={show}
              id={row?._id?.$oid}
              onHide={() => {
                setShow(false);
              }}
              cameraName={cameraName}
          />}
    </>
  );
}
