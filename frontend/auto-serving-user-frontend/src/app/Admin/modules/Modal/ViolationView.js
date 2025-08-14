import React, {Component, Fragment} from 'react';
import {Button, Modal} from "react-bootstrap";
import * as moment from "moment";

class violationView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: props.isOpen,
            data: props.data[0],
            userId: props.userId,
            createdDate: props.settings['created_date'],
            updatedDate: props.settings['updated_date'],
            start_time: props.settings['start_time'],
            end_time: props.settings['end_time'],
            isMailReceived: props.settings['isMailReceived'],
            label: props.settings['label']
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            show: nextProps.isOpen,
            data: nextProps.data[0],
            userId: nextProps.userId,
            createdDate: nextProps.settings['created_date'],
            updatedDate: nextProps.settings['updated_date'],
            start_time: nextProps.settings['start_time'],
            end_time: nextProps.settings['end_time'],
            isMailReceived: nextProps.settings['isMailReceived'],
            label: nextProps.settings['label']
        })
    }

    render() {
        const {show, label} = this.state;

        return (
            <Fragment>
                <Modal
                    size="lg"
                    show={show}
                    onHide={this.props.onHide}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">Violation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        {/*<div className="row col-12 view-title">*/}
                        {/*    <span className="w-100 font-weight-bold">Labels</span>*/}
                        {/*</div>*/}
                        <div className="row col-12 view-title text-center">
                            <span className="w-100 font-weight-bold" style={{background: "#147b82", color: 'white', margin: '20px auto'}}>Violation Settings</span>
                        </div>

                        <div className="row mt-2 mb-2">
                            <div className="col col-md-6"><span><b>Labels</b></span></div>
                            <div className="col col-md-6" style={{overflowWrap: "break-word"}}>{label}</div>
                        </div>
                        <div className="row mt-2 mb-2">
                            <div className="col col-md-6"><span><b>Company ID</b></span></div>
                            <div className="col col-md-6">{this.state.userId}</div>
                        </div>
                        <div className="row mt-2 mb-2">
                            <div className="col col-md-6"><span><b>Created Date</b></span></div>
                            <div
                                className="col col-md-6">{moment.utc(this.state.createdDate).local().format("MMMM DD YYYY, h:mm:ss a")}</div>
                            {/*<div className="col col-md-6">{dateTimeFormatter(this.state.createdDate)}</div>*/}
                        </div>
                        <div className="row mt-2 mb-2">
                            <div className="col col-md-6"><span><b>Updated Date</b></span></div>
                            <div
                                className="col col-md-6">{moment.utc(this.state.updatedDate).local().format("MMMM DD YYYY, h:mm:ss a")}</div>
                        </div>
                        <div className="row mt-2 mb-2">
                            <div className="col col-md-6"><span><b>Start Time</b></span></div>
                            <div
                                className="col col-md-6">{moment.utc(this.state.start_time,'HH:mm').local().format("hh:mm A")}</div>
                        </div>
                        <div className="row mt-2 mb-2">
                            <div className="col col-md-6"><span><b>End Time</b></span></div>
                            <div
                                className="col col-md-6">{moment.utc(this.state.end_time,'HH:mm').local().format("hh:mm A")}</div>
                            {/*<div
                                className="col col-md-6">{this.state.end_time}</div>*/}
                        </div>
                        <div className="row mt-2 mb-2">
                            <div className="col col-md-6"><span><b>Is MailSubscribe</b></span></div>
                            <div
                                className="col col-md-6">{this.state.isMailReceived?"True":"False"}</div>
                        </div>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            type="button"
                            onClick={this.props.onHide}
                            className="btn btn-light btn-elevate"
                        >
                            Cancel
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Fragment>
        );
    }
}

export default violationView;
