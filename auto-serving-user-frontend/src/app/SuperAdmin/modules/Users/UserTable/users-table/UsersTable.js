import React, { useEffect, useMemo, useRef, useState } from "react";
import paginationFactory, {
  PaginationProvider,
} from "react-bootstrap-table2-paginator";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import {
  entityFilter,
  getFilteredAndPaginatedEntities,
  getPaginationOptions,
  headerSortingClasses,
  sortCaret,
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useUsersUIContext } from "../UsersUIContext";
import * as actions from "../../_redux/UserAction";
import { SearchText } from "../../../../../../utils/SearchText";
import { AutoServingTable } from "../../../../../../utils/AutoServingTable";
import { Col } from "reactstrap";

export function UsersTable() {
  const usersUIContext = useUsersUIContext();
  const usersUIProps = useMemo(() => usersUIContext, [usersUIContext]);

  // Table columns
  const columns = [
    {
      dataField: "id",
      text: "Index",
      style: {
        minWidth: "55px",
      },
    },
    {
      dataField: "user_email",
      text: "User Email Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
    },
    {
      dataField: "company_email",
      text: "Company Email Id",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (_, row) => row?.company?.company_email || "--",
    },
    {
      dataField: "company_name",
      text: "Company Name",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (_, row) => row?.company?.company_name || "--",
    },
    {
      dataField: "company_website",
      text: "Company Website",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (_, row) => row?.company?.company_website || "--",
    },
    {
      dataField: "company_contact",
      text: "Company Contact",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (_, row) => row?.company?.company_contact || "--",
    },
    {
      dataField: "user_status",
      text: "Status",
      sort: true,

      formatter: columnFormatters.StatusColumnFormatter,

      formatExtraData: {
        openChangeStatusDialog: usersUIContext.openChangeStatusDialog,
      },
    },
    {
      dataField: "service",
      text: "service",
      sort: true,
      sortCaret: sortCaret,
      formatter: columnFormatters.ActionsServiceColumnFormatter,
      formatExtraData: {
        openUserServiceDialog: usersUIContext.openUserServiceDialog
      },
      headerSortingClasses
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        openViewUsersDetailsDialog: usersUIContext.openViewUsersDetailsDialog,
      },
      /*classes: "text-right pr-0",
            headerClasses: "text-right pr-3",
            style: {
                minWidth: "100px",
            },*/
    },
  ];

  const { currentState } = useSelector(
    (state) => ({ currentState: state.users }),
    shallowEqual
  );

  const { entities, listLoading } = currentState;
  const [filterEntities, setFilterEntities] = useState(entities);
  const searchInput = useRef("");
  let currentItems = getFilteredAndPaginatedEntities(
    entities || filterEntities,
    usersUIProps.queryParams
  );
  const filterUser = (e) => {
    const searchStr = e?.target?.value || searchInput?.current?.value;
    const keys = [
      "id",
      "user_email",
      "company_email",
      "company_name",
      "company_website",
      "company_contact",
    ];
    currentItems = entityFilter(
      entities || filterEntities,
      searchStr,
      keys,
      usersUIProps.queryParams,
      setFilterEntities
    );
  };

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchUsers());
  }, [usersUIProps.queryParams, dispatch]);

  useEffect(() => {
    filterUser();
    //eslint-disable-next-line
  }, [entities]);

  return (
    <>
      <PaginationProvider
        pagination={paginationFactory(
          getPaginationOptions(filterEntities?.length, usersUIProps.queryParams)
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
                    onChangeHandler={filterUser}
                  />
                </div>
              </Col>
              <AutoServingTable
                columns={columns}
                items={currentItems}
                tableChangeHandler={usersUIProps.setQueryParams}
                paginationTableProps={paginationTableProps}
              />
            </Pagination>
          );
        }}
      </PaginationProvider>
    </>
  );
}
