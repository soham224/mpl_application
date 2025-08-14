import React  from "react";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import { Button, Modal, Row, Col, Table } from "react-bootstrap";

export function ViewAnprDetailsModal({ viewModalShow, anprViewsClose,rowDriverImage }) {

    return (
        <Modal size="md" show={viewModalShow} onHide={anprViewsClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Vehicle Details</Modal.Title>
            </Modal.Header>
            <BlockUi tag="div" blocking={false} color="#147b82">
                <Modal.Body>
                    <Row>
                        <Col md={6} >
                            {rowDriverImage ? (
                                <div
                                    className="d-flex flex-column align-items-center"
                                >
                                    <img
                                        src={rowDriverImage?.image_url}
                                        alt="Violation"
                                        width={150}
                                        height={170}
                                    />
                                </div>
                            ) : (
                                <h5>No Data Found</h5>
                            )}
                        </Col>

                        <Col md={6} className="border-right d-flex flex-column justify-content-center">
                            {rowDriverImage && rowDriverImage ? (
                                <Table bordered size="sm">
                                    <tbody>
                                    <tr>
                                        <td><b>Number Plate:</b></td>
                                        <td>{rowDriverImage.number_plate || '-' }</td>
                                    </tr>
                                    <tr>
                                        <td><b>Vehicle Type:</b></td>
                                        <td>{rowDriverImage.vehicle_type || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Owner Name:</b></td>
                                        <td>{rowDriverImage.owner_name || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Father's Name:</b></td>
                                        <td>{rowDriverImage.father_name || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td><b>RC Date:</b></td>
                                        <td>{new Date(rowDriverImage.rc_date).toLocaleDateString()  || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Vehicle Year:</b></td>
                                        <td>{rowDriverImage.vehicle_year || '-'}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            ) : (
                                <h5 className="text-center w-100">No Data Found</h5>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={anprViewsClose}>Close</Button>
                </Modal.Footer>
            </BlockUi>
        </Modal>
    );
}
