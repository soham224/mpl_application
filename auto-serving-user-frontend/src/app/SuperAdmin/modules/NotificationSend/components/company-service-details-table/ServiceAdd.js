import React from 'react';
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import Select from "react-select";

function ServiceAdd({onHideAddServiceModal ,showAddSerivceModal}) {
    return (
         <>
            <Modal
                size="lg"
                show={showAddSerivceModal}
                onHide={onHideAddServiceModal}
                centered
                aria-labelledby="contained-modal-title-vcenter"
                style={{ background: "#00000080" }}
            >
                <Modal.Header closeButton={onHideAddServiceModal}>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Add Services
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="locationName" as={Row}>
                            <Form.Label column sm={4}>
                                Service Name
                            </Form.Label>
                            <Col sm={8}>
                                <Form.Group>
                                    <Select
                                        theme={theme => ({
                                            ...theme,
                                            colors: {
                                                ...theme.colors,
                                                primary25: "#5DBFC4",
                                                primary: "#147b82"
                                            }
                                        })}
                                        name="labelOptions"
                                        isSearchable={false}
                                        isMulti={true}
                                        placeholder="Select Service"
                                        // isLoading={labelLoading}
                                        className="select-react-dropdown"
                                        // options={labelOptions}
                                        // onChange={(opt) => handleLabelChange(opt)}
                                        // value={selectedLabel}
                                    />
                                </Form.Group>
                            </Col>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        type="button"
                        onClick={onHideAddServiceModal}
                        className="btn btn-light btn-elevate"
                    >
                        Cancel
                    </Button>
                    <> </>
                    <Button
                        type="submit"
                        onClick={onHideAddServiceModal}
                        className="btn btn-primary btn-elevate"
                    >
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>{" "}
        </>
    );
}

export default ServiceAdd;