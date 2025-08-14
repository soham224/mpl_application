import React, {useEffect, useState} from "react";
import {Card, CardBody} from "../../../../../../../_metronic/_partials/controls";
import CardHeader from "@material-ui/core/CardHeader";
import Select from "react-select";
import {Button, Col, Form, Row} from "react-bootstrap";
import "react-datetime/css/react-datetime.css";
import "react-multi-date-picker/styles/colors/teal.css";
import {getAllUsersResultManager} from "../../../../../../SuperAdmin/modules/Users/_redux/users.api";
import FormDateRangePicker from "../../../../../../../utils/dateRangePicker/FormDateRangePicker";
import {getCurrentEndDate, getCurrentStartDate} from "../../../../../../../utils/TimeZone";
import moment from "moment/moment";
import getSelectedDateTimeDefaultValue from "../../../../../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../../../../../utils/dateRangePicker/dateRangeFunctions";
import {warningToast} from "../../../../../../../utils/ToastMessage";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import {CommonBoootstrapTable} from "../../../../../../../utils/CommonBoootstrapTable";
import {headerSortingClasses, sortCaret, toAbsoluteUrl} from "../../../../../../../_metronic/_helpers";
import SVG from "react-inlinesvg";
import NotificationSendServiceModal
  from "../../../../../../SuperAdmin/modules/NotificationSend/components/company-service-details-table/NotificationSendServiceModal";
import {getNotificationForResultManager} from "../../../_redux/MyNotificationViewApi";

const TimeOptions = [
  {Time_id: 1, label: '5 Min' , value: 5},
  {Time_id: 2, label: '10 Min' , value: 10},
    {Time_id: 3, label: '15 Min' , value: 15},
  {Time_id: 4, label: '30 Min' , value: 30},
  {Time_id: 5, label: '45 Min' , value: 45},
  {Time_id: 6, label: '1 hrs' , value: 60},
  {Time_id: 7, label: '2 hrs' , value: 120},
]
export function MyNotificationViewCard() {
  const initCompany = { label: "Select Company", value: 0 };
  const [companyOptions, setCompanyOptions] = useState([]);
  const [company, setCompany] = useState(initCompany);
  const [selectedIndex, setSelectedIndex] = useState(12);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalSize, setTotalSize] = useState(0);
  const [time, setTime] = useState({});
  const [listLoading, setListLoading] = useState(false);
  const [serviceModalShow, setServiceModalShow] = useState(false);
  const [imageData, setImageData] = useState([]);
  const [userDataByCompany, setUserDataByCompany] = useState([]);

  const [startDate, setStartDate] = useState(
      moment.utc(getCurrentStartDate()).format()
  );
  const [endDate, setEndDate] = useState(
      moment.utc(getCurrentEndDate()).format()
  );

  useEffect(() => {
    setTime(TimeOptions[0])
    getAllUsersResultManager()
      .then(response => {
        if (response && response.isSuccess) {
          setCompanyOptions(
            response.data.map(user => ({
              value: user.id,
              company_id: user.company?.id,
              label: user.company?.company_name
            }))
          );
        } else {
        }
      })
      .catch(error => {});
  }, []);

  const dateTimeRangeChangeHandler = (startDate, endDate) => {
    setStartDate(moment.utc(startDate).format())
    setEndDate(moment.utc(endDate).format())
  };

  const dateTimeRangeIndexChangeHandler = (rangeIndex, value) => {
    let dateVal = getSelectedDateTimeDefaultValue(value);
    let index = getSelectedDateTimeDefaultValueForRange(parseInt(dateVal, 10));
    let min = startDate;
    let max = endDate;
    let minDateNew = minDate;
    let maxDateNew = maxDate;
    if (parseInt(dateVal) === 12) {
      min = parseInt("defaultMin", 0);
      max = parseInt("defaultMax", 0);

      minDateNew = ["min"];
      maxDateNew = ["max"];
    }
    setSelectedIndex(index)
    setStartDate(min)
    setEndDate(max)
    setMinDate(minDateNew)
    setMaxDate(maxDateNew)
  };


  const handleCompanyChange = e => {
    if(e.value !== company.value) {
      setCompany(e);
    }
  };

  const handleTimeChange = e => {
    if(e.value !== company.value) {
      setTime(e);
    }
  };

  const applyFilter = () => {
    if(company.value > 0 ){
      notification(pageNo,pageSize)
    }
    else{
      warningToast("Please Select Company");
    }
  }

  const columns = [
    {
      dataField: "#",
      text: "Index",
      formatter: (cell, row, rowIndex) => {
        return <span>{(pageNo - 1) * pageSize + (rowIndex + 1)}</span>;
      }
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
    setPageNo(page);
    setPageSize(sizePerPage);
    let body ={
      company_id: company?.company_id,
      time_diff: time?.value,
      start_date: startDate ,
      end_date: endDate,
      page_number: page,
      page_size: sizePerPage,
    }
    if(body?.company_id && body?.time_diff && body?.start_date && body?.end_date && body?.page_number && body?.page_size){
      getNotificationForResultManagers(body);
    }
  };

  const onSizePerPageChanges = (sizePerPage,page ) => {
    setPageNo(1);
    setPageSize(sizePerPage);
    let body ={
      company_id: company?.company_id,
      time_diff: time?.value,
      start_date: startDate ,
      end_date: endDate,
      page_number: 1,
      page_size: sizePerPage,
    }
    if(body?.company_id && body?.time_diff && body?.start_date && body?.end_date && body?.page_number && body?.page_size){
      getNotificationForResultManagers(body);
    }
  };

  const notification =(pageNo,pageSize)=>{
    let body ={
      company_id: company?.company_id,
      time_diff: time?.value,
      start_date: startDate ,
      end_date: endDate,
      page_number: pageNo,
      page_size: pageSize,
    }
    if(body?.company_id && body?.time_diff && body?.start_date && body?.end_date && body?.page_number && body?.page_size){
      getNotificationForResultManagers(body);
    }

  }

  const getNotificationForResultManagers=(body)=>{
    setListLoading(true);
    getNotificationForResultManager(body)
        .then(response => {
          if (response && response.isSuccess) {
            setPageNo(response.data?.metadata?.page_number);
            setPageSize(response.data?.metadata?.page_size);
            setTotalSize(response.data?.metadata?.total_record);
            setUserDataByCompany(response.data?.data);
            setListLoading(false);
          } else throw new Error();
        })
        .catch(error => {
          warningToast("Something went wrong !");
          console.log("error" , error)
          setListLoading(false);
        });
  }

  const handleService = (cellContent, row) => {
    setServiceModalShow(true);
    setImageData(row?.result);
  };

  const handleServiceClose = () => {
    setServiceModalShow(false);
  };

  return (
      <>
    <Card className="example example-compact" style={{ minHeight: "220px" }}>
      <CardBody style={{ padding: "10px 10px" }}>
        <Row>
          <Col xl={8} xs={12} md={7}>
            <CardHeader title="Notification" />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xl={4} xs={12} md={4} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Company</Form.Label>
              <Select
                theme={theme => ({
                  ...theme,
                  colors: {
                    ...theme.colors,
                    primary25: "#5DBFC4",
                    primary: "#147b82"
                  }
                })}
                name="companyList"
                className="select-react-dropdown"
                isSearchable={false}
                options={companyOptions}
                onChange={opt => handleCompanyChange(opt)}
                value={company}
              />
            </Form.Group>
          </Col>
          <Col xl={4} xs={12} md={6} sm={12}>
          <Form.Group>
            <Form.Label>Select Date Range</Form.Label>
            <FormDateRangePicker
                rangeIndex={selectedIndex}
                minDate={minDate}
                maxDate={maxDate}
                startDate={startDate}
                endDate={endDate}
                changeDateTimeRange={dateTimeRangeChangeHandler}
                changeDateTimeRangeIndex={
                  dateTimeRangeIndexChangeHandler
                }
            />
          </Form.Group>
        </Col>


          <Col xl={2} lg={2} md={4} xs={6} sm={6} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Select
                  theme={theme => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: "#5DBFC4",
                      primary: "#147b82"
                    }
                  })}
                  name="timeList"
                  className="select-react-dropdown"
                  isSearchable={false}
                  options={TimeOptions}
                  onChange={opt => handleTimeChange(opt)}
                  value={time}
              />
            </Form.Group>
          </Col>
          <Col xl={2} lg={2} md={4} xs={6} sm={6} sm={6}>
            <Button
                style={{ paddingLeft: "10px", paddingRight: "10px" ,marginTop : "26px" }}
                className={"btn-apply-filter"}
                onClick={applyFilter}
            >
              Apply Filter
            </Button>
          </Col>

        </Row>



        <BlockUi tag="div"
                 blocking={listLoading}
                 color="#147b82">
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
                    totalSize={totalSize}
                    onTableChange={onPageChange}
                    sizePerPageChange={onSizePerPageChanges}
                />
              </>
          ) : (
              <>
                {" "}
                <h5 style={{ textAlign: "center" }}>No Data Found</h5>
              </>
          )}
        </BlockUi>

      </CardBody>
    </Card>
  <NotificationSendServiceModal
      serviceModalShow={serviceModalShow}
       userDataByCompany={userDataByCompany}
      handleServiceClose={handleServiceClose}
      imageData={imageData}
      company={company}
  />
  </>
  );
}
