import React, {useEffect, useState} from 'react';
import {CardBody, Col, Row} from "reactstrap";
import {Button, Form} from "react-bootstrap";
import CardHeader from "@material-ui/core/CardHeader";
import Select from "react-select";
import Creatable from 'react-select/creatable';
import FormDateRangePicker from "../../../../../utils/dateRangePicker/FormDateRangePicker";
import moment from "moment/moment";
import {getCurrentEndDate, getCurrentStartDate} from "../../../../../utils/TimeZone";
import getSelectedDateTimeDefaultValue from "../../../../../utils/dateRangePicker/dateFunctions";
import getSelectedDateTimeDefaultValueForRange from "../../../../../utils/dateRangePicker/dateRangeFunctions";
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../../../../_metronic/_helpers";
import {Card} from "@material-ui/core";
import '../../../../../scss/components/logo.scss'
import '../../../../../scss/components/image-gallery.css'
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import {successToast, warningToast} from "../../../../../utils/ToastMessage";
import {
    getAllLogoModel,
    getFilterVideoResult,
    getVideoResultByVideoId,
    updateVideoDetectionDetail,
    updateVideoStatus
} from "../_redux/logo-result-api";

import {ImageHorizontalView} from "./ImageHorizontalView";
import {modelStatusOptions} from "../../../../../enums/region.enums";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';


