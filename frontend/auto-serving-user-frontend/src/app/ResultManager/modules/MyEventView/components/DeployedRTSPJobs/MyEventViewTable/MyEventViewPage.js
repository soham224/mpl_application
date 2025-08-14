import {Route} from "react-router-dom";
import React from "react";
import {MyResultUIProvider} from "./MyEventViewUIContext";
import {MyEventViewCard} from "./MyEventViewCard"
import {MyEventViewDialog} from "./my-event-view-dialog/MyEventViewDialog";
import {EventViewStatusDialog} from "./event-view-status-dialog/EventViewStatusDialog";

export function MyEventViewPage({history}) {

    const myEventViewPageBaseUrl = '/eventsList';


    const myEventViewUIEvents = {
        openViewMyResultBtnClick: (id) => {
            history.push(`${myEventViewPageBaseUrl}/${id}/view`);
        },
        openChangeStatusBtnClick: (id, status) => {
            history.push(`${myEventViewPageBaseUrl}/${id}/${status}/changeStatus`);
        },
        openCardsClick: (data) => {
            history.push(`${myEventViewPageBaseUrl}/${data}/cards`);
        }
    };

    return (
        <MyResultUIProvider myResultUIEvents={myEventViewUIEvents}>
            <Route exact path={`${myEventViewPageBaseUrl}/:id/view`}>
                {({history, match}) => (
                    <MyEventViewDialog
                        show={match != null}
                        id={match?.params.id}
                        onHide={() => {
                            history.push(myEventViewPageBaseUrl);
                        }}
                    />
                )}
            </Route>
            <Route exact path={`${myEventViewPageBaseUrl}/:id/:status/changeStatus`}>
                {({history, match}) => (
                    <>
                        <EventViewStatusDialog
                            show={match != null}
                            id={match?.params?.id}
                            status={match?.params?.status}
                            onHide={() => {
                                history.push(myEventViewPageBaseUrl);
                            }}
                        />
                    </>
                )}
            </Route>
            <Route exact path={`${myEventViewPageBaseUrl}`}>
                <MyEventViewCard/>
            </Route>
        </MyResultUIProvider>
    );
}
