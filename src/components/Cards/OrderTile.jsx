import { IonButton, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import React from 'react';
import { useHistory } from 'react-router';
import StatusText from '../../pages/userdata/orders/StatusText';

const OrderTile = (props) =>
{
    const history = useHistory();

    let receivedOrderTS = props.order.createdTS;
    let displayTS = receivedOrderTS;
    if (receivedOrderTS){
        const date = new Date(receivedOrderTS);
        displayTS = date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    }
    else{
        displayTS = "Unavailable";
    }

    const viewDetail = () =>{
        history.push("/orders/"+props.order.orderId);
    }

    const cancelClicked = () =>{
        props.cancelClickHandler();
    }

    return  <IonGrid className="ordertile">

                <IonRow className="ion-text-center border-bottom border-secondary">
                    <IonCol className="p-3">
                        <IonText color="primary">{'Order# '+props.order.orderId}</IonText>
                    </IonCol>
                    <IonCol className="p-3">
                        <IonText color="primary">{'₹'+props.order.finalTotal}</IonText>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-left">
                    <IonCol>
                        <IonText className="subtext ml-2">Order time: </IonText><IonText color="secondary">{displayTS}</IonText>
                    </IonCol>
                </IonRow>
                <IonRow className="ion-text-left">
                    <IonCol>
                        <IonText className="subtext ml-2">Status: </IonText><StatusText status={props.order.orderStatus.trim()}/>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        {(props.order.orderStatus.trim() === 'Initial' || props.order.orderStatus.trim() === 'Executing') &&
                        <IonButton onclick={cancelClicked} className="ml-2" color="tertiary" size="small">Cancel Order</IonButton>
                        }
                    </IonCol>
                    <IonCol>
                        <div className="d-flex justify-content-end">
                            <IonButton onClick={viewDetail} className="ml-2" color="secondary" size="small">View Details</IonButton>
                        </div>
                    </IonCol>
                </IonRow>
            </IonGrid>
}

export default OrderTile;