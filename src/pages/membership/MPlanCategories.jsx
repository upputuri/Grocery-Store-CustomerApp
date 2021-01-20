import { IonAlert, IonContent, IonHeader, IonLoading, IonPage } from '@ionic/react';
import Client from 'ketting';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import BaseToolbar from '../../components/Menu/BaseToolbar';
import GrocSearch from '../../components/Menu/GrocSearch';
import { clientConfig } from '../../components/Utilities/AppCommons';
import { serviceBaseURL } from '../../components/Utilities/ServiceCaller';
import MPlanCategoryTile from './MPlanCategoryTile';

const MPlanCategories = () => {
    const [loadingState, setLoadingState] = useState(false);
    const [mPlanCategoriesState, setMPlanCategoriesState] = useState(undefined);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});
    const history = useHistory();

    useEffect(()=>{
        loadCategories();
    },[]);

    const loadCategories = async () => {
        //Load categories froms server
        let path = serviceBaseURL + '/membership/plans/categories';
        const client = new Client(path);
        const resource = client.go();
        // const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        // const loginHeaders = new Headers();
        // loginHeaders.append("Content-Type", "application/json");
        // loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get({
                // headers: loginHeaders,
            });
        }
        catch(e)
        {
            setLoadingState(false);
            setInfoAlertState({show: true, msg: clientConfig.connectivityErrorAlertMsg});
            return;
        }
        // console.log(JSON.stringify(receivedState));
        const categoriesListState = receivedState.getEmbedded();
        const mplanCategories = categoriesListState.map((categoryState) => categoryState.data)
        setMPlanCategoriesState(mplanCategories);
        console.log("Request successful on server");
        setLoadingState(false); 
    }

    const viewPlansInCategory = (categoryId, name) => {
        history.push('/mplans?categoryid='+categoryId+'&categoryname='+name);
    }

    return (
        <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Membership Plans"/>      
            </IonHeader>
            <IonAlert isOpen={infoAlertState.show}
                            onDidDismiss={()=> setInfoAlertState(false)}
                            header={''}
                            cssClass='groc-alert'
                            message={infoAlertState.msg}
                            buttons={['OK']}/>
            <IonLoading isOpen={loadingState}/>              
            <IonContent color="dark" className="ion-padding">
                {mPlanCategoriesState && mPlanCategoriesState.map((category) =>{
                    return <MPlanCategoryTile key={category.categoryId} 
                                            categoryId={category.categoryId}
                                            categoryName={category.categoryName} 
                                            onViewPlansClick={viewPlansInCategory.bind(this, category.categoryId, category.categoryName)}/>
                })}

            </IonContent>
        </IonPage>
    )
}

export default MPlanCategories;