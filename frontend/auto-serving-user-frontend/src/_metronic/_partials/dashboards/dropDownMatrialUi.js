import React, {Component} from 'react';
import {Select} from "@material-ui/core";

class DropDownMatrialUi extends Component {
    render() {
        return (
            <div>
                <Select
                    native
                    value={this.props.graphType}
                    onChange={(e) => this.props.handleGraphChange(e)}
                    inputProps={{
                        name: "age",
                        id: "age-native-simple",
                    }}
                    classNme={"mb-5"}
                >
                    <option value={"column"}>Bar</option>
                    <option value={"line"}>Line</option>
                    {this.props.drilldownFromFun === false && (
                        <option value={"stack"}>Stack</option>
                    )}
                </Select>
            </div>
        );
    }
}

export default DropDownMatrialUi;