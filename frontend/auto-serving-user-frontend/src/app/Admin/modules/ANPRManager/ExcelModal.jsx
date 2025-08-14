import React from 'react';
import {Button, Modal} from "react-bootstrap";
import BlockUi from "react-block-ui";
import {useDispatch} from "react-redux";
import * as action from "./_redux/AnprManagerAction";
import {successToast} from "../../../../utils/ToastMessage";
import 'react-block-ui/style.css';


function ExcelModal({show , closeModal}) {
    const dispatch = useDispatch();
    const [formDetails, setFormDetails] = React.useState(null);
    const [loader, setLoader] = React.useState(false);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (!file) {
            return;
        }

        // Validate file type
        const allowedExtensions = ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
        if (!allowedExtensions.includes(file.type)) {
            alert("Invalid file type. Please upload an Excel file (.xls or .xlsx).");
            return;
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert("File size exceeds 5MB. Please upload a smaller file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        setFormDetails(formData);
    };


    const submitModal = () =>{
        if (!formDetails) {
            alert("Please select a file before submitting.");
            return;
        }

        setLoader(true);
        dispatch(action.uploadVehicleDetail(formDetails))
            .then((response) => {
                if (response) {
                    successToast("Vehicle details uploaded successfully");
                    setFormDetails(null)
                    setLoader(false);
                    closeModal()
                }
            })
            .catch((error) => {
                setFormDetails(null)
                setLoader(false);
                closeModal()
                console.error("Error uploading file:", error);
            });
    }

    const handleClose = () => {
        setFormDetails(null);  // Clear file when closing modal
        closeModal();
    };


    return (
        <>
            <Modal
                size="lg"
                show={show}
                onHide={closeModal}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                      Add New Vehicle Details Excel
                    </Modal.Title>
                </Modal.Header>
                <BlockUi tag="div" blocking={loader} color="#147b82">
                    <Modal.Body className="d-flex">
                        {/* Hidden file input */}
                        <input
                            type="file"
                            id="excelUpload"
                            accept=".xlsx, .xls"
                            style={{ display: "none" }}
                            onChange={handleFileUpload}
                        />

                        {/* Button to trigger file input */}
                        <label htmlFor="excelUpload" className="btn btn-secondary">
                            Upload Excel File
                        </label>

                        {/* Display the selected file name */}
                        {formDetails && (
                            <p style={{ marginTop: "10px" , marginLeft: "10px" }}>
                                 {formDetails.get("file").name}
                            </p>
                        )}
                    </Modal.Body>

                </BlockUi>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="primary"
                        onClick={submitModal}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
                </Modal>
        </>
    );
}

export default ExcelModal;