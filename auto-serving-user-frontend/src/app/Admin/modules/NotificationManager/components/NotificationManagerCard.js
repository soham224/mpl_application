import React, { useMemo } from "react";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { NotificationManagerTable } from "./notification-manager-details-table/NotificationManagerTable";
import { useNotificationManagerUIContext } from "./NotificationManagerUIContext";
import { Col, Row } from "reactstrap";
import CardHeader from "@material-ui/core/CardHeader";
import {shallowEqual, useSelector} from "react-redux";

export function NotificationManagerCard() {
  const notificationManagerUIContext = useNotificationManagerUIContext();
  const notificationManagerUIProps = useMemo(() => {
    return {
      newNotificationManagerButtonClick: notificationManagerUIContext.openNewNotificationManagerDialog
    };
  }, [notificationManagerUIContext]);



  const {user} = useSelector(
      (state) => ({
        user: state.auth.user
      }),
      shallowEqual
  );

  console.log("NotificationManagerCard")
  return (
    <Card className="example example-compact" style={{ minHeight: "300px" }}>
      <CardBody style={{ minHeight: "300px", padding: "10px 10px" }}>
        <Row>
          <Col xl={8} xs={12} md={7}>
            <CardHeader title="Notification Details" />
          </Col>
          <Col xl={4} xs={12} md={5} style={{ marginTop: "10px" }}>
            <Row>
              <Col
                xl={12}
                xs={12}
                md={12}
                lg={12}
                sm={12}
                className="text-lg-right text-md-right text-xl-right text-sm-right  text-right header-btn"
              >
                {user?.user_email !== 'user.mpl@tusker.ai' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={notificationManagerUIProps.newNotificationManagerButtonClick}
                >
                  Add Notification Details
                </button>
                    )}
              </Col>
            </Row>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xl={12} style={{ padding: "10px 20px", minWidth: "300px" }}>
            <NotificationManagerTable />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
