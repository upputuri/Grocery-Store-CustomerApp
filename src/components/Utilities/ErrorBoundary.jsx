import { IonAlert, IonContent, IonHeader, IonPage } from '@ionic/react';
import React from 'react';
import BaseToolbar from '../Menu/BaseToolbar';

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
        hasError: false,
        infoAlertState: {show: false, msg: ''} };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { 
        hasError: true,
        infoAlertState: {show: true, msg: 'Something went wrong! Please bear with us while we work on a resolution'}
      };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      // alert('didcatch error called'+error);
      // alert(JSON.stringify(errorInfo));
      this.logErrorToService(error, errorInfo);
    }

    logErrorToService(error, errorInfo) {
      // Send error detail to service
    }
  
    resetError() {
      this.setState(
        { 
          hasError: false,
          infoAlertState: {show: false, msg: ''}
        }
      )

      // this.props.history.push("/home");
    }

    render() {
      if (this.state.hasError) {
        return (
          <IonPage>
            <IonHeader className="osahan-nav border-white border-bottom">
                <BaseToolbar title="Error"/>     
            </IonHeader>               
            <IonContent color="dark">
              <IonAlert isOpen={this.state.infoAlertState.show}
                                onDidDismiss={this.resetError.bind(this)}
                                header={''}
                                cssClass='groc-alert'
                                message={this.state.infoAlertState.msg}
                                buttons={['OK']}/>
            </IonContent>
          </IonPage>
        )
      }
  
      return this.props.children; 
    }
  }

  export default ErrorBoundary;