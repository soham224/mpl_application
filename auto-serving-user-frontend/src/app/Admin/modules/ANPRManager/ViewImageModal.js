import React, {useState} from "react";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';
import {Button, Modal, Row, Col, Table, Form, OverlayTrigger, Tooltip} from "react-bootstrap";

export function ViewImageModal({
                                   viewModalShow,
                                   anprViewsClose,
                                   fullViolationFullImage,
                                   plateViolationFullImage,
                                   rowDriverImage,
                                   plate,
                                   speed
                               }) {
    const [hovered, setHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({x: 50, y: 50});


    const handleMouseMove = (e) => {
        const {left, top, width, height} = e.target.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setMousePosition({x, y});
    };


    return (
        <Modal size="xl" show={viewModalShow} onHide={anprViewsClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Speed Violation Details</Modal.Title>
            </Modal.Header>
            <BlockUi tag="div" blocking={false} color="#147b82">
                <Modal.Body>

                    <Row>
                        <Col md={6}
                             className={'border-right d-flex flex-column justify-content-center'}
                             >
                            {fullViolationFullImage ? (
                                <div
                                    className="overflow-hidden border p-2 position-relative"
                                    style={{width: "100%", height: "auto"}}
                                    onMouseEnter={() => setHovered(true)}
                                    onMouseLeave={() => setHovered(false)}
                                    onMouseMove={handleMouseMove}
                                >
                                    <img
                                        src={fullViolationFullImage}
                                        alt="Violation"
                                        className="w-100"
                                        style={{
                                            height: "420px",
                                            transform: hovered ? `scale(2)` : "scale(1)",
                                            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                            transition: "transform 0.2s ease-in-out",
                                        }}
                                    />
                                </div>
                            ) : (
                                <h5>No Data Found</h5>
                            )}
                        </Col>

                        <Col md={6}
                             className={`${rowDriverImage && rowDriverImage.number_plate
                                 ? 'border-right d-flex flex-column justify-content-center'
                                 : 'border-right d-flex flex-column justify-content-around'}`}>
                            {rowDriverImage && rowDriverImage.number_plate ? (
                                <Table bordered size="sm">
                                    <tbody>
                                    <tr>
                                        <td><b>Owner Image:</b></td>
                                        <td>
                                            <img
                                                src={rowDriverImage?.image_url}
                                                alt="Violation"
                                                width={150}
                                                height={150}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Number Plate Image:</b></td>
                                        <td>
                                            <div
                                                className="overflow-hidden border p-2 position-relative"
                                                style={{ width: "100%", height: "auto" }}
                                            >
                                                {plateViolationFullImage ? (
                                                    <img
                                                        src={plateViolationFullImage}
                                                        alt="Plate"
                                                        className="w-100"
                                                    />
                                                ) : (
                                                    <div className="text-center text-muted p-3">
                                                        No image available
                                                    </div>
                                                )}
                                            </div>

                                        </td>
                                    </tr>
                                    <tr>
                                        <td><b>Number Plate:</b></td>
                                        <td>{rowDriverImage.number_plate}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Speed:</b></td>
                                        <td
                                            style={{ color:speed >= 31 ? "red" : "" }}
                                        >{speed}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Vehicle Type:</b></td>
                                        <td>{rowDriverImage.vehicle_type}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Owner Name:</b></td>
                                        <td>{rowDriverImage.owner_name}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Father's Name:</b></td>
                                        <td>{rowDriverImage.father_name}</td>
                                    </tr>
                                    <tr>
                                        <td><b>RC Date:</b></td>
                                        <td>{new Date(rowDriverImage.rc_date).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td><b>Vehicle Year:</b></td>
                                        <td>{rowDriverImage.vehicle_year}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            ) : (
                                <>
                                    <Table bordered size="sm">
                                        <tbody>
                                        <tr>
                                            <td><b>Number Plate Image:</b></td>
                                            <td>
                                                <div
                                                    className="overflow-hidden border p-2 position-relative"
                                                    style={{width: "100%", height: "auto"}}
                                                >
                                                    <img
                                                        src={plateViolationFullImage}
                                                        alt="Plate"
                                                        className="w-100"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><b>Number Plate:</b></td>
                                            <td>{plate}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Speed:</b></td>
                                            <td  style={{ color: speed >= 31 ? "red" : "" }}>{speed}</td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                    <h5 className="text-center w-100">No Matching Data Found,<br/>Please Check Your
                                        Vehicle Details Entry!</h5>
                                </>
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
