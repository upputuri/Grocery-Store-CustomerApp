import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText, IonTextarea } from '@ionic/react';
import React, { useState } from 'react';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import { chevronDownOutline as arrowDownIcon, chevronForwardOutline as arrowRightIcon} from 'ionicons/icons';

const FAQ = () =>{

    const faqdata = ['This is the answer for the first question. But this answer has to be little detailed, so I am adding some additional content without any idea what the content should be',
                    'This is the answer for the second question. But this answer has to be little detailed, so I am adding some additional content without any idea what the content should be',
                    'This is the answer for the third question. But this answer has to be little detailed, so I am adding some additional content without any idea what the content should be',
                    'This is the answer for the fourth question. But this answer has to be little detailed, so I am adding some additional content without any idea what the content should be'];
    const [selectedIndex , setSelectedIndex] = useState(-1);

    const toggleSelectedIndex = (i) =>{
        setSelectedIndex(selectedIndex !== i ? i : -1);
    }

    return (
        <IonPage>
            <IonHeader className="osahan-nav">
                <BaseToolbar title="FAQs"/>     
            </IonHeader>                                           
            <IonContent className="faq ion-padding" color="dark">
                {[0,1,2,3].map((i) =>{
                    return <IonList key={i} color="night" lines="full" className="ion-no-margin ion-no-padding">
                                <IonItem className={selectedIndex===i?"":"border-bottom"} color="night" onClick={()=>toggleSelectedIndex(i)} id={i}>
                                    <IonText color="primary">
                                    <IonIcon className="mr-2" icon={selectedIndex === i? arrowDownIcon : arrowRightIcon}/>
                                    {'What is the text in Question'+' '+i+'?'}</IonText>
                                </IonItem>
                                {selectedIndex === i && 
                                <IonItem color="night">
                                    <IonText><div className="maintext mt-2 mb-2">{faqdata[i]}</div></IonText>
                                </IonItem>
                                }   
                            </IonList>
                })}
            </IonContent>
        </IonPage>
    )
}

export default FAQ;