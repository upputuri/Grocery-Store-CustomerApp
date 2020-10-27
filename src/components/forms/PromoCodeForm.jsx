import { IonButton, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonRow, IonText } from '@ionic/react';
import { checkmarkCircle as checkMarkIcon, closeCircle as errorIcon } from 'ionicons/icons';
import Client from 'ketting';
import React, { useContext, useState } from 'react';
import { CartContext } from '../../App';
import { serviceBaseURL } from '../Utilities/ServiceCaller';

const PromoCodeForm = (props) => {

    const [promoCodeState, setPromoCodeState] = useState('');
    const [appliedCodeState, setAppliedCodeState] = useState(props.appliedCode);
    const [errorMsgState, setErrorMsgState] = useState('');
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});

    const setPromoCode = (event) => {
        setErrorMsgState('');
        setPromoCodeState(event.detail.value.toUpperCase());
    }

    const applyPromoCode = () => {
        if (promoCodeState && promoCodeState.length>0){
            setErrorMsgState('');            
            sendValidatePromoCodeRequest(promoCodeState).then((result)=>{
                result === '' ? onApplySuccess() : setErrorMsgState(result);
            });
        }
    }

    const clearPromoCode = () => {
        setPromoCodeState('');
        setAppliedCodeState('');
        setErrorMsgState('');
        props.codeCleared();
    }

    const sendValidatePromoCodeRequest = async (code) => {
        let path = serviceBaseURL + '/application/promocodes?code='+code; 
        const client = new Client(path);
        const resource = client.go();      
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            setLoadingState(false);
            return e.toString()+". Please retry";
        }
        if (!receivedState.data.valid) {
            let reason = receivedState.data.reason;
            switch (reason) {
                case 'invalid':
                    reason = "Invalid code";
                    break;
                case 'expired':
                    reason = "Code expired";
                    break;
                case 'consumed':
                    reason = "Code no more available";
                    break;
                default:
                    break;
            }
            return reason;
        }
        else {
            return '';
        }
    }

    const onApplySuccess = () => {
        setAppliedCodeState(promoCodeState);
        props.codeApplied(promoCodeState);
        setPromoCodeState('');
    }

    return (
        <IonGrid>
            <IonRow>
                <IonCol>
                    <IonText color="primary">Have a promo code?</IonText>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol className="p-2">
                        <IonItem>
                            <IonInput type="text" minlength="1" maxlength="20" 
                                value={promoCodeState}
                                placeholder="CODE"
                                autocapitalize="on" 
                                onIonChange={setPromoCode}></IonInput>
                        </IonItem>
                </IonCol>
            </IonRow>
            {errorMsgState && errorMsgState.length>0 &&
            <IonRow>
                <IonCol>
                    <IonText color="danger" className="subtext"><IonIcon icon={errorIcon} size="small" color="danger"/>{errorMsgState}</IonText>
                </IonCol>
            </IonRow>}
            <IonRow>
                {(!appliedCodeState || appliedCodeState === '') &&
                <IonCol>
                    <IonButton color="secondary" expand="block" onClick={applyPromoCode}>Apply</IonButton>
                </IonCol> ||
                <IonCol>
                    <IonText color="success"><IonIcon icon={checkMarkIcon} size="small" color="secondary"/>
                    Code Applied <IonText className="headtext" color="primary">{appliedCodeState}</IonText>
                    <IonButton color="secondary" expand="block" onClick={clearPromoCode}>Clear</IonButton></IonText>
                </IonCol>}
            </IonRow>
        </IonGrid>
    )
}

export default PromoCodeForm;