import React from "react";
import {Modal} from "react-bootstrap";

export function AIModelEditDialogHeader() {
    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">Add AI Model</Modal.Title>
            </Modal.Header>
        </>
    );
}
