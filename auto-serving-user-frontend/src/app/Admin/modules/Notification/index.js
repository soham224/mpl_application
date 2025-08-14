import React  from "react";
import {Card, CardBody} from "../../../../_metronic/_partials/controls";
import Notification from "./components/Notification";
import {connect} from "react-redux";
import * as auth from "../Auth";
import BlockUi from "react-block-ui";
import 'react-block-ui/style.css';

class NotificationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationObj: [],
            isAPICalled: false,
            blocking: false
        }
    }
    componentDidMount() {
        const {user} = this.props;
        let userRole = user.roles[0].role;
        this.setState({
            userRole:userRole
        })
        // this.getAllnotification();
    }

    // getAllnotification = () => {
    //
    //     let notificationObject = [];
    //     this.setState({
    //         isAPICalled: false,
    //         blocking: true
    //     })
    //     getAllNotificationByType().then(response => {
    //
    //         if (response && response.isSuccess) {
    //             let notificationData = response.data;
    //             Object.keys(notificationData).forEach(key => {
    //                 let obj = notificationData[key].toString().split(',');
    //                 let data = {notification_type:key,notification_message:obj}
    //                 notificationObject.push(data);
    //             })
    //             this.setState({
    //                 notificationObj  : notificationObject,
    //                 isAPICalled: true,
    //                 blocking: false
    //             })
    //         }
    //     }).catch(err => {
    //         this.setState({
    //             notificationObj  : notificationObject,
    //             isAPICalled: true,
    //             blocking: false
    //         })
    //     })
    //
    // }

    render() {
        return(
            <BlockUi tag="div" blocking={this.state.blocking} color="#147b82">
                <Card className="example example-compact">
                    {/*<CardHeader title={"Deployment Details"}/>*/}
                    <CardBody style={{minHeight:'100px'}}>
                        {/*{this.state.isAPICalled &&*/}
                        {/*    <>*/}
                        {/*        {this.state.notificationObj &&*/}
                        {/*          this.state.notificationObj.length > 0 ?*/}
                        {/*            this.state.notificationObj.map((obj, key) => (*/}
                        {/*                <Notification data={obj}/>*/}
                        {/*            ))*/}
                        {/*            :*/}
                        {/*            <>*/}
                        {/*                <h3 style={{textAlign:"center"}}>No Data Found</h3>*/}
                        {/*            </>*/}
                        {/*        }*/}
                        {/*    </>*/}
                        {/*}*/}
                        <Notification/>
                    </CardBody>
                </Card>
            </BlockUi>
        )
    }
}
function mapStateToProps(state) {
    const { auth } = state;
    return { user: auth.user}
}
export default connect(mapStateToProps, auth.actions)(NotificationPage);