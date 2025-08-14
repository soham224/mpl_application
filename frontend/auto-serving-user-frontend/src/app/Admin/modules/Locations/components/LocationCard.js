import React, { useMemo } from "react";
import { Card, CardBody } from "../../../../../_metronic/_partials/controls";
import { LocationTable } from "./location-details-table/LocationTable";
import { useLocationUIContext } from "./LocationUIContext";
import { Col, Row } from "reactstrap";
import CardHeader from "@material-ui/core/CardHeader";

export function LocationCard() {
  const locationUIContext = useLocationUIContext();
  const locationUIProps = useMemo(() => {
    return {
      newLocationButtonClick: locationUIContext.openNewLocationDialog
    };
  }, [locationUIContext]);

  return (
    <Card className="example example-compact" style={{ minHeight: "300px" }}>
      <CardBody style={{ minHeight: "300px", padding: "10px 10px" }}>
        <Row>
          <Col xl={8} xs={12} md={7}>
            <CardHeader title="Location Details" />
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
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={locationUIProps.newLocationButtonClick}
                >
                  Add Location Details
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xl={12} style={{ padding: "10px 20px", minWidth: "300px" }}>
            <LocationTable />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
}
