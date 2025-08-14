import React, { useState } from "react";
import {
  headerSortingClasses,
  sortCaret,
  toAbsoluteUrl
} from "../../../../../../_metronic/_helpers";
import Switch from "@material-ui/core/Switch/Switch";
import { Button } from "reactstrap";
import SVG from "react-inlinesvg";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import CompanyServiceModal from "./CompanyServiceModal";
import CompanyServiceInfo from "./CompanyServiceInfo";
import { CompanyServiceAccessModal } from "./CompanyServiceAccessModal";
import { updateUserStatus } from "../../../Users/_redux/users.api";
import { warningToast } from "../../../../../../utils/ToastMessage";
import { CommonBoootstrapTable } from "../../../../../../utils/CommonBoootstrapTable";

export function CompanyServiceTable({
  companyListByIdLoader,
  userDataByCompany,
  getAllUserList,
  pageSize,
  pageNo,
  userTotalCount,
  setPageNo,
  setPageSize
}) {
  const [serviceModalShow, setServiceModalShow] = useState(false);
  const [serviceUserId, setServiceUserId] = useState(null);
  const [infoModalShow, setInfoModalShow] = useState(false);
  const [infoData, setInfoData] = useState([]);
  const [accessUser, setAccessUser] = useState(false);
  const [accessUserData, setAccessUserData] = useState([]);
  const [userStatusLoader, setUserStatusLoader] = useState(false);
  const [successIcon, setSuccessIcon] = useState(false);
  const [toggleTitle, setToggleTitle] = useState(
    "Are you sure? to change status"
  );

  const columns = [
    {
      dataField: "#",
      text: "Index",
      formatter: (cell, row, rowIndex) => {
        return <span>{(pageNo - 1) * pageSize + (rowIndex + 1)}</span>;
      }
    },
    {
      dataField: "id",
      text: "User Id",
      style: {
        minWidth: "55px"
      },
      sort: true,
      headerSortingClasses
    },
    {
      dataField: "role",
      text: "Role",
      style: {
        minWidth: "55px"
      },
      sort: true,
      headerSortingClasses,
      formatter: (_, row) => row?.roles[0]?.role.toUpperCase() || "--"
    },
    {
      dataField: "user_email",
      text: "User Email Id",
      style: {
        minWidth: "250px"
      },
      sort: true,
      headerSortingClasses
    },
    {
      dataField: "company_email",
      text: "Company Email Id",
      sort: true,
      style: {
        minWidth: "150px"
      },
      headerSortingClasses,
      formatter: (_, row) => row?.company?.company_email || "--"
    },
    {
      dataField: "company_name",
      text: "Company Name",
      sort: true,
      headerSortingClasses,
      formatter: (_, row) => row?.company?.company_name || "--"
    },
    {
      dataField: "company_website",
      text: "Company Website",
      sort: false,
      headerSortingClasses,
      formatter: (_, row) => row?.company?.company_website || "--"
    },
    {
      dataField: "company_contact",
      text: "Company Contact",
      sort: false,
      sortCaret: sortCaret,
      headerSortingClasses,
      formatter: (_, row) => row?.company?.company_contact || "--"
    },
    {
      dataField: "user_status",
      text: "Status",
      sort: true,

      formatter: (cellContent, row) => {
        return (
          <>
            <Switch
              checked={row.user_status}
              onChange={() => handleAccessUser(row)}
              color="primary"
            />
          </>
        );
      }
    },
    {
      dataField: "service",
      text: "service",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cellContent, row) => {
        return (
          <>
            <Button
              className="btn btn-icon mr-4 btn-light btn-hover-primary btn-hover-light-inverse btn-sm mx-3"
              onClick={() => handleService(cellContent, row)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  title="service"
                  src={toAbsoluteUrl(
                    "/media/svg/icons/Communication/Write.svg"
                  )}
                />
              </span>
            </Button>
          </>
        );
      },
      headerSortingClasses
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: (cellContent, row) => {
        return (
          <>
            <Button
              className="btn btn-icon mr-4 btn-light btn-hover-light-inverse btn-sm mx-3"
              onClick={() => handleInfo(cellContent, row)}
            >
              <span className="svg-icon svg-icon-md svg-icon-primary">
                <SVG
                  title="Violation Info"
                  src={toAbsoluteUrl("/media/svg/icons/Code/Info-circle.svg")}
                />
              </span>
            </Button>
          </>
        );
      }
    }
  ];

  const onPageChange = (page, sizePerPage) => {
    setPageNo(page);
    setPageSize(sizePerPage);
  };

  const onSizePerPageChange = (sizePerPage, page) => {
    setPageNo(1);
    setPageSize(sizePerPage);
  };

  const handleInfo = (cellContent, row) => {
    setInfoModalShow(true);
    setInfoData(row);
  };

  const handleInfoClose = () => {
    setInfoModalShow(false);
  };

  const handleService = (cellContent, row) => {
    if (row?.id) {
      setServiceModalShow(true);
      setServiceUserId(row?.id);
    }
  };

  const handleAccessUser = row => {
    setAccessUser(true);
    setAccessUserData(row);
  };

  const handleAccessUserClose = () => {
    setAccessUser(false);
    setSuccessIcon(false);
  };

  const handleUserStatus = (id, status) => {
    UpdateUserStatusById(id, status);
  };

  const UpdateUserStatusById = (id, status) => {
    setUserStatusLoader(true);
    setToggleTitle("Updating Status!");
    updateUserStatus(!status, id)
      .then(response => {
        if (response && response.isSuccess) {
          setUserStatusLoader(false);
          setToggleTitle("Status Updated Successfully!");
          setSuccessIcon(true);
          setTimeout(function() {
            handleAccessUserClose();
            getAllUserList(1, 10);
          }, 1000);
        }
      })
      .catch(e => {
        setUserStatusLoader(false);
        warningToast("Something went wrong");
      });
  };

  const handleServiceClose = () => {
    setServiceModalShow(false);
  };

  return (
    <>
      <BlockUi tag="div" blocking={companyListByIdLoader} color="#147b82">
        {userDataByCompany.length > 0 ? (
          <>
            <CommonBoootstrapTable
              sizePerPageList={[
                { text: "10", value: 10 },
                { text: "5", value: 5 },
                { text: "3", value: 3 }
              ]}
              hideSizePerPage={false}
              showTotal={true}
              alwaysShowAllBtns={true}
              hidePageListOnlyOnePage={true}
              columns={columns}
              data={userDataByCompany}
              sizePerPage={pageSize}
              page={pageNo}
              totalSize={userTotalCount}
              onTableChange={onPageChange}
              sizePerPageChange={onSizePerPageChange}
            />
          </>
        ) : (
          <>
            {" "}
            <h5 style={{ textAlign: "center" }}>No Data Found</h5>
          </>
        )}
      </BlockUi>

      <CompanyServiceModal
        serviceModalShow={serviceModalShow}
        serviceUserId={serviceUserId}
        serviceUserId={serviceUserId}
        handleServiceClose={handleServiceClose}
      />
      <CompanyServiceInfo
        handleInfoClose={handleInfoClose}
        infoModalShow={infoModalShow}
        infoData={infoData}
      />

      <CompanyServiceAccessModal
        showAlert={accessUser}
        handleAccessUserClose={handleAccessUserClose}
        handleUserStatus={(id, status) => handleUserStatus(id, status)}
        id={accessUserData.id}
        status={accessUserData?.user_status}
        userStatusLoader={userStatusLoader}
        successIcon={successIcon}
        // accessData={infoData}
      />
    </>
  );
}
