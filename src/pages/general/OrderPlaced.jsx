import { IonContent, IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import InfoMessageTile from '../../components/Cards/InfoMessageTile';
import BaseToolbar from '../../components/Menu/BaseToolbar';

const OrderPlaced = () => {
    const history = useHistory();
    const search = useLocation().search;
    const newOrderId = new URLSearchParams(search).get('id');

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Order Status"/>     
            </IonHeader>
            <IonContent className="ion-padding" color="dark">
            {newOrderId === 0 && 
            <InfoMessageTile subject="No confirmation from server"
                            detail="Failed to get a response from server. Check your orders below before placing a new order!"
                            detailColor="danger"
                            leftButtonText="View Orders"
                            leftButtonClickHandler={()=>history.push("/orders")}/>
            }
            {newOrderId > 0  &&
            <InfoMessageTile headerTextLeft="Your Order has been placed successfully!"
                            subject={"#"+newOrderId}
                            leftButtonText="View Orders"
                            leftButtonClickHandler={()=>history.push("/orders")}/>
            }
            {newOrderId < 0 && 
            <InfoMessageTile headerTextLeft="Payment error"
                            subject={"We have not received payment confirmation for your order"}
                            detail="If the amount is debited from your bank account, it will be returned to the same account automatically"/>
            }
            </IonContent>
        </IonPage>
    )
}

export default OrderPlaced;