import React, { useState } from "react";
import {
  headerSortingClasses,
  sortCaret,
  toAbsoluteUrl
} from "../../../../../../_metronic/_helpers";
import { Button } from "reactstrap";
import SVG from "react-inlinesvg";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import NotificationSendServiceModal from "./NotificationSendServiceModal";
import { CommonBoootstrapTable } from "../../../../../../utils/CommonBoootstrapTable";
import * as moment from "moment/moment";

export function NotificationServiceTable({
  companyListByIdLoader,
  userDataByCompany,
  sizePerPage,
  page
}) {
  const [serviceModalShow, setServiceModalShow] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const columns = [
    {
      dataField: "#",
      text: "Index",
      formatter: (cell, row, rowIndex) => {
        return <span>{(page - 1) * sizePerPage + (rowIndex + 1)}</span>;
      }
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
      dataField: "time",
      text: "Date & Time",
      style: {
        minWidth: "250px"
      },
      sort: true,
      headerSortingClasses,
      formatter: (_, row) =>moment.utc(row?._id?.group_by_date?.$date)
          .local()
          .format("MMMM DD YYYY, h:mm:ss a")
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
                  title="Assign locations"
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
    }
  ];

  const onPageChange = (page, sizePerPage) => {
    // console.log("onPageChange page, sizePerPage", page, sizePerPage);
  };
  const sizePerPageChange = (page, sizePerPage) => {
    // console.log("onSizePerPageChange page, sizePerPage", page, sizePerPage);
  };

  const handleService = (cellContent, row) => {
    setServiceModalShow(true);
    setImageData(row?.result);
  };

  const handleServiceClose = () => {
    setServiceModalShow(false);
  };

  const fetchData = e => {
    setHasMore(true);
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
              sizePerPage={sizePerPage}
              page={page}
              // totalSize={totalCount}
              onTableChange={onPageChange}
              sizePerPageChange={sizePerPageChange}
            />
          </>
        ) : (
          <>
            {" "}
            <h5 style={{ textAlign: "center" }}>No Data Found</h5>
          </>
        )}
      </BlockUi>

      <NotificationSendServiceModal
        serviceModalShow={serviceModalShow}
        userDataByCompany={userDataByCompany}
        handleServiceClose={handleServiceClose}
        imageData={imageData}
        fetchData={fetchData}
        setHasMore={setHasMore}
      />
    </>
  );
}
