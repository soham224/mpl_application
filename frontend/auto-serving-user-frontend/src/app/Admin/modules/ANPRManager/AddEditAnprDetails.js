import React, { useEffect, useState } from "react";
import {Button, Form, Modal} from "react-bootstrap";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';
import {Col, Row} from "reactstrap";
import Select from "react-select";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import DatePicker from "react-multi-date-picker";
import {
    getCurrentDayStartDateWithTimeInUtc,
    getUtcDateAndTimeFromCalendar
} from "../../../../utils/TimeZone";


function AddEditAnprDetails({
                                        show,
                                anprDetailsClose,
                                saveAnprDetails,
    editModalData
                                    }) {
    const [formData, setFormData] = useState({
        number_plate: "",
        father_name : "",
        owner_name : "",
        vehicle_year : ""
    });
    const [driverImage,setDriverImage] = useState('');
    const [vehicleType,setVehicleType] = useState(null);
    const [values, setValues] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const [error, setError] = useState({
        number_plate : "",
        father_name : "",
        owner_name : "",
        vehicle_year : ""
    });

    useEffect(() => {
        validateForm();
    }, [formData, vehicleType, driverImage, startDate]);

    const validateForm = () => {
        if(editModalData?.id){

            const isValid =
                formData.number_plate.trim() !== "" &&
                formData.father_name.trim() !== "" &&
                formData.owner_name.trim() !== "" &&
                formData.vehicle_year.trim() !== "" &&
                vehicleType !== null &&
                // driverImage !== '' &&
                startDate !== null;

            setIsFormValid(isValid);
        }else {

            const isValid =
                formData.number_plate.trim() !== "" &&
                formData.father_name.trim() !== "" &&
                formData.owner_name.trim() !== "" &&
                formData.vehicle_year.trim() !== "" &&
                vehicleType !== null &&
                driverImage !== '' &&
                startDate !== null;

            setIsFormValid(isValid);
        }
    };

    useEffect(() => {

        if (show && editModalData?.id) {
            setFormData({

                father_name : editModalData?.father_name || "",
                owner_name : editModalData?.owner_name || "",
                number_plate: editModalData?.number_plate || "",
                vehicle_year : editModalData.vehicle_year?.toString()  || "",
                id: editModalData?.id || ""

            });
            {editModalData?.vehicle_type &&
            setVehicleType({ label: editModalData?.vehicle_type,
                value: editModalData?.vehicle_type}) }


        } else if (!show) {
            setFormData({
                number_plate : "",
                father_name : "",
                owner_name : "",
                vehicle_year : ""
            });
            setVehicleType(null)
            setDriverImage('');
            setError({
                number_plate : "",
                father_name : "",
                owner_name:"",
                vehicle_year : ""
            });
        }
    }, [show, editModalData]);


    const handleSubmit = () => {
        const formDataImage = new FormData();
        formDataImage.append("file", driverImage);
        formDataImage.append("number_plate", formData?.number_plate);
        formDataImage.append("vehicle_type", vehicleType?.label);
        formDataImage.append("owner_name", formData?.owner_name);
        formDataImage.append("father_name", formData?.father_name);
        formDataImage.append("rc_date", startDate);
        formDataImage.append("vehicle_year", formData?.vehicle_year);

        saveAnprDetails(formDataImage,editModalData?.id);
    };
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value.toString() }));


        setError((prev) => ({
            ...prev,
            [name]: value.trim() ? "" : `${name.replace("_", " ")} is required`,
        }));
    };


    const handleVehicleTypeChange = (value) => {
        setVehicleType(value);
        setError((prev) => ({ ...prev, vehicleType: value ? "" : "Vehicle type is required" }));
    }

    const handleChangepic = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setError((prev) => ({ ...prev, driverImage: "Owner photo is required" }));
            return;
        }

        setDriverImage(file);
        setError((prev) => ({ ...prev, driverImage: "" }));
    };

    const handleStartDateChange = e => {
        if (e[0]) {
            let selected_day = e[0].day;
            let date_GMT =
                e[0].year +
                "-" +
                e[0].month.number +
                "-" +
                selected_day +
                " " +
                e[0].hour.toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                }) +
                ":" +
                e[0].minute.toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                });
            setStartDate(getUtcDateAndTimeFromCalendar(date_GMT));
        }else {
            setStartDate(getCurrentDayStartDateWithTimeInUtc());
        }
    };


    return (
        <>
            <Modal
                size="lg"
                show={show}
                onHide={anprDetailsClose}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        {editModalData?.id ? "Edit" : "Add New "} Vehicle Details
                    </Modal.Title>
                </Modal.Header>
                <BlockUi tag="div" blocking={false} color="#147b82">
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="owner_name" as={Row}>
                                <Form.Label column sm={4}>
                                    Owner Name
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="text"
                                        name="owner_name"
                                        placeholder="Owner Name"
                                        value={formData.owner_name}
                                        onChange={handleChange}
                                        isInvalid={!!error['owner_name']}
                                    />
                                    <Form.Control.Feedback type="invalid">{error['owner_name']}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group controlId="father_name" as={Row}>
                                <Form.Label column sm={4}>
                                    Father Name
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="text"
                                        name="father_name"
                                        placeholder="Father Name"
                                        value={formData.father_name}
                                        onChange={handleChange}
                                        isInvalid={!!error['father_name']}
                                    />
                                    <Form.Control.Feedback type="invalid">{error['father_name']}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            <Form.Group controlId="number_plate" as={Row}>
                                <Form.Label column sm={4}>
                                    Vehicle number
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="text"
                                        name="number_plate"
                                        placeholder="Vehicle number"
                                        value={formData.number_plate}
                                        onChange={handleChange}
                                        isInvalid={!!error['number_plate']}
                                    />
                                    <Form.Control.Feedback type="invalid">{error['number_plate']}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group controlId="vehicleType" as={Row}>
                                <Form.Label column sm={4}>
                                    Vehicle Type
                                </Form.Label>
                                <Col sm={8}>
                                    <Select
                                        theme={(theme) => ({
                                            ...theme,
                                            borderRadius: 0,
                                            colors: {
                                                ...theme.colors,
                                                primary25: "#5DBFC4",
                                                primary: "#147b82",
                                            },
                                        })}
                                        isSearchable={false}
                                        isMulti={false}
                                        placeholder="Select Vehicle Type"
                                        isDisabled={false}
                                        value={vehicleType}
                                        onChange={e => {
                                            handleVehicleTypeChange(e);
                                        }}
                                        options={vehicleTypeOptions}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group controlId="date" as={Row}>
                                <Form.Label column sm={4}>
                                   Rc Date
                                </Form.Label>
                                <Col sm={8}>
                                    <DatePicker
                                        style={{
                                            border: "1px solid hsl(0,0%,80%)",
                                            minHeight: "40px"
                                        }}
                                        placeholder="Select Date Range"
                                        className="teal filterDateWidth"
                                        format="MM/DD/YYYY"
                                        value={values}
                                        onChange={e => {
                                            setValues(e);
                                            handleStartDateChange(e);
                                        }}
                                        plugins={[
                                            <DatePanel markFocused />
                                        ]}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group controlId="vehicle_year" as={Row}>
                                <Form.Label column sm={4}>
                                    Total Year Of Vehicle
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="text"
                                        name="vehicle_year"
                                        placeholder="Total Year Of Vehicle"
                                        value={formData.vehicle_year}
                                        onChange={handleChange}
                                        isInvalid={!!error['vehicle_year']}
                                    />
                                    <Form.Control.Feedback type="invalid">{error['vehicle_year']}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            {editModalData === null &&
                            <Form.Group controlId="ownerphoto" as={Row}>
                                <Form.Label column sm={4}>
                                    Owner photo
                                </Form.Label>
                                <Col sm={8}>
                                    <div>
                                        <input
                                            type="file"
                                            onChange={handleChangepic}
                                            className="show-for-sr"/>
                                    </div>
                                </Col>
                            </Form.Group>}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={anprDetailsClose}

                        >
                            Cancel
                        </Button>

                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={!isFormValid}

                        >
                            {editModalData?.id ? 'Update' :' Save'}
                        </Button>
                    </Modal.Footer>
                </BlockUi>
            </Modal>
        </>
    );
}

export default AddEditAnprDetails;

const vehicleTypeOptions = [
    {
        "label": "MotorBike",
        "value": 'MotorBike'
    },
    {
        "label": "Car",
        "value": "Car"
    }, {
        "label": "Bus",
        "value": "Bus"
    },
    {
        "label": "Truck",
        "value": "Truck"
    },
    {
        "label": "SUV",
        "value": "SUV"
    },
    {
        "label": "Van",
        "value": "Van"
    },
    {
        "label": "Forklift",
        "value": "Forklift"
    },
    {
        "label": "Excavator",
        "value": "Excavator"
    },
    {
        "label": "TowTruck",
        "value": "TowTruck"
    },
    {
        "label": "PoliceCar",
        "value": "PoliceCar"
    },
    {
        "label": "FireEngine",
        "value": "FireEngine"
    },
    {
        "label": "Ambulance",
        "value": "Ambulance"
    },
    {
        "label": "Bicycle",
        "value": "Bicycle"
    },
    {
        "label": "EBike",
        "value": "EBike"
    },
    {
        "label": "Hyva",
        "value": 'Hyva'
    },
    {
        "label": "Other",
        "value": "Other"
    },
]


