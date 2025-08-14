import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import { Card, CardBody } from "../../../../_metronic/_partials/controls";
import DeployedJobs from "./components/DeployedJobs";
import DeployedRTSPJobs from "./components/DeployedRTSPJobs";

export default class DeployedDetails extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      key: "deployedJobs"
    };
  }

  setKey = key => this.setState({ key });

  handleTabChange = key => {
    this.setState({ key });
    this.props.history.push(`/deployedDetails/${key}Page`);
  };

  render() {
    return (
      <Card className="example example-compact">
        {/*<CardHeader title={"Deployed Details"}/>*/}
        <CardBody>
          <Tabs
            id="controlled-tab-example"
            activeKey={this.state.key}
            onSelect={this.handleTabChange}
            style={{ fontSize: "1.275rem", fontWeight: "500" }}
          >
            <Tab eventKey="deployedJobs" title="Deployed Jobs">
              <DeployedJobs setKey={this.setKey} />
            </Tab>
            <Tab eventKey="deployedRTSPJobs" title="Deployed RTSP Jobs">
              <DeployedRTSPJobs setKey={this.setKey} />
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    );
  }
}
