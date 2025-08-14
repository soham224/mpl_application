import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { warningToast } from "../../../../../../utils/ToastMessage";

export function DeviceEditForm({ saveDevice, deviceData, onHide }) {
  const [formData, setFormData] = useState({
    deviceName: "",
    deviceDescription: "",
    status: false,
    id: ""
  });

  const isValidate = () => {
    if (!formData.deviceName) warningToast("Please Enter Device Name");
    else if (!formData.deviceDescription)
      warningToast("Please Enter Device Description");
    else return true;

    return false;
  };

  const handleChange = e => {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  };

  const handleSubmit = () => {
    if (isValidate()) saveDevice(formData);
  };

  useEffect(() => {
    setFormData({
      deviceName: deviceData.device_name || "",
      deviceDescription: deviceData.device_description || "",
      status: deviceData.status || false,
      id: deviceData.id || null
    });
  }, [deviceData]);

  return (
    <>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} controlId="deviceName">
            <Form.Label column sm={4}>
              Device Name
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Device Name"
                value={formData.deviceName}
                name="deviceName"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="deviceDescription">
            <Form.Label column sm={4}>
              Device Description
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Device Description"
                name="deviceDescription"
                value={formData.deviceDescription}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          type="button"
          onClick={onHide}
          className="btn btn-light btn-elevate"
        >
          Cancel
        </Button>
        <> </>
        <Button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-primary btn-elevate"
        >
          Save
        </Button>
      </Modal.Footer>
    </>
  );
}
