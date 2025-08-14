import React, { useEffect, useMemo, useState } from "react";
import paginationFactory, {
  PaginationProvider
} from "react-bootstrap-table2-paginator";
import {
  getFilteredAndPaginatedEntities,
  getPaginationOptions,
  headerSortingClasses,
  sortCaret
} from "../../../../../../_metronic/_helpers";
import * as columnFormatters from "./column-formatters";
import { Pagination } from "../../../../../../_metronic/_partials/controls";
import { useNotificationManagerUIContext } from "../NotificationManagerUIContext";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../../_redux/NotificationManagerAction";
import { AutoServingTable } from "../../../../../../utils/AutoServingTable";
import SweetAlert from "react-bootstrap-sweetalert";
import {updateEmailStatus} from "../../_redux/NotificationManagerAPI";
import {successToast, warningToast} from "../../../../../../utils/ToastMessage";
export function NotificationManagerTable() {
  const notificationManagerUIContext = useNotificationManagerUIContext();
  const notificationManagerUIProps = useMemo(() => notificationManagerUIContext, [notificationManagerUIContext]);

  const {user} = useSelector(
      (state) => ({
        user: state.auth.user
      }),
      shallowEqual
  );


  const columns = [
    {
      dataField: "idx",
      text: "Index",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "55px" }
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      sortCaret: sortCaret,
      headerSortingClasses,
      style: { minWidth: "165px" }
    }
  ];

// ✅ Conditionally add the Actions column
  if (user?.user_email !== 'user.mpl@tusker.ai') {
    columns.push({
      dataField: "action",
      text: "Actions",
      isDummyField: true,
      style: { minWidth: "150px" },
      formatter: columnFormatters.ActionsColumnFormatter,
      formatExtraData: {
        changeNotificationManagerStatus: ShowAlert,
        openEditNotificationManagerDialog: notificationManagerUIProps.openEditNotificationManagerDialog
      }
    });
  }


  const [isStatusAPIcalled, setIsStatusAPIcalled] = React.useState(false);
  function changeNotificationManagerStatusFunction(row) {
   const data ={
     id: row?.id,
     status: !row?.status,
   }
    updateEmailStatus(data)
      .then(response => {
        if (response && response.isSuccess) {
          setIsStatusAPIcalled(!isStatusAPIcalled);
          if (row.status) {
            warningToast("NotificationManager Disabled");
          } else if (!row.status) {
            successToast("NotificationManager Enable");
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
    state => ({ currentState: state.notificationManager }),
    shallowEqual
  );

  const { entities, listLoading, tableData } = currentState;
  const [showAlert, setShowAlert] = useState(false);
  const [row, setRow] = useState();
  let currentItems = getFilteredAndPaginatedEntities(entities,
    notificationManagerUIProps.queryParams
  );

  console.log("entities",entities,currentItems)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchEmail());
  }, [notificationManagerUIProps.queryParams, dispatch,isStatusAPIcalled]);


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
                entities?.length,
              notificationManagerUIProps.queryParams
            )
          )}
        >
          {({ paginationProps, paginationTableProps }) => {
            return (
              <Pagination
                isLoading={listLoading}
                paginationProps={paginationProps}
              >
                {/*<BlockUi tag="div" blocking={listLoading} color="#147b82">*/}
                  <AutoServingTable
                    columns={columns}
                    items={currentItems}
                    tableChangeHandler={notificationManagerUIProps.setQueryParams}
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
                      changeNotificationManagerStatusFunction(row);
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

