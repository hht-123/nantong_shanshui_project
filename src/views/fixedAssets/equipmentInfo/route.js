import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import EpuipmentInfo from './index';
import EpuipmentCreate from '../infoCreateAndEdit/create';
import EpuipmentEdit from '../infoCreateAndEdit/edit';

class Equipment extends Component {
    render() {
        return(
            <div>
                <Switch>
                    <Route exact path='/app/equipment/' component={ EpuipmentInfo } />
                    <Route path='/app/equipment/create/' component={(props) => <EpuipmentCreate {...props}/>} />
                    <Route path='/app/equipment/edit/:equipment_code' component={(props) => <EpuipmentEdit {...props}/>} />
                </Switch>
            </div>
        )
    }
}

export default Equipment;