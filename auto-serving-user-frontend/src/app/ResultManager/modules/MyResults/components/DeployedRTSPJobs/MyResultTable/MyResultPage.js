import {Route} from "react-router-dom";
import React from "react";
import {MyResultUIProvider} from "./MyResultUIContext";
import {MyResultCard} from "./MyResultCard"
import {MyResultViewDialog} from "./my-result-view-dialog/MyResultViewDialog";
import {ResultStatusDialog} from "./result-status-dialog/ResultStatusDialog";

export function MyResultPage({history}) {

    const myResultPageBaseUrl = '/my-results';


    const myResultUIEvents = {
        openViewMyResultBtnClick: (id) => {
            history.push(`${myResultPageBaseUrl}/${id}/view`);
        },
        openChangeStatusBtnClick: (id, status) => {
            history.push(`${myResultPageBaseUrl}/${id}/${status}/changeStatus`);
        },
        openCardsClick: (data) => {
            history.push(`${myResultPageBaseUrl}/${data}/cards`);
        }
    };

    return (
        <MyResultUIProvider myResultUIEvents={myResultUIEvents}>
            <Route exact path={`${myResultPageBaseUrl}/:id/view`}>
                {({history, match}) => (
                    <MyResultViewDialog
                        show={match != null}
                        id={match?.params.id}
                        onHide={() => {
                            history.push(myResultPageBaseUrl);
                        }}
                    />
                )}
            </Route>
            <Route exact path={`${myResultPageBaseUrl}/:id/:status/changeStatus`}>
                {({history, match}) => (
                    <>
                        <ResultStatusDialog
                            show={match != null}
                            id={match?.params?.id}
                            status={match?.params?.status}
                            onHide={() => {
                                history.push(myResultPageBaseUrl);
                            }}
                        />
                    </>
                )}
            </Route>
            <Route exact path={`${myResultPageBaseUrl}`}>
                <MyResultCard/>
            </Route>
        </MyResultUIProvider>
    );
}
