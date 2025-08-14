import React, { useEffect, useMemo, useRef, useState } from "react";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/DeviceAction";

import {
  entityFilter,
  getFilteredAndPaginatedEntities,
  getPaginationOptions,
  headerSortingClasses,
  sortCaret
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useDeviceUIContext } from "../DeviceUIContext";
import { SearchText } from "../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../utils/AutoServingTable";
import { dateTimeFormatter } from "../../../../../../utils/DateTimeFormatter";
import { Col } from "reactstrap";

export function DeviceTable() {
  const deviceUIContext = useDeviceUIContext();
  const deviceUIProps = useMemo(() => deviceUIContext, [deviceUIContext]);

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
      dataField: "device_name",
      text: "Device Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "165px"
      }
    },
    {
      dataField: "device_description",
      text: "Device Description",
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
        minWidth: 180
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
        minWidth: 180
      }
    },
    {
      dataField: "status",
      text: "Status",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: columnFormatters.StatusColumnFormatter,
      formatExtraData: {
        openChangeStatusDialog: deviceUIProps.openChangeStatusDialog
      }
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openEditDeviceDialog: deviceUIProps.openEditDeviceDialog
      },
      style: {
        minWidth: "100px"
      }
    }
  ];

  const { currentState } = useSelector(
    state => ({ currentState: state.device }),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    filterEntities || entities,
    deviceUIProps.queryParams
  );
  const filterDevice = e => {
    const searchStr = e?.target?.value || searchInput.current.value;
    const keys = ["id", "device_name", "device_description"];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      deviceUIProps.queryParams,
      setFilterEntities
    );
  };


  //State Change Handlers
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchDevice());
  }, [deviceUIProps.queryParams, dispatch]);

  useEffect(() => {
    filterDevice();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(
            filterEntities?.length,
            deviceUIProps.queryParams
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
                    onChangeHandler={filterDevice}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={deviceUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
