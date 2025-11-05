import React, { useEffect, useState } from "react";


import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Row } from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import {getResultMetadataForResultManager, getResultsForResultManager} from "../../MyResults/_redux/MyResultApi";
import {warningToast} from "../../../../../utils/ToastMessage";
import {actions} from "../../../../Admin/modules/Auth";
// eslint-disable-next-line
let currentPage = 0;
let temp = false;
let store_data = [];
const useStyles = makeStyles({
    header: {
        paddingBottom: "0rem"
    },
    title: {
        display: "inline-flex",
        margin: "1rem 0"
    },
    search: {
        marginBottom: "10px"
    },
    card: {
        height: 370,
        marginTop: 54,
        marginBottom: 64
    }
});

export function LogoResultsTable({
                                  companyId,
                                  cameraId,
                                  selectedLabel,
                                  startDate,
                                  endDate,
                                  isHide,
                                  labelname,
                                  isDetection,
                                  isViewAll,
                                  isLocationSelected,
                                  allLabels,
                                  setApplyFlag,
                                  applyFlag,
                              }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [listLoading, setListLoading] = useState(false);
    const [selectedPage, setselectedPage] = useState(0);
    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState(false);
    const [lastPage, setLastPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const { currentState } = useSelector(
        state => ({ currentState: state.myResultSliceResultManager }),
        shallowEqual
    );
    function getResultMetadata(
        companyId,
        startDate,
        endDate,
        isHide,
        isDetection,
        isViewAll,
        cameraId,
        selectedLabel,
        isLocationSelected
    ) {
        setListLoading(true);
        if (startDate && endDate && cameraId.length > 0) {
            getResultMetadataForResultManager(
                companyId,
                startDate,
                endDate,
                isHide,
                isDetection,
                isViewAll,
                cameraId,
                selectedLabel,
                isLocationSelected
            )
                .then(response => {
                    if (response && response.isSuccess) {
                        setListLoading(false);
                        setLastPage(response.data.total_pages);
                        store_data = [];
                        setData(store_data);
                        getResults(1);
                    } else throw new Error();
                })
                .catch(error => {
                    setListLoading(false);
                    warningToast("Something went wrong !");
                });
        }
    }
    function getResults(pageNo) {
        setListLoading(true);
        temp = false;
        setHasMore(true);
        if (cameraId.length > 0) {
            getResultsForResultManager(
                pageNo,
                companyId,
                startDate,
                endDate,
                isHide,
                isDetection,
                isViewAll,
                cameraId,
                selectedLabel,
                isLocationSelected
            )
                .then(response => {
                    if (response && response.isSuccess) {
                        dispatch(actions.setMyResults(response.data));
                        currentPage = pageNo;
                        setListLoading(false);
                        if (response.data.length > 0) {
                            temp = true;
                            store_data.push(...response.data);
                            setData(store_data);
                            setDisplayData(temp);
                            setHasMore(false);
                        } else throw new Error();
                    }
                })
                .catch(error => {
                    setListLoading(false);
                });
        }
    }
    const fetchData = e => {
        setHasMore(true);
        getResults(currentPage + 1);
    };
    const changeUpdatedData = (i, setresult, labelCount) => {
        let newArr = data.map((item, index) => {
            if (index === i) {
                return { ...item, ["result"]: setresult, ["counts"]: labelCount };
            } else {
                return item;
            }
        });
        setData(newArr);
        store_data = newArr;
    };
    useEffect(() => {
        setData([]);
        if(applyFlag){
            setApplyFlag(false)
            getResultMetadata(
                companyId,
                startDate,
                endDate,
                isHide,
                isDetection,
                isViewAll,
                cameraId,
                selectedLabel,
                isLocationSelected
            );
        }

        //eslint-disable-next-line
    }, [applyFlag]);

    return (
        <>
            {data.length > 0 && displayData ? (
                <InfiniteScroll
                    dataLength={data?.length}
                    next={fetchData}
                    hasMore={true}
                    loader={null}
                >
                    <Row className="mb-2 mt-2">
                      soham
                        {/*{data?.map((x, index) => (*/}
                        {/*    <Col xl={6} md={6} sm={12} lg={6} className={classes.card}>*/}
                        {/*        <MyResultCardsUI*/}
                        {/*            data={x}*/}
                        {/*            dataIndex={index}*/}
                        {/*            changeUpdatedData={changeUpdatedData}*/}
                        {/*            labelname={labelname[parseInt(x.camera_id)]}*/}
                        {/*            allLabels={allLabels}*/}
                        {/*        />*/}
                        {/*    </Col>*/}
                        {/*))}*/}
                    </Row>
                </InfiniteScroll>
            ) : (
                <h3 align="center">No Data Found</h3>
            )}
        </>
    );
}
