import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { warningToast } from "../../../../../../utils/ToastMessage";
import { shallowEqual, useSelector } from "react-redux";
import Cookies from "universal-cookie";

export function LocationEditForm({ saveLocation, locationData, onHide }) {
  const [formData, setFormData] = useState({
    locationName: "",
    id: ""
  });
  // eslint-disable-next-line
  const { isAuthorized, user } = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user?.id && new Cookies().get("access_token"),
      user: auth.user
    }),
    shallowEqual
  );
  const isValidate = () => {
    if (!formData.locationName) warningToast("Please Enter Location Name");
    else return true;

    return false;
  };

  const handleChange = e => {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  };

  useEffect(() => {
    setFormData({
      locationName: locationData?.location_name || "",
      id: locationData?.id || null
    });
  }, [locationData]);

  const handleSubmit = () => {
    if (isValidate()) {
      saveLocation(formData);
    }
  };

  return (
    <>
      <Modal.Body>
        <Form>
          <Form.Group controlId="locationName" as={Row}>
            <Form.Label column sm={4}>
              Location Name
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="locationName"
                placeholder="Location name"
                value={formData.locationName}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
        >
          Cancel
        </Button>
        <> </>
        <Button
            variant="primary"
          onClick={handleSubmit}
        >
          Save
        </Button>
      </Modal.Footer>
    </>
  );
}
