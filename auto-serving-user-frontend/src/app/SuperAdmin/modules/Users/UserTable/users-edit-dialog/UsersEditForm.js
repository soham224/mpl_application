import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { warningToast } from "../../../../../../utils/ToastMessage";
import Select from "react-select";

export function UsersEditForm({ saveUser, onHide }) {
  const [formData, setFormData] = useState({
    userEmail: "",
    companyEmail: "",
    companyName: "",
    companyDescription: "",
    companyAddress: "",
    companyPinCode: "",
    companyWebsite: "",
    companyContact: "",
    companyPoc: "",
    companyPocContact: "",
    userPassword: "",
    deploymentRegion: "",
    status: false,
  });

  const deploymentRegion = [
    {
      label: "Ohio",
      value: "us-east-2",
    },
    {
      label: "N. Virginia",
      value: "us-east-1",
    },
    {
      label: "N. California",
      value: "us-west-1",
    },
    {
      label: "Oregon",
      value: "us-west-2",
    },
    {
      label: "Cape Town",
      value: "af-south-1",
    },
    {
      label: "Hong Kong",
      value: "ap-east-1",
    },
    {
      label: "Mumbai",
      value: "ap-south-1",
    },
    {
      label: "Osaka",
      value: "ap-northeast-3",
    },
    {
      label: "Seoul",
      value: "ap-northeast-2",
    },
    {
      label: "Singapore",
      value: "ap-southeast-1",
    },
    {
      label: "Sydney",
      value: "ap-southeast-2",
    },
    {
      label: "Tokyo",
      value: "ap-northeast-1",
    },
    {
      label: "Central",
      value: "ca-central-1",
    },
    {
      label: "Frankfurt",
      value: "eu-central-1",
    },
    {
      label: "Ireland",
      value: "eu-west-1",
    },
    {
      label: "London",
      value: "eu-west-2",
    },
    {
      label: "Milan",
      value: "eu-south-1",
    },
    {
      label: "Paris",
      value: "eu-west-3",
    },
    {
      label: "Stockholm",
      value: "eu-north-1",
    },
    {
      label: "Bahrain",
      value: "me-south-1",
    },
    {
      label: "São Paulo",
      value: "sa-east-1",
    },
  ];

  const [result, setSelectedValue] = useState(null);
  const handleSelect2 = (obj) => {
    setSelectedValue(obj);
  };
  const handleSubmit = (formData) => {
    if (isValidate()) saveUser(formData);
  };

  const handleChange = (e) => {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormData(data);
  };

  const emailPattern =
    /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const contactPattern = /^[0-9]{10}$/;

  const isValidate = () => {
    if (!formData.userEmail) warningToast("Please Enter User Email");
    else if (!formData.userEmail.match(emailPattern))
      warningToast("Please Enter Valid User Email Address");
    else if (!formData.userPassword) warningToast("Please Enter User Password");
    else if (!formData.userPassword.match(passwordPattern))
      warningToast(
        "Password Requires Minimum Eight Characters, One Special Character and One Number"
      );
    else if (!formData.companyEmail) warningToast("Please Enter Company Email");
    else if (!formData.companyEmail.match(emailPattern))
      warningToast("Please Enter Valid Company Email Address");
    else if (!formData.companyName) warningToast("Please Enter Company Name");
    else if (!formData.companyDescription)
      warningToast("Please Enter Company Description");
    else if (!formData.companyAddress)
      warningToast("Please Enter Company Address");
    else if (!formData.companyPinCode)
      warningToast("Please Enter Company Pin Code");
    else if (!formData.companyWebsite)
      warningToast("Please Enter Company Website");
    else if (!formData.companyContact)
      warningToast("Please Enter Company Contact");
    else if (!formData.companyContact.match(contactPattern))
      warningToast("Please Enter Valid Company Contact");
    else if (!formData.companyPoc) warningToast("Please Enter Company POC");
    else if (!formData.companyPocContact.match(contactPattern))
      warningToast("Please Enter Valid Company POC Contact");
    else return true;

    return false;
  };

  return (
    <>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} controlId="formHorizontalEmail">
            <Form.Label column sm={4}>
              {" "}
              User Email Address
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="User email address"
                value={formData.userEmail}
                name="userEmail"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formHorizontalPassword">
            <Form.Label column sm={4}>
              {" "}
              User Password{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="password"
                placeholder="User password"
                value={formData.userPassword}
                name="userPassword"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="companyEmail">
            <Form.Label column sm={4}>
              {" "}
              Company Email Address{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Company email address"
                value={formData.companyEmail}
                name="companyEmail"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="companyName">
            <Form.Label column sm={4}>
              {" "}
              Company Name{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Company name"
                value={formData.companyName}
                name="companyName"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="companyDescription">
            <Form.Label column sm={4}>
              {" "}
              Company Description{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Company description"
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="companyAddress">
            <Form.Label column sm={4}>
              {" "}
              Company Address{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                as="textarea"
                rows="3"
                placeholder="Company address"
                value={formData.companyAddress}
                name="companyAddress"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="companyPinCode">
            <Form.Label column sm={4}>
              {" "}
              Company Pincode{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Company pincode"
                value={formData.companyPinCode}
                name="companyPinCode"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="companyWebsite">
            <Form.Label column sm={4}>
              {" "}
              Company Website{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Company website"
                value={formData.companyWebsite}
                name="companyWebsite"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="companyContact">
            <Form.Label column sm={4}>
              {" "}
              Company Contact
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Company contact"
                value={formData.companyContact}
                name="companyContact"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="companyPoc">
            <Form.Label column sm={4}>
              {" "}
              Company POC{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Company POC"
                value={formData.companyPoc}
                name="companyPoc"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="companyPocContact">
            <Form.Label column sm={4}>
              {" "}
              Company POC Contact{" "}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                placeholder="Company POC contact"
                value={formData.companyPocContact}
                name="companyPocContact"
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="deploymentRegion">
            <Form.Label column sm={4}>
              deploymentRegion{" "}
            </Form.Label>
            <Col sm={8}>
              <Select
                onChange={handleSelect2}
                options={deploymentRegion}
                value={result}
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
          onClick={() => handleSubmit(formData)}
          className="btn btn-primary btn-elevate"
        >
          Save
        </Button>
      </Modal.Footer>
    </>
  );
}
