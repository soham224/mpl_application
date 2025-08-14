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
import { useLocationUIContext } from "../LocationUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/LocationAction";
import { SearchText } from "../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../utils/AutoServingTable";
import { updateLocationStatus } from "../../_redux/LocationAPI";
import {
  successToast,
  warningToast
} from "../../../../../../utils/ToastMessage";
import SweetAlert from "react-bootstrap-sweetalert";
// import BlockUi from "@availity/block-ui";
// import "@availity/block-ui/dist/index.css";

import * as moment from "moment";
import { Col } from "reactstrap";
export function LocationTable() {
  const locationUIContext = useLocationUIContext();
  const locationUIProps = useMemo(() => locationUIContext, [locationUIContext]);

  const columns = [
    {
      dataField: "idx",
      text: "Index",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px"
      }
    },
    {
      dataField: "location_name",
      text: "Location Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "165px"
      }
    },
    {
      dataField: "created_date",
      text: "Created Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      // formatter: dateTimeFormatter,
      formatter: (_, row) =>
        moment
          .utc(row?.created_date)
          .local()
          .format("MMMM DD YYYY, h:mm:ss a"),

      style: {
        minWidth: 180
      }
    },
    {
      dataField: "updated_date",
      text: "Updated Date",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (_, row) =>
        moment
          .utc(row?.updated_date)
          .local()
          .format("MMMM DD YYYY, h:mm:ss a"),

      style: {
        minWidth: 180
      }
    },
    {
      dataField: "action",
      text: "Actions",
      style: {
        minWidth: "150px"
      },
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        changeLocationStatus: ShowAlert,
        openEditLocationDialog: locationUIProps.openEditLocationDialog
      }
    }
  ];

  const [isStatusAPIcalled, setIsStatusAPIcalled] = React.useState(false);
  function changeLocationStatusFunction(row) {
    let location_id = row.id;
    let location_status = !row.status;
    let updated_date = moment().toISOString();
    updateLocationStatus(location_id, location_status, updated_date)
      .then(response => {
        if (response && response.isSuccess) {
          setIsStatusAPIcalled(!isStatusAPIcalled);
          if (row.status) {
            warningToast("Location Disabled");
          } else if (!row.status) {
            successToast("Location Enable");
          }
          setShowAlert(false);
        }
      })
      .catch(error => {
        setShowAlert(false);
        setIsStatusAPIcalled(!isStatusAPIcalled);
        if (error.detail) {
          warningToast(error.detail);
        } else {
          warningToast("Something went Wrong");
        }
      });
  }

  const { currentState } = useSelector(
    state => ({ currentState: state.location }),
    shallowEqual
  );

  const { entities, listLoading, tableData } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const [showAlert, setShowAlert] = useState(false);
  const [row, setRow] = useState();
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    locationUIProps.queryParams
  );

  const filterLocation = e => {
    if (entities.length > 0) {
      const searchStr = e?.target?.value || searchInput.current.value;
      const keys = ["id", "location_name"];
      currentItems = entityFilter(
        entities || filterEntities,
        searchStr,
        keys,
        locationUIProps.queryParams,
        setFilterEntities
      );
    }
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchLocation());
  }, [locationUIProps.queryParams, dispatch, isStatusAPIcalled]);
  useEffect(() => {
    filterLocation();
    // eslint-disable-next-line
  }, [entities]);

  const toggleShowAlert = () => {
    setShowAlert(false);
  };
  function ShowAlert(row) {
    setShowAlert(true);
    setRow(row);
  }
  return (
    <>
      {tableData ? (
        <PaginationProvider
          pagination={paginationFactory(
            getPaginationOptions(
              filterEntities?.length,
              locationUIProps.queryParams
            )
          )}
        >
          {({ paginationProps, paginationTableProps }) => {
            return (
              <Pagination
                isLoading={listLoading}
                paginationProps={paginationProps}
              >
                <div className="row mb-5">
                  <Col xl={3} lg={6} xs={12} md={12}>
                    <div className={"searchText"}>
                      <SearchText
                        reference={searchInput}
                        onChangeHandler={filterLocation}
                      />
                    </div>
                  </Col>
                </div>
                {/*<BlockUi tag="div" blocking={listLoading} color="#147b82">*/}
                  <AutoServingTable
                    columns={columns}
                    items={currentItems}
                    tableChangeHandler={locationUIProps.setQueryParams}
                    paginationTableProps={paginationTableProps}
                  />
                  <SweetAlert
                    // info={!isSuccess}
                    showCancel={true}
                    showConfirm={true}
                    confirmBtnText="Confirm"
                    confirmBtnBsStyle="primary"
                    cancelBtnBsStyle="light"
                    cancelBtnStyle={{ color: "black" }}
                    title={"Are you sure ?"}
                    onConfirm={() => {
                      changeLocationStatusFunction(row);
                    }}
                    onCancel={() => toggleShowAlert()}
                    show={showAlert}
                    focusCancelBtn
                  />
                {/*</BlockUi>*/}
              </Pagination>
            );
          }}
        </PaginationProvider>
      ) : (
        <h3 style={{ paddingTop: "40px" }} className="text-center">
          No Data Found
        </h3>
      )}
    </>
  );
}

