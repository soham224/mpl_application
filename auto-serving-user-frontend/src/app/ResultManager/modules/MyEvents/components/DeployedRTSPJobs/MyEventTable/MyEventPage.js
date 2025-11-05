import {Route} from "react-router-dom";
import React from "react";

import {MyEventUIProvider} from "./MyEventUIContext"
import {MyEventCard} from "./MyEventCard"

export function MyEventPage({history}) {
    const myEventPageBaseUrl = '/events';

    const myEventUIEvents = {
        openChangeStatusBtnClick: (id, status) => {
            history.push(`${myEventPageBaseUrl}/${id}/${status}/changeStatus`);
        },
        openCardsClick: (data) => {
            history.push(`${myEventPageBaseUrl}/${data}/cards`);
        }
    };


    return(

        <MyEventUIProvider myEventUIEvents={myEventUIEvents}>
            <Route exact path={`${myEventPageBaseUrl}`}>
                <MyEventCard/>
            </Route>
        </MyEventUIProvider>
    )
}