function LogoResults() {
    const [selectedIndex, setSelectedIndex] = useState(12);
    const [startDate, setStartDate] = useState(moment.utc(getCurrentStartDate()).format());
    const [endDate, setEndDate] = useState(moment.utc(getCurrentEndDate()).format());
    const [minDate, setMinDate] = useState("");
    const [maxDate, setMaxDate] = useState("");
    const [editName, setEditName] = useState(false);
    const [editData, setEditData] = useState(false);

    const dateTimeRangeChangeHandler = (startDate, endDate) => {
        setStartDate(moment.utc(startDate).format());
        setEndDate(moment.utc(endDate).format());
    };
    const [viewData, setViewData] = useState("pic")
    const [modelListOptionLoader, setModelListOptionLoader] = useState(false);
    const [modelListOption, setModelListOption] = useState([]);
    const [modalValue, setModalValue] = useState([]);

    const [modalStatusValue, setModalStatusValue] = useState([]);

    const [uniqueIdListOptionLoader, setUniqueIdListOptionLoader] = useState(false);
    const [uniqueIdListOption, setUniqueIdListOption] = useState([]);
    const [uniqueIdValue, setUniqueIdValue] = useState([]);

    const [videoResultByVideoIdLoader, setVideoResultByVideoIdLoader] = useState(false);
    const [videoResultModalStatus, setVideoResultModalStatus] = useState([]);
    const [brandName, setBrandName] = useState([""]);
    const [brandImage, setBrandImage] = useState([]);
    const [brandImagePic, setBrandImagePic] = useState([]);
    const [detectionBrand, setDetectionBrand] = useState([]);
    const [isShownDetectionBrand, setIsShownDetectionBrand] = useState(false);


    useEffect(() => {
        getAllLogoModels()
    }, []);

    const dateTimeRangeIndexChangeHandler = (rangeIndex, value) => {
        let dateVal = getSelectedDateTimeDefaultValue(value);
        let index = getSelectedDateTimeDefaultValueForRange(parseInt(dateVal, 10));
        let min = startDate;
        let max = endDate;
        let minDateNew = minDate;
        let maxDateNew = maxDate;
        if (parseInt(dateVal) === 12) {
            min = parseInt("defaultMin", 0);
            max = parseInt("defaultMax", 0);

            minDateNew = ["min"];
            maxDateNew = ["max"];
        }

        setSelectedIndex(index);
        setStartDate(min);
        setEndDate(max);
        setMinDate(minDateNew);
        setMaxDate(maxDateNew);
    };

    const handleEditBrandName = () => {
        setEditName(true);
    }
    const handleEditeDate = () => {
        setEditData(true);
    }

    const handleViewChange = (view) => {
        setViewData(view)
    }

    const getAllLogoModels = () => {
        setModelListOptionLoader(true)
        getAllLogoModel()
            .then(response => {
                if (response && response.isSuccess) {
                    const ModalOptions = response.data.map(c => ({
                        label: c.model_name, value: c.model_id
                    }));
                    setModelListOption(ModalOptions)
                    setModelListOptionLoader(false)
                }
            })
            .catch(error => {
                console.log("error>>> ", error)
                setModelListOptionLoader(false)
                warningToast(error.detail);
            });
    }


    const handleModalChange = (model) => {
        setModalValue(model)

    }

    const handleModelStatusChange = (status) => {
        setModalStatusValue(status)
    }
    const handleResultModelStatusChange = (status) => {
        setVideoResultModalStatus(status)
    }

    const applyFilter = () => {
        setEditData(false)
        setEditName(false)
        setUniqueIdListOption([])
        setUniqueIdValue([])
        setVideoResultModalStatus([])
        setBrandName([""])
        setBrandImage([])
        setTimeout(() => {
            applyApiCall()
        }, 1000);

    }

    const applyApiCall = () => {
        let modelIdList = []
        modalValue && modalValue.map(x => {
            modelIdList.push(x?.value)
        })
        if (modelIdList || startDate || endDate || modalStatusValue) {
            let data = {
                model_id: modelIdList,
                start_date: startDate,
                end_date: endDate,
                video_status: modalStatusValue && modalStatusValue?.value
            }
            getFilterVideoResults(data)
        }
    }


    const getFilterVideoResults = (data) => {
        setUniqueIdListOptionLoader(true)
        getFilterVideoResult(data)
            .then(response => {
                if (response && response.isSuccess) {
                    const UniqueIdOptions = response.data.map(c => ({
                        label: c.id, value: c.id
                    }));
                    setUniqueIdListOption(UniqueIdOptions)
                    setUniqueIdListOptionLoader(false)
                    successToast("Video results get successfully");
                }
            })
            .catch(error => {
                console.log("error>>>", error)
                setUniqueIdListOptionLoader(false)
                warningToast(error.detail);
            });
    }

    const handleUniqueIdChange = (uniqueId) => {
        setUniqueIdValue(uniqueId)
        if (uniqueId) {
            setBrandImage([])
            setVideoResultModalStatus([])
            setBrandName([])
            setEditData(false)
            setEditName(false)
            getVideoResultByVideoIds(uniqueId?.value)
        }
    }


    const slideLeft = (event, index) => {
        Object.keys(brandImage).map(id => {
            if (event === Number(id)) {
                setDetectionBrand(brandImage[id].detection.join(","))
            }
        })

    }
    const getVideoResultByVideoIds = (data) => {
        setVideoResultByVideoIdLoader(true)
        getVideoResultByVideoId(data)
            .then(response => {
                if (response && response.isSuccess) {
                    setVideoResultByVideoIdLoader(false)
                    setBrandImage(response?.data?.image_data)
                    const imagesAll = response.data.image_data.map(imageData => {
                        return {
                            original: imageData?.image_url,
                            thumbnail: imageData?.image_url,
                        }
                    })
                    setDetectionBrand(response.data?.image_data[0]?.detection?.join(","))
                    setBrandImagePic(imagesAll)
                    setBrandName(response?.data?.video_data?.results?.detection_details?.brand_names.join(","))
                    modelStatusOptions.map((x) => {
                        if (response?.data?.video_data?.video_status === x.value) {
                            setVideoResultModalStatus(x)
                        }
                    })
                }
            })
            .catch(error => {
                console.log("error>>>", error)
                setVideoResultByVideoIdLoader(false)
                warningToast("Something went wrong");
            });
    }


    const updateVideoStatusChange = () => {
        const data = {
            video_id: uniqueIdValue?.value,
            video_status: videoResultModalStatus?.value,
        }
        updateVideoStatus(data)
            .then(response => {
                if (response && response.isSuccess) {
                    setEditData(false);
                    successToast("Modal Status updated successfully");

                }
            })
            .catch(e => {
                console.log("error", e)
                warningToast("Something went wrong");
            });
    }


    const updateVideoDetectionDetails = () => {
        const data = {
            video_id: uniqueIdValue?.value,
            video_result: brandName.split(',')
        }

        updateVideoDetectionDetail(data)
            .then(response => {
                if (response && response.isSuccess) {
                    successToast("Brand Name updated successfully");
                    setEditName(false)
                    if (uniqueIdValue) {
                        getVideoResultByVideoIds(uniqueIdValue?.value)
                    }
                }
            })
            .catch(error => {
                console.log("error>>>", error)
                warningToast("Something went wrong");
            });
    }
    const getGridItemActive = () => {
        return viewData === "grid" ? "image-item-icon active " : "";
    };
    const getHorizontalItemActive = () => {
        return viewData === "horizontal" ? "image-item-icon active" : "";
    };
    const getPicItemActive = () => {
        return viewData === "pic" ? "image-item-icon active" : "";
    };

    const changeBrandName = (e) => {
        setBrandName(e.target.value)
    }
    const toggleDetectionBrand = () => {
        setIsShownDetectionBrand(isShownDetectionBrand ? false : true);
    };


    return (<>
        <>
            <Card
                className="example example-compact"
                style={{minHeight: "150px", overflow: "visible", marginBottom: "25px"}}
            >
                <CardBody style={{padding: "10px 10px"}}>
                    <Row>
                        <Col xl={8} lg={8} xs={12} md={7} sm={12}>
                            <CardHeader title="Logo Result"/>
                        </Col>
                    </Row>

                    <Row className="space">
                        <Col xl={3} xs={12} md={6} sm={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-4">Select Model</Form.Label>
                                <Select
                                    theme={theme => ({
                                        ...theme, borderRadius: 0, cursor: "pointer", colors: {
                                            ...theme.colors, primary25: "#5DBFC4", primary: "#147b82"
                                        }
                                    })}
                                    isLoading={modelListOptionLoader}
                                    isSearchable={true}
                                    isMulti={true}
                                    placeholder="Select Model"
                                    className="select-react-dropdown"
                                    value={modalValue}
                                    onChange={handleModalChange}
                                    options={modelListOption}
                                />
                            </Form.Group>
                        </Col>

                        <Col xl={3} xs={12} md={6} sm={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-4">Select Model Status</Form.Label>
                                <Select
                                    theme={theme => ({
                                        ...theme, borderRadius: 0, cursor: "pointer", colors: {
                                            ...theme.colors, primary25: "#5DBFC4", primary: "#147b82"
                                        }
                                    })}
                                    isLoading={false}
                                    isSearchable={true}
                                    isMulti={false}
                                    placeholder="Select Model Status"
                                    className="select-react-dropdown"
                                    value={modalStatusValue}
                                    onChange={handleModelStatusChange}
                                    options={modelStatusOptions}
                                />
                            </Form.Group>
                        </Col>

                        <Col xl={4} xs={12} md={6} sm={12}>
                            <Form.Group className="mb-3">
                                <Form.Label className="mb-4">Select Date Range</Form.Label>
                                <FormDateRangePicker
                                    rangeIndex={selectedIndex}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    startDate={startDate}
                                    endDate={endDate}
                                    changeDateTimeRange={dateTimeRangeChangeHandler}
                                    changeDateTimeRangeIndex={dateTimeRangeIndexChangeHandler}
                                />
                            </Form.Group>
                        </Col>
                        <Col xl={2} xs={12} md={12} sm={12}>
                            <div className={"d-flex mt-4 "}>
                                <Button
                                    className={"mt-5"}
                                    onClick={applyFilter}
                                >
                                    Apply Filter
                                </Button>
                            </div>
                        </Col>
                    </Row>


                </CardBody>
            </Card>


            <div className={'flex-row-fluid '}>
                <div className="card card-custom card-stretch">
                    <CardBody>

                        <div className={"d-flex justify-content-end"}>
                            <Col xl={3} xs={12} md={6} sm={12}>
                                <Form.Group className="mb-3">
                                    <Creatable
                                        theme={theme => ({
                                            ...theme, borderRadius: 0, cursor: "pointer", colors: {
                                                ...theme.colors, primary25: "#5DBFC4", primary: "#147b82"
                                            }
                                        })}
                                        isLoading={uniqueIdListOptionLoader}
                                        isSearchable={true}
                                        isMulti={false}
                                        placeholder="Select Unique Id"
                                        className="select-react-dropdown"
                                        value={uniqueIdValue}
                                        onChange={handleUniqueIdChange}
                                        options={uniqueIdListOption}
                                    />
                                </Form.Group>
                            </Col>
                        </div>


                        {brandImage && brandImage.length > 0 ? (
                            <BlockUi tag="div" blocking={videoResultByVideoIdLoader} color="#014f9f">
                                <div className={"row mt-4"}>
                                    <div className={"col-9"}>
                                        <div className={'pb-1'}>
                                            <ul className={"d-flex justify-content-end"} style={{listStyle: "none"}}>
                                                <li
                                                    className={`menu-item menu-item-rel ${getGridItemActive("grid")}`}
                                                >

                                                     <span
                                                         className={`svg-icon  cursor-pointer float-right vertical_line 
                                                    ${getGridItemActive("grid") ? 'svg-icon-light' : 'svg-icon-primary'} `}
                                                         onClick={() => handleViewChange("grid")}>
                                                <SVG title={"Grid View"}
                                                     src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-grid.svg")}/>
                                            </span>
                                                </li>
                                                <li
                                                    className={`menu-item menu-item-rel ${getHorizontalItemActive("horizontal")}`}
                                                >
                                                    <span
                                                        className={`svg-icon  cursor-pointer float-right vertical_line 
                                                    ${getHorizontalItemActive("horizontal") ? 'svg-icon-light' : 'svg-icon-primary'} `}
                                                        onClick={() => handleViewChange('horizontal')}>
                                                <SVG title={"Horizontal View"}
                                                     src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-horizontal.svg")}/>
                                            </span>
                                                </li>

                                                <li
                                                    className={`menu-item menu-item-rel ${getPicItemActive("pic")}`}
                                                >
                                                <span
                                                    className={`svg-icon  cursor-pointer float-right vertical_line
                                                    ${getPicItemActive("pic") ? 'svg-icon-light' : 'svg-icon-primary'} `}
                                                    onClick={() => handleViewChange("pic")}>
                                                <SVG title={"Pic View"}
                                                     src={toAbsoluteUrl("/media/svg/icons/Layout/Layout-top-panel-1.svg")}/>
                                                </span>
                                                </li>

                                            </ul>
                                            {viewData === 'grid' ?
                                                <div className={"image-card"}>
                                                    <div id="grid" className="grid-container m-5">
                                                        {brandImage.map((x, i) =>
                                                            <div id="image1" className="griditem image1">
                                                                <img src={x.image_url}
                                                                     style={{height: "100%", width: "100%"}}/>
                                                            </div>)}
                                                    </div>
                                                </div> : viewData === 'horizontal' ? <>
                                                    <ImageHorizontalView
                                                        brandImage={brandImage}
                                                        uniqueIdValue={uniqueIdValue}
                                                        getVideoResultByVideoIds={getVideoResultByVideoIds}

                                                    />
                                                </> : viewData === 'pic' && <>
                                                    <BlockUi tag="div" blocking={videoResultByVideoIdLoader}
                                                             color="#014f9f">
                                                        <div className="custome-image-gallery image-gallery-wrapper">
                                                            <ImageGallery
                                                                onBeforeSlide={(event) => slideLeft(event)}
                                                                items={brandImagePic}/>
                                                        </div>
                                                    </BlockUi>

                                                </>}
                                        </div>

                                    </div>

                                    <div className={"col-3"}>
                                        <div
                                            className="vertical_line">
                                            <div>



                                                {viewData === 'pic' && (
                                                <div className={"d-flex justify-content-end"}>

                                                    {isShownDetectionBrand ? (
                                                        <span
                                                        className="svg-icon svg-icon-primary mb-3 cursor-pointer py-5 mr-1"
                                                        onClick={toggleDetectionBrand}>
                                                                <SVG src={toAbsoluteUrl("/media/svg/icons/General/show.svg")}/>
                                                         </span>) : (
                                                        <span
                                                            className="svg-icon svg-icon-primary mb-3 cursor-pointer py-5 mr-1" style={{fill:"#147b82"}}
                                                            onClick={toggleDetectionBrand}>
                                                            <SVG src={toAbsoluteUrl("/media/svg/icons/General/hide.svg")}/>
                                                         </span>)}
                                                </div>)}

                                                {viewData === 'pic' && (
                                                <Row>
                                                    <Col xl={12} xs={12} md={12} sm={12}>
                                                        <div className={"ml-3 mb-3"}>
                                                        {isShownDetectionBrand ?
                                                            (detectionBrand &&
                                                                <span >
                                                                    {detectionBrand}
                                                                </span>) : "-"}
                                                        </div>
                                                    </Col>
                                                </Row>)}



                                                <div className={"d-flex justify-content-end"}>
                                                    <span className="svg-icon svg-icon-primary mb-3 cursor-pointer"
                                                          onClick={handleEditeDate}
                                                    >
                                                          <SVG
                                                              title={"Edit Data"}
                                                              src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
                                                          />
                                                        </span>
                                                </div>


                                                <Row>
                                                    <Col xl={12} xs={12} md={12} sm={12}>
                                                        <Form.Group className="mb-3 ml-2">
                                                            <Select
                                                                theme={theme => ({
                                                                    ...theme,
                                                                    borderRadius: 0,
                                                                    cursor: "pointer",
                                                                    colors: {
                                                                        ...theme.colors,
                                                                        primary25: "#5DBFC4",
                                                                        primary: "#147b82"
                                                                    }
                                                                })}
                                                                isLoading={videoResultByVideoIdLoader}
                                                                isSearchable={true}
                                                                isMulti={false}
                                                                isDisabled={!editData}
                                                                placeholder="Select Model Status"
                                                                className="select-react-dropdown"
                                                                value={videoResultModalStatus}
                                                                onChange={handleResultModelStatusChange}
                                                                options={modelStatusOptions}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xl={12} xs={12} md={12} sm={12}
                                                         className={'d-flex justify-content-end'}>
                                                        <Button
                                                            onClick={updateVideoStatusChange}
                                                        >
                                                            Change Status
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className={'mt-5'}>
                                                <div className={"d-flex justify-content-end"}>
                                                <span className="svg-icon svg-icon-primary mb-3 cursor-pointer"
                                                      onClick={handleEditBrandName}>
                                                    <SVG
                                                        title={"Edit Data"}
                                                        src={toAbsoluteUrl("/media/svg/icons/Communication/Write.svg")}
                                                    />
                                                </span>
                                                </div>
                                                <Row className="navi-item ">
                                                    <Col xl={12} xs={12} md={12} sm={12}>
                                                        {editName ? (
                                                            <textarea
                                                                type="text"
                                                                className={"mb-3 ml-2  form-control form-control-solid"}
                                                                placeholder="Brand name"
                                                                maxLength="250"
                                                                name="brandname"
                                                                value={brandName}
                                                                onChange={e => changeBrandName(e)}

                                                            />
                                                        ) : (
                                                            <div className={"ml-2"}>
                                                                {brandName && brandName.length > 0 ?
                                                                    <BlockUi tag="div"
                                                                             blocking={videoResultByVideoIdLoader}
                                                                             color="#014f9f">
                                                                    <span>
                                                                        {brandName}
                                                                    </span>
                                                                    </BlockUi>
                                                                    : "-"}
                                                            </div>
                                                        )}

                                                    </Col>
                                                    <Col xl={12} xs={12} md={12} sm={12}
                                                         className={'d-flex justify-content-end'}>
                                                        <Button
                                                            onClick={updateVideoDetectionDetails}
                                                        >
                                                            Add Brand
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </BlockUi>
                        ) : (
                            <h3 className="text-center">
                                No Data Found
                            </h3>
                        )}


                    </CardBody>

                </div>
            </div>


        </>
    </>);
}

export default LogoResults;