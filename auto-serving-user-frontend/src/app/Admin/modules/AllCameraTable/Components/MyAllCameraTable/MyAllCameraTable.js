import React, { useEffect, useState } from "react";
import {
  headerSortingClasses,
  sortCaret
} from "../../../../../../_metronic/_helpers";
import { Col, Row } from "reactstrap";
import { CSVDownloader } from "../../../../../../utils/CSVDownloader";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import { CommonBoootstrapTable } from "../../../../../../utils/CommonBoootstrapTable";

export function MyAllCameraTable({
  currentItems,
  showTable,
  totalCount,
  pageNo,
  pageSize,
  pageChange,
  sizePerPageChangeApiCall
}) {
  const [filterEntities, setFilterEntities] = useState([]);

  const columns = [
    {
      dataField: "#",
      text: "Index",
      formatter: (cell, row, rowIndex) => {
        return <span>{(pageNo - 1) * pageSize + (rowIndex + 1)}</span>;
      }
    },
    {
      dataField: "location_details.location_name",
      text: "Location",
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px"
      }
    },
    {
      dataField: "camera_name",
      text: "Cameras",
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px"
      }
    },
    {
      dataField: "ai_model_details.model_details.model_name",
      text: "Models",
      sortCaret: sortCaret,
      headerSortingClasses,
      style: {
        minWidth: "55px"
      }
    }
  ];

  useEffect(() => {
    setFilterEntities(currentItems);
  }, [currentItems]);

  const csvFields = {
    index: "#",
    location_name: "Location Name",
    camera_name: "Camera Name",
    modal_name: "Modal Name"
  };
  const getCsvData = data => {
    return data?.map((d, idx) => ({
      index: idx + 1,
      camera_name: d.camera_name,
      location_name: d.location_details.location_name,
      modal_name: d.ai_model_details.model_details.model_name
    }));
  };

  const onPageChange = (page, sizePerPage) => {
    pageChange(page, sizePerPage);
  };
  const sizePerPageChange = (page, sizePerPage) => {
    sizePerPageChangeApiCall(sizePerPage, page);
  };

  return (
    <>
      <BlockUi tag="div" blocking={showTable} color="#147b82">
        <Row style={{ minWidth: "230px" }}>
          <Col xl={3} lg={6} xs={12} md={12}></Col>
          <Col xl={9} lg={6} md={12} xs={12} sm={12}>
            <div>
              {filterEntities.length !== 0 && (
                <CSVDownloader
                  className="mt-3 text-right"
                  data={getCsvData(filterEntities)}
                  filename={"RequestedAllCameraDetails"}
                  fields={csvFields}
                  buttonName={"Download All Camera Details As XLS"}
                />
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <Col xl={12} lg={6} xs={12} md={12} className={"mt-5"}>
            {filterEntities.length > 0 && (
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
                data={filterEntities}
                sizePerPage={pageSize}
                page={pageNo}
                totalSize={totalCount}
                onTableChange={onPageChange}
                sizePerPageChange={sizePerPageChange}
              />
            )}
            {filterEntities.length === 0 && (
              <h3 className={"mt-5 d-flex justify-content-center"}>
                No Data Found
              </h3>
            )}
          </Col>
        </Row>
      </BlockUi>
    </>
  );
}
