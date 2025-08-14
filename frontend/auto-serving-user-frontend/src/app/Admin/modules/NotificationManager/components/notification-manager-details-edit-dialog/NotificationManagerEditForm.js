import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { warningToast } from "../../../../../../utils/ToastMessage";

export function NotificationManagerEditForm({ saveNotification, notificationData, onHide }) {
  const [formData, setFormData] = useState({
    email: "",
    id: ""
  });
  const [error, setError] = useState({
    email: "",
  });


  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidate = () => {
    let newError = { email: "" };

    if (!formData.email) {
      newError.email = "Please enter an email.";
    } else if (!isValidEmail(formData.email)) {
      newError.email = "Please enter a valid email address.";
    }

    setError(newError);

    if (newError.email) {
      warningToast(newError.email);
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validation as user types
    if (name === "email") {
      if (!value) {
        setError((prev) => ({ ...prev, email: "Please enter an email." }));
      } else if (!isValidEmail(value)) {
        setError((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      } else {
        setError((prev) => ({ ...prev, email: "" }));
      }
    }
  };

  useEffect(() => {
    setFormData({
      email: notificationData?.email || "",
      id: notificationData?.id || null
    });
  }, [notificationData]);

  const handleSubmit = () => {
    if (isValidate()) {
      saveNotification(formData);
    }
  };

  return (
      <>
        <Modal.Body>
          <Form>
            <Form.Group controlId="email" as={Row}>
              <Form.Label column sm={4}>
                Email
              </Form.Label>
              <Col sm={8}>
                <Form.Control
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!error.email} // Bootstrap validation styling
                />
                <Form.Control.Feedback type="invalid">
                  {error.email}
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <> </>
          <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!!error.email || !formData.email} // Disable button if error exists
          >
            Save
          </Button>
        </Modal.Footer>
      </>
  );
}
