import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { warningToast } from "../../../../../../utils/ToastMessage";

export function ModelTypeEditForm({ saveModelType, modelTypeData, onHide }) {
  const [formData, setFormData] = useState({
    modelTypeName: "",
    modelTypeDescription: "",
    status: false,
    id: "",
  });

  const isValidate = () => {
    if (!formData.modelTypeName) warningToast("Please Enter Model Type Name");
    else if (!formData.modelTypeDescription)
      warningToast("Please Enter Model Type Description");
    else return true;

    return false;
  };

  const handleChange = (e) => {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  };

  const handleSubmit = () => {
    if (isValidate()) saveModelType(formData);
  };

  useEffect(() => {
    setFormData({
      modelTypeName: modelTypeData.model_type_name || "",
      modelTypeDescription: modelTypeData.model_type_description || "",
      status: modelTypeData.status || false,
      id: modelTypeData.id || null,
    });
  }, [modelTypeData]);

  return (
    <>
      <Modal.Body>
        <Form>
          <Form.Group controlId="ModelTypeName" as={Row}>
            <Form.Label column sm={4}>
              Model Type Name
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="modelTypeName"
                placeholder="Model Type name"
                value={formData.modelTypeName}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group controlId="ModelTypeDescription" as={Row}>
            <Form.Label column sm={4}>
              Model Type Description
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Model Type description"
                name="modelTypeDescription"
                value={formData.modelTypeDescription}
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
