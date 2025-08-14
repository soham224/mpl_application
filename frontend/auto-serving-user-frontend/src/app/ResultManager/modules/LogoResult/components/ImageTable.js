import BootstrapTable from "react-bootstrap-table-next";
import React from "react";
import {getHandlerTableChange, NoRecordsFoundMessage, PleaseWaitMessage} from "../../../../../_metronic/_helpers";
import * as uiHelpers from "../../../../../utils/UIHelpers";

export const ImageTable = ({
                                     items,
                                     columns,
                                     tableChangeHandler,
                                     paginationTableProps,
                                     selectRow,
                                 }) => {
    const { page, sizePerPage } = paginationTableProps?.pagination?.options;
    const idxStart = (page - 1) * sizePerPage + 1;
    return (
        <>
            <div  className={"image-card"}>


            <BootstrapTable
                wrapperClasses="table-responsive"
                bordered={false}
                classes="table employeeTable table-head-custom table-vertical-center table-horizontal-center overflow-hidden"
                bootstrap4
                remote
                keyField="id"
                data={items?.map((i, idx) => (
                    { image_url: i, idx: idxStart + idx }
                )) || []}
                columns={columns}
                defaultSorted={uiHelpers.defaultSorted}
                onTableChange={getHandlerTableChange(tableChangeHandler)}
                hideSelectColumn
                {...paginationTableProps}
                selectRow={selectRow}
            >
                <PleaseWaitMessage entities={items} />
                <NoRecordsFoundMessage entities={items} />
            </BootstrapTable>
            </div>
        </>
    );
};
