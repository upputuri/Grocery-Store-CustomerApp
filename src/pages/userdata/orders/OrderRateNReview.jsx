import { IonAlert, IonContent, IonHeader, IonLoading, IonPage } from '@ionic/react';
import Client from 'ketting';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { LoginContext } from '../../../App';
import RateNReviewOrderItemTile from '../../../components/Cards/RateNReviewOrderItemTile';
import BaseToolbar from '../../../components/Menu/BaseToolbar';
import GrocSearch from '../../../components/Menu/GrocSearch';
import { clientConfig, generateOrderId } from '../../../components/Utilities/AppCommons';
import { serviceBaseURL } from '../../../components/Utilities/ServiceCaller';

const OrderRateNReview = (props) => {

    const loginContext = useContext(LoginContext);
    const [orderDetailState, setOrderDetailState] = useState(undefined);
    const [loadingState, setLoadingState] = useState(false);
    const [serviceRequestAlertState, setServiceRequestAlertState] = useState({show: false, msg: ''});
    const [retryState, setRetryState] = useState(false);
    const history = useHistory();
    const [displayOrderId, setDisplayOrderId] = useState(undefined);
    const [displayTS, setDisplayTS] = useState(undefined);
    const [editableOrderItemId, setEditableOrderItemId] = useState(undefined);
    const [userRatingState, setUserRatingState] = useState(undefined);
    const [userReviewState, setUserReviewState] = useState(undefined);
    const [infoAlertState, setInfoAlertState] = useState({show: false, msg: ''});

    useEffect(()=>{
        const { id } = props.match.params;
        loadOrderDetail(id);
    },[]);

    const loadOrderDetail = async (orderId) => {
        let path = serviceBaseURL + '/orders/'+orderId;
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get({
                headers: loginHeaders
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            if (e.status && e.status === 401)//Unauthorized
            {
                history.push("/login");
                return;
            } 
            setLoadingState(false);
            setServiceRequestAlertState({show: true, msg: e.toString()});
            return;
        }
        // alert(JSON.stringify(receivedState));
        const orderDetail = receivedState.data;
        setOrderDetailState(orderDetail);
        let receivedOrderTS = orderDetail.createdTS;

        let displayTS = receivedOrderTS;
        console.log(displayTS);
        if (receivedOrderTS){
            const date = new Date(receivedOrderTS);
            displayTS = date.getDate().toString().padStart(2,0)+"-"+
                        (date.getMonth()+1).toString().padStart(2,0)+"-"+
                        date.getFullYear()+" "+
                        date.getHours().toString().padStart(2,0)+":"+
                        date.getMinutes().toString().padStart(2,0);
        }
        else{
            displayTS = "Unavailable";
        }
        let displayOrderId = generateOrderId(orderDetail.id, receivedOrderTS);
        setDisplayOrderId(displayOrderId);
        setDisplayTS(displayTS);
        
        console.log("Loaded order detail from server");
        setLoadingState(false);  
    }

    const viewRatingForm = (orderItemId, productId) => {
        loadRatingNReview(productId).then(()=>{
            setEditableOrderItemId(orderItemId);
        });
        // alert('enabling edit for : '+orderItemId);
    }

    const hideRatingForm = () => {
        setEditableOrderItemId(undefined);
    }

    const loadRatingNReview = async (productId) => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/productreviews?productid='+productId;
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.get({
                headers: loginHeaders
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            if (e.status && e.status === 401)//Unauthorized
            {
                history.push("/login");
                return;
            } 
            setLoadingState(false);
            return;
        }
        const productReview = receivedState.data;
        // alert(JSON.stringify(productReview.rating));
        setUserRatingState(productReview.rating);
        setUserReviewState({title: productReview.reviewTitle, detail: productReview.reviewDetail});
        console.log("Data received from server");
        setLoadingState(false);
    }

    const sendRatingNReviewUpdateRequest = async (productId, rating, reviewTitle, reviewDetail) => {
        let path = serviceBaseURL + '/customers/'+loginContext.customer.id+'/productreviews';
        const client = new Client(path);
        const resource = client.go();
        const authHeaderBase64Value = btoa(loginContext.customer.mobile+':'+loginContext.customer.password);
        const loginHeaders = new Headers();
        loginHeaders.append("Content-Type", "application/json");
        loginHeaders.append("Authorization","Basic "+authHeaderBase64Value);        
        setLoadingState(true);
        console.log("Making service call: "+resource.uri);
        let receivedState;
        try{
            receivedState = await resource.post({
                headers: loginHeaders,
                data: {productId: productId, rating: rating, reviewTitle: reviewTitle, reviewDetail: reviewDetail}
            });
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            if (e.status && e.status === 401)//Unauthorized
            {
                history.push("/login");
                return;
            } 
            setLoadingState(false);
            return;
        }
        const productReview = receivedState.data;
        setUserRatingState(productReview.rating);
        setUserReviewState({title: productReview.reviewTitle, detail: productReview.reviewDetail});   
        console.log("Request successful on server");
        setLoadingState(false);   
        setEditableOrderItemId(undefined);
        setInfoAlertState({show: true, msg: clientConfig.submitReviewSuccessAlertMsg});
    }

    if (orderDetailState){
        return (
            <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title={"Rate & Review"}/>
                <GrocSearch/>      
            </IonHeader>
            <IonLoading isOpen={loadingState}/>
            <IonAlert isOpen={infoAlertState.show}
                        onDidDismiss={()=> setInfoAlertState(false)}
                        header={''}
                        cssClass='groc-alert'
                        message={infoAlertState.msg}
                        buttons={['OK']}/>   
            <IonAlert
                isOpen={serviceRequestAlertState.show}
                header={'Error'}
                cssClass='groc-alert'
                subHeader={serviceRequestAlertState.msg}
                message={'Failed to load'}
                buttons={[{text: 'Cancel', 
                            handler: ()=>{history.push('/home')}
                        }, {text: 'Retry', 
                            handler: ()=>{setServiceRequestAlertState({show: false, msg: ''}); setRetryState(!retryState)}}]}
            />                                
            <IonContent color="dark" className="ion-padding">
                {
                    orderDetailState.orderItems && orderDetailState.orderItems.map(
                    (item) => {
                        // console.log(userRatingState);
                        return ( 
                                <RateNReviewOrderItemTile
                                    id={item.id}
                                    key={item.id}
                                    productId={item.productId}
                                    variationId={item.insvid}
                                    image={item.image} 
                                    name={item.name} 
                                    unitLabel={item.qtyUnit}
                                    status={item.orderItemStatus}
                                    editingEnabledId={editableOrderItemId}
                                    rating={userRatingState}
                                    review={userReviewState}
                                    onRateNReviewBegin={viewRatingForm.bind(this, item.id, item.productId)}
                                    ratingNReviewSubmitHandler={sendRatingNReviewUpdateRequest}
                                    cancelEdit={hideRatingForm}
                                    />
                        )
                    }
                )}
            </IonContent>  
        </IonPage>
        )
    }
    else{
        return (
            <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title={"Rate & Review"}/>
                <GrocSearch/>      
            </IonHeader>
            <IonLoading isOpen={loadingState}/> 
            <IonAlert
                isOpen={serviceRequestAlertState.show}
                header={'Error'}
                cssClass='groc-alert'
                subHeader={serviceRequestAlertState.msg}
                message={'Failed to load'}
                buttons={[{text: 'Cancel', 
                            handler: ()=>{history.push('/home')}
                        }, {text: 'Retry', 
                            handler: ()=>{setServiceRequestAlertState({show: false, msg: ''}); setRetryState(!retryState)}}]}
            />                                
            <IonContent color="dark" className="ion-padding">

            </IonContent>  
        </IonPage>
        )
    }
}

export default OrderRateNReview;
