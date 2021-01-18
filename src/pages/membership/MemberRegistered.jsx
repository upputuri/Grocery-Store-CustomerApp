import { IonContent, IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import InfoMessageTile from '../../components/Cards/InfoMessageTile';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { generateOrderId } from '../../components/Utilities/AppCommons';

const MemberRegistered = () => {
    const history = useHistory();
    const search = useLocation().search;
    const membershipId = new URLSearchParams(search).get('membershipid');

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Thank you"/>     
            </IonHeader>
            <IonContent className="ion-padding" color="dark">
            {membershipId === 0 && 
            <InfoMessageTile subject="No confirmation from server"
                            detail="Failed to get a response from server. Check your memberships page to see if your registration request succeeded!"
                            detailColor="danger"
                            leftButtonText="Membership"
                            leftButtonClickHandler={()=>history.push("/membership")}/>
            }
            {membershipId > 0  &&
            <InfoMessageTile 
                            subject="Welcome to The Vegit Club!"
                            detail={"Your registration request is successful. Please check your membership plan detail"}
                            leftButtonText="Membership"
                            leftButtonClickHandler={()=>history.push("/membership")}/>
            }
            {membershipId < 0 && 
            <InfoMessageTile headerTextLeft="Payment error"
                            subject={"We have not received payment confirmation for your order"}
                            detail="If the amount is debited from your bank account, it will be returned to the same account automatically"/>
            }
            </IonContent>
        </IonPage>
    )
}

export default MemberRegistered;