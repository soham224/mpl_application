import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import DeploymentJobs from "./components/DeploymentJobs";
import DeploymentRTSPJobs from "./components/DeploymentRTSPJobs";

export default class DeploymentDetails extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: "deploymentJobs"
    };
  }

  setKey = key => this.setState({ key });

  handleTabChange = key => {
    this.setState({ key });
    this.props.history.push(`/deploymentDetails/${key}Page`);
  };

  render() {
    return (
      <Card className="example example-compact">
        {/*<CardHeader title={"Deployment Details"}/>*/}
        <CardBody>
          <Tabs
            id="controlled-tab-example"
            activeKey={this.state.key}
            onSelect={this.handleTabChange}
            style={{ fontSize: "1.275rem", fontWeight: "500" }}
          >
            <Tab eventKey="deploymentJobs" title="Deployment Jobs">
              <DeploymentJobs setKey={this.setKey} />
            </Tab>
            <Tab eventKey="deploymentRTSPJobs" title="Deployment RTSP Jobs">
              <DeploymentRTSPJobs setKey={this.setKey} />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    );
  }
}
