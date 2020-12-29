import { IonText } from '@ionic/react';
import React from 'react';

const StatusText = (props) => {
    // let status;
    let statusColor;
    switch (props.status) {
        case "Initial":
            // status = 'Order accepted';
            statusColor = 'success';
            break;
        case "Running":
            // status = 'Preparing for dispatch';
            statusColor = 'success';
            break;
        case "Executed":
            // status = 'Out for delivery';
            statusColor = 'success';
            break;
        case "Cancel Request":
            // status = 'Cancel in progress';
            statusColor = 'warning';
            break;
        case "Cancelled":
            // status = 'Cancelled';
            statusColor = 'danger';
            break;
        default:
            // status = props.status;
            statusColor = 'warning';
            break;
    }

    return (
        <IonText color={statusColor}>{props.status}</IonText>
    )
}

export default StatusText;