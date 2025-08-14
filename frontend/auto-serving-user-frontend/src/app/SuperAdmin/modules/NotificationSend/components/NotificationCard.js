import React, { useEffect, useState } from "react";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { NotificationServiceTable } from "./company-service-details-table/NotificationServiceTable";
import { Col, Row } from "reactstrap";
import CardHeader from "@material-ui/core/CardHeader";
import { warningToast } from "../../../../../utils/ToastMessage";
import {getResultForWhatsapp} from "../_redux";

export function NotificationCard() {
  const [userListLoader, setUserListLoader] = useState(false);
  const [allUserData, setAllUserData] = useState([]);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getResultForWhatsappList()
  }, []);

  const handleSearchChange = event => {
    // console.log(
    //     "event::handleSearchChange::",
    //     event,
    //     event.target.name,
    //     event.target.value
    // );
  };

  const getResultForWhatsappList = () => {
    setUserListLoader(true);
    getResultForWhatsapp(page , sizePerPage)
        .then(response => {
          if (response && response.isSuccess) {
            setAllUserData(response.data);
            setUserListLoader(false);

          }
        })
        .catch(e => {
          setUserListLoader(false);
          warningToast("Something went wrong");
        });
  };


  return (
    <>
      <Card className="example example-compact">
        <CardBody style={{ padding: "10px 10px" }}>
          <Row>
            <Col xl={10} xs={12} md={5}>
              <CardHeader title="Notification Data" />
            </Col>
            <Col xl={2} xs={12} md={4}>
              <input
                type="text"
                autoFocus={true}
                placeholder="Search..."
                // value={searchValue}
                onChange={handleSearchChange}
                className="form-control mt-5"
              />
            </Col>

          </Row>
          <hr />
          <NotificationServiceTable
            sizePerPage={sizePerPage}
            page={page}
            companyListByIdLoader={userListLoader}
            userDataByCompany={allUserData}
          />
        </CardBody>
      </Card>

    </>
  );
}
