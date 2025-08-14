import React, { useEffect, useMemo, useState } from "react";
import paginationFactory, {
    PaginationProvider
} from "react-bootstrap-table2-paginator";
import {useHorizontalManagementUIContext} from "./HorizontalUIContext";
import {
    entityFilter,
    getFilteredAndPaginatedEntities,
    getPaginationOptions,
    headerSortingClasses,
} from "../../../../../_metronic/_helpers";
import {Pagination} from "../../../../../_metronic/_partials/controls";
import {ImageTable} from "./ImageTable";

export function ImageHorizontalView({brandImage ,getVideoResultByVideoIds , uniqueIdValue}) {
    const horizontalManagementUIContext = useHorizontalManagementUIContext();
    const horizontalManagementUIProps = useMemo(() => horizontalManagementUIContext, [
        horizontalManagementUIContext
    ]);

    const columns = [
        {

            dataField: "idx",
            text: "Index",
            style: {
                minWidth: "55px"
            }
        },

        {
            dataField: "user_pic",
            text: "Photo",
            style: {
                minWidth: "250px"
            },
            sort: true,
            formatter: (col, row) =>
                <>
                    <img src={row.image_url.image_url} style={{height: "20%", width: "20%"}}/>
                </>
        },
    ];


    // const {  } = brandImage;
    const [filterEntities, setFilterEntities] = useState(brandImage);
    let currentItems = getFilteredAndPaginatedEntities(
        filterEntities || brandImage,
        horizontalManagementUIProps.queryParams
    );

    const filterDataset = e => {
        const searchStr = e?.target?.value ;
        const keys = [
                "user_pic",
            "time"
        ];
        currentItems = entityFilter(
            brandImage || filterEntities,
            searchStr,
            keys,
            horizontalManagementUIProps.queryParams,
            setFilterEntities
        );
    };

    useEffect(() => {
        getVideoResultByVideoIds(uniqueIdValue?.value)
    }, [horizontalManagementUIProps.queryParams]);



    useEffect(() => {
        filterDataset();
    }, [brandImage]);


    return (
        <>
            <PaginationProvider
                pagination={paginationFactory(
                    getPaginationOptions(
                        brandImage?.length,
                        horizontalManagementUIProps.queryParams
                    )
                )}
            >
                {({ paginationProps, paginationTableProps }) => {
                    return (
                        <Pagination
                            paginationProps={paginationProps}
                        >
                            <ImageTable
                                columns={columns}
                                items={currentItems}
                                tableChangeHandler={horizontalManagementUIProps.setQueryParams}
                                paginationTableProps={paginationTableProps}
                            />
                        </Pagination>
                    );
                }}
            </PaginationProvider>
        </>
    );
}
