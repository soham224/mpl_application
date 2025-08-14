import React, {useEffect, useState} from 'react';
import {Card, CardBody, Col, Row} from "reactstrap";
import CardHeader from "@material-ui/core/CardHeader";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TablePagination from "@material-ui/core/TablePagination";
import moment from "moment/moment";
import Switch from "@material-ui/core/Switch/Switch";
import VisibilityIcon from "@material-ui/icons/Visibility";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../_metronic/_helpers";
import * as actions from "./_redux/AnprManagerAction";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import AddEditAnprDetails from "./AddEditAnprDetails";
import ExcelModal from "./ExcelModal";
import {ViewAnprDetailsModal} from "./ViewAnprDetailsModal";
import FetchViolationModal from "../../../../utils/dateRangePicker/FetchViolationModal";
import * as action from "../Locations/_redux/LocationAction";
import {Button} from "react-bootstrap";

export function AnprManager() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterEntities, setFilterEntities] = useState([]);
    const [modelShow, setModalShow] = useState(false);
    const [excelModalShow, setExcelModalShow] = useState(false);
    const [editModalData, setEditModalData] = useState(null);
    const [viewModalShow, setViewModalShow] = useState(false);
    const [rowDriverImage, setRowDriverImage] = useState(null);
    const [showBarTable, setShowBarTable] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const {getAllVehicleDetails , popupData ,user} = useSelector(
        (state) => ({
            getAllVehicleDetails: state.anprManager.getAllVehicleDetails,
            popupData: state.location?.popupData,
            user: state.auth.user
        }),
        shallowEqual
    );


    const handleCloseModal = () =>{
        dispatch(action.clearPopupDataAction())
        setShowBarTable(false)
    }

    // Filter whenever data or search term changes
    useEffect(() => {
        let filtered = getAllVehicleDetails;
        if (searchTerm.trim()) {
            const term = searchTerm.replace(/\s+/g, '').toLowerCase(); // remove spaces
            filtered = filtered.filter(item => {
                const plate = (item.number_plate || '').replace(/\s+/g, '').toLowerCase();
                const owner = (item.owner_name || '').replace(/\s+/g, '').toLowerCase();
                const type = (item.vehicle_type || '').replace(/\s+/g, '').toLowerCase();
                return plate.includes(term) || owner.includes(term) || type.includes(term);
            });
        }
        setFilterEntities(filtered);
    }, [getAllVehicleDetails, searchTerm]);



    useEffect(() => {
        dispatch(actions.getAllVehicleDetail());
    }, []);


    useEffect(() => {
        if (getAllVehicleDetails.length > 0) {
            setFilterEntities(getAllVehicleDetails)
        }
    }, [getAllVehicleDetails]);

    const onClickViewImage = (row) => {
        setViewModalShow(true);
        setRowDriverImage(row);
    };

    const openEditAnpr = (row) => {
        setEditModalData(row);
        setModalShow(true);
    };

    const columns = [
        {
            dataField: "#",
            label: "Index",
            formatter: (cell, row, rowIndex) => {
                return <span>{page * rowsPerPage + (rowIndex + 1)}</span>;
            },
        },
        {
            dataField: "vahicle_num",
            label: "Vehicle Number",
            style: {minWidth: "180px"},
            formatter: (_, row) => {
                return <span>{row?.number_plate}</span>;
            },
        }, {
            dataField: "owner_name",
            label: "Owner Name",
            style: {minWidth: "180px"},
            formatter: (_, row) => {
                return <span>{row?.owner_name}</span>;
            },
        },
        {
            dataField: "vahicle_type",
            label: "Vehicle Type",
            style: {minWidth: "180px"},
            formatter: (_, row) => {
                return <span>{row?.vehicle_type}</span>;
            },
        },
        {
            dataField: "created_date",
            label: "Created Date",
            style: {minWidth: "180px"},
            formatter: (_, row) =>
                moment.utc(row?.created_date).local().format("DD MMMM YYYY, HH:mm:ss"),
        },
        {
            dataField: "status",
            label: "Status",
            style: { minWidth: "180px" },
            formatter: (_, row) => {
                return (
                    <>
                        {user?.user_email !== 'user.mpl@tusker.ai' ? (
                            <Switch
                                checked={row?.status}
                                onChange={() => handleStatusChange(row)}
                                color="primary"
                            />
                        ) : (
                            // Optionally display status as text if user is restricted
                            <span>{row?.status ? "Active" : "Inactive"}</span>
                        )}
                    </>
                );
            },
        },
        {
            dataField: "driving_license",
            label: "Driving License",
            style: { minWidth: "180px" },
            formatter: (_, row) => {
                return (
                    <div style={{ display: "flex", justifyContent: "start", alignItems: "start" }}>
                        <VisibilityIcon
                            color="action"
                            style={{ fontSize: "2rem", color: "#147b82", cursor: "pointer" }}
                            onClick={() => onClickViewImage(row)}
                        />
                        {user?.user_email !== 'user.mpl@tusker.ai' && (
                            <SVG
                                title="Edit Location Details"
                                src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
                                onClick={() => openEditAnpr(row)}
                                style={{ cursor: "pointer", marginLeft: "10px" }}
                            />
                        )}
                    </div>
                );
            },
        }

    ];

    const handleStatusChange = (row) => {
        dispatch(actions.updateVehicleDetailsStatuses(row?.id, !row?.status))
            .then((response) => {
                if(response.isSuccess) {
                    dispatch(actions.getAllVehicleDetail());
                }
            })
            .catch((error) => {
                console.error("Error updating vehicle status:", error);
            });
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const anprDetailsClose = () => {
        setModalShow(false);
        setEditModalData(null);
    };

    const excelModalClose = () => {
        setExcelModalShow(false);
        dispatch(actions.getAllVehicleDetail());
    };

    const saveAnprDetails = (data, id) => {
        if (id) {
            dispatch(actions.updateVehicleDetail(data, id)).then(() => {
                anprDetailsClose();
                dispatch(actions.getAllVehicleDetail());
            });
        } else {
            dispatch(actions.addVehicleDetail(data)).then(() => {
                anprDetailsClose();
                dispatch(actions.getAllVehicleDetail());
            });
        }
    };




    return (
        <>
            <Card
                className="example example-compact"
                style={{minHeight: "150px", overflow: "visible"}}
            >

                <CardBody style={{padding: "10px 10px"}}>
                    <Row>
                    <Col xl={8} xs={12} md={7}>
                        <CardHeader title="Vehicle Details" />
                    </Col>
                    <Col xl={4} xs={12} md={5}>
                        <div className="d-flex align-items-center justify-content-end" style={{ gap: '8px' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="form-control"
                                style={{ maxWidth: '200px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {user?.user_email !== 'user.mpl@tusker.ai' && (
                                <>
                                    <Button
                                        variant="primary"
                                        onClick={() => setExcelModalShow(true)}
                                    >
                                        Add Excel
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => setModalShow(true)}
                                    >
                                        Add Vehicle
                                    </Button>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>

                <hr/>
                    <Row>
                        <Col xl={12} xs={12} md={12}>
                            <BlockUi tag="div" blocking={false} color="#147b82">
                                <TableContainer>
                                    <Table stickyHeader aria-label="sticky table">
                                        {filterEntities.length > 0 &&
                                        <TableHead>
                                            <TableRow>
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={{minWidth: column.minWidth}}
                                                    >
                                                        {column.label}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>}
                                        {filterEntities.length > 0 ?
                                            <TableBody>
                                                {filterEntities
                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                    .map((row, rowIndex) => {
                                                        return (
                                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                                {columns.map((column) => {
                                                                    const value = row[column.id];
                                                                    return (
                                                                        <TableCell key={column.id} align={column.align}>
                                                                            {column.formatter
                                                                                ? column.formatter(value, row, rowIndex)
                                                                                : column.format && typeof value === "number"
                                                                                    ? column.format(value)
                                                                                    : value}
                                                                        </TableCell>
                                                                    );
                                                                })}
                                                            </TableRow>
                                                        );
                                                    })}
                                            </TableBody>
                                            :
                                            <TableBody>
                                                <TableRow
                                                className="d-flex justify-content-center font-weight-bold h3"
                                                > No data Found </TableRow>

                                            </TableBody>

                                        }

                                    </Table>
                                </TableContainer>
                                {filterEntities.length > 0 &&
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 100]}
                                    component="div"
                                    count={filterEntities.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />}
                            </BlockUi>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <AddEditAnprDetails
                show={modelShow}
                anprDetailsClose={anprDetailsClose}
                saveAnprDetails={saveAnprDetails}
                editModalData={editModalData}
            />
            <ViewAnprDetailsModal
                viewModalShow={viewModalShow}
                anprViewsClose={() => setViewModalShow(false)}
                rowDriverImage={rowDriverImage}
            />

            <ExcelModal
                show={excelModalShow}
                closeModal={excelModalClose}
            />

            {showBarTable &&
            <FetchViolationModal
                showBarTableData={showBarTable}
                tableDatas={popupData}
                handleCloseModal={handleCloseModal}
            />}


        </>
    );
}
