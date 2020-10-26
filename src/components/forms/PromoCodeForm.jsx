import { IonButton, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonList, IonRow, IonText } from '@ionic/react';
import React, { useContext, useState } from 'react';
import { checkmark as checkMarkIcon} from 'ionicons/icons';
import { CartContext } from '../../App';

const PromoCodeForm = (props) => {

    const [promoCodeState, setPromoCodeState] = useState('');
    const [codeAppliedState, setCodeAppliedState] = useState(false);
    const [errorMsgState, setErrorMsgState] = useState('');
    const cartContext = useContext(CartContext);

    const setPromoCode = (event) => {
        setPromoCodeState(event.detail.value);
    }

    const applyPromoCode = () => {
        if (promoCodeState && promoCodeState.trim().length>0){
            setPromoCodeState(promoCodeState.trim());
            setErrorMsgState('');            
            sendValidatePromoCodeRequest(promoCodeState.trim()).then((result)=>{
                result === '' ? onApplySuccess() : setErrorMsgState(result);
            });
        }
    }

    const clearPromoCode = () => {
        setPromoCodeState('');
        setCodeAppliedState(false);
        setErrorMsgState('');
        props.codeCleared();
    }

    const sendValidatePromoCodeRequest = async () => {

    }

    const onApplySuccess = () => {
        setCodeAppliedState(true);
        props.codeApplied(promoCodeState);
    }

    return (
        <IonGrid>
            <IonRow>
                <IonCol>
                    <IonLabel className="subtext">Have a promo code?</IonLabel>
                </IonCol>
            </IonRow>
            <IonRow>
                <IonCol className="p-2">
                        <IonItem>
                            <IonInput type="text" minlength="1" maxlength="20" 
                                value={promoCodeState}
                                placeholder="CODE"
                                autoCapitalize="on" 
                                onIonChange={setPromoCode}></IonInput>
                        </IonItem>
                </IonCol>
            </IonRow>
            {errorMsgState && errorMsgState.length>0 &&
            <IonRow>
                <IonCol>
                    <IonText>{errorMsgState}</IonText>
                </IonCol>
            </IonRow>}
            <IonRow>
                {!codeAppliedState && 
                <IonCol>
                    <IonButton color="secondary" expand="block" onClick={applyPromoCode}>Apply</IonButton>
                </IonCol> ||
                <IonCol>
                    <IonText><IonIcon icon={checkMarkIcon} size="small" color="secondary"/>Code Applied
                    <IonButton color="secondary" expand="block" onClick={clearPromoCode}>Clear</IonButton></IonText>
                </IonCol>}
            </IonRow>
        </IonGrid>
    )
}

export default PromoCodeForm;