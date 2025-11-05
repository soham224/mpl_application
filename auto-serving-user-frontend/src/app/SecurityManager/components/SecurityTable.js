import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FetchViolationModal from "../../../utils/dateRangePicker/FetchViolationModal";
import AnprResult from "./anprResult";
import * as action from "../../Admin/modules/Locations/_redux/LocationAction";
import { shallowEqual } from "react-redux";
import { Spinner } from 'react-bootstrap';
import ResultPage from "./ResultPage";

function SecurityTable(props) {
    const dispatch = useDispatch();
    const [showBarTable, setShowBarTable] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { popupData = [] } = useSelector(
        ({ auth, location }) => ({
            popupData: location?.popupData || [],
        }),
        shallowEqual
    );

    useEffect(() => {
        setShowBarTable(false)
        if(popupData.length > 0){
            setShowBarTable(true)
        }
    }, [popupData]);

    const handleCloseModal = () =>{
        dispatch(action.clearPopupDataAction())
        setShowBarTable(false)
    }
    return (
        <>
            <ResultPage />
            <div className={'mb-5 mt-5'} />
            <AnprResult />

            {showBarTable && (
                <FetchViolationModal
                    showBarTableData={showBarTable}
                    tableDatas={popupData}
                    handleCloseModal={handleCloseModal}
                />
            )}
        </>
    );
}

export default SecurityTable;