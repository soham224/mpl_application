import React, { useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import { useHistory } from "react-router-dom";
import { useSubheader } from "../../../../_metronic/layout";
import { ADMIN_URL } from "../../../../enums/constant";

export function RequestedResults() {
  const [key, setKey] = React.useState("deployedJobs");
  const history = useHistory();
  const subheader = useSubheader();
  subheader.setTitle("Subscription Details");

  useEffect(() => {
    setKey("deployedJobs");
    //  eslint-disable-next-line
  }, []);

  const setValue = (value) => {
    setKey(value);
    if (value === "deploymentJobs") {
      history.push(ADMIN_URL + "/subscriptions/deploymentJobsPage");
    } else {
      history.push(ADMIN_URL + "/subscriptions/deployedJobsPage");
    }
  };

  return (
    <Card className="example example-compact">
      {/*<CardHeader title={"Deployment Details"}/>*/}
      <CardBody>
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          defaultActiveKey="deployedJobs"
          onSelect={(e) => {
            setValue(e);
          }}
          style={{ fontSize: "1.275rem", fontWeight: "500" }}
        >

        </Tabs>
      </CardBody>
    </Card>
  );
}
