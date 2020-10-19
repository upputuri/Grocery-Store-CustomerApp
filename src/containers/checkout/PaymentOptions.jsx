import { IonCol, IonContent, IonGrid, IonItem, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup, IonRow, IonText } from '@ionic/react';
import React, { useState } from 'react';

const PaymentOptions = (props) => {
    const [selectedOption, setSelectionOption] = useState(props.selectedOption);

    const updateSelection = (event) => {
        setSelectionOption(event.detail.value)
        props.paymentOptionSelectHandler(event.detail.value);
    }

    return (
        <IonContent className="ion-padding" color="dark">
            <IonGrid className="p-2">
                <IonRow className="p-3 ion-text-center border-bottom">
                    <IonCol>
                        <IonText color="primary">Please select a payment option</IonText>
                    </IonCol>
                </IonRow>
                <IonRow className="p-2 border-bottom">
                    <IonCol>
                        <IonList className="p-0">
                            <IonRadioGroup color="night" value={selectedOption} onIonChange={updateSelection}>
                                <IonListHeader color="night" >
                                    Pay On Delivery
                                </IonListHeader>
                                {props.onDeliveryOptions && props.onDeliveryOptions.map((onDelOption) => {
                                    return <IonItem color="night" lines="none" key={onDelOption.id}>
                                                <IonLabel>
                                                    {onDelOption.name}
                                                </IonLabel>
                                                <IonRadio slot="start" value={onDelOption.id}/>
                                            </IonItem>
                                })}
                            </IonRadioGroup>
                        </IonList>
                    </IonCol>
                </IonRow>
            </IonGrid>                        
        </IonContent>
    )
}

export default PaymentOptions;