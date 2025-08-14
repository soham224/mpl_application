import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { warningToast } from "../../../../../../utils/ToastMessage";

export function FrameworkDetailsEditForm({
  saveFrameworkDetails,
  frameworkData,
  onHide,
}) {
  const [formData, setFormData] = useState({
    frameworkName: "",
    frameworkVersionNo: "",
    deprecated: false,
    status: false,
    id: "",
  });

  const isValidate = () => {
    if (!formData.frameworkName) warningToast("Please Enter Framework Name");
    else if (!formData.frameworkVersionNo)
      warningToast("Please Enter Framework Version");
    else return true;

    return false;
  };

  const handleChange = (e) => {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  };

  useEffect(() => {
    setFormData({
      frameworkName: frameworkData.framework_name || "",
      frameworkVersionNo: frameworkData.framework_version_number || "",
      deprecated: frameworkData.is_deprecated || false,
      status: frameworkData.status || false,
      id: frameworkData.id || null,
    });
  }, [frameworkData]);

  const handleSubmit = () => {
    if (isValidate()) {
      saveFrameworkDetails(formData);
    }
  };

  return (
    <>
      <Modal.Body>
        <Form>
          <Form.Group controlId="frameworkName" as={Row}>
            <Form.Label column sm={4}>
              Framework Name
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="frameworkName"
                placeholder="Framework name"
                value={formData.frameworkName}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group controlId="frameworkVersionNo" as={Row}>
            <Form.Label column sm={4}>
              Framework Version Number
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="frameworkVersionNo"
                placeholder="Framework Version Number"
                value={formData.frameworkVersionNo}
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
