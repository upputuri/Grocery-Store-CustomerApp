import { IonBadge, IonCol, IonGrid, IonRow, IonText } from '@ionic/react';
import React from 'react';

const ItemListing1 = () => {
    return (
        <IonGrid>
        <IonRow>
        <IonCol>
            <div className="p-2 shop-homepage-item bg-black">
                <div className="shop-cart-left">
                    <img alt="img" className="not-found-img" src="assets/small/1.jpg"/>
                </div>
                <div className="shop-cart-right">
                    <IonText color="light">
                    <div className="mb-2">Apples
                    </div>
                    </IonText>
                    <p className="font-weight-normal text-white mb-2">
                    <span className="old-price mr-2">₹600.99</span> <span className="regular-price text-secondary font-weight-normal">₹300.99</span> 
                    <IonBadge color="success">50% OFF</IonBadge>
                    </p>
                    <div className="small text-gray-500 d-flex align-items-center justify-content-between">
                    <small className="text-muted">2 Kg</small>
                    <div className="input-group shop-cart-value">
                        <span className="input-group-btn"><button disabled="disabled" className="btn btn-sm" type="button">-</button></span>
                        <IonText className="ml-2 mr-2"> {' 1 '} </IonText>
                        {/* <input type="text" max="10" min="1" defaultValue="1" className="form-control border-form-control form-control-sm input-number text-white bg-black" name="quant[1]"/> */}
                        <span className="input-group-btn"><button className="btn btn-sm" type="button">+</button>
                        </span>
                    </div>
                </div>
            </div>
            </div>
        </IonCol>
        <IonCol>
            <div className="p-2 shop-homepage-item bg-black">
                <div className="shop-cart-left">
                    <img alt="img" className="not-found-img" src="assets/small/7.jpg"/>
                </div>

                <div className="shop-cart-right">
                <IonText color="light">
                    <div className="mb-2">Guavas
                </div>
                </IonText>
                <p className="font-weight-normal text-white mb-2">
                    <span className="old-price mr-2">₹600.99</span> <span className="regular-price text-secondary font-weight-normal">₹300.99</span> 
                    <IonBadge color="success">50% OFF</IonBadge>
                </p>
                <div className="small text-gray-500 d-flex align-items-center justify-content-between">
                    <small className="text-muted">2 Kg</small>
                    <div className="input-group shop-cart-value">
                        <span className="input-group-btn"><button disabled="disabled" className="btn btn-sm" type="button">-</button></span>
                        <IonText className="ml-2 mr-2"> {' 1 '} </IonText>
                        {/* <input type="text" max="10" min="1" defaultValue="1" className="form-control border-form-control form-control-sm input-number text-white bg-black" name="quant[1]"/> */}
                        <span className="input-group-btn"><button className="btn btn-sm" type="button">+</button>
                        </span>
                    </div>
                </div>
            </div>                 
            </div>
        </IonCol>
        </IonRow>
        <IonRow>
        <IonCol>
            <div className="p-2 shop-homepage-item bg-black">
                <div className="shop-cart-left">
                    <img alt="img" className="not-found-img" src="assets/small/3.jpg"/>
                </div>

                <div className="shop-cart-right">
                <IonText color="light">
                    <div className="mb-2">Pineapple
                </div>
                </IonText>
                <p className="font-weight-normal text-white mb-2 price">
                    <span className="old-price mr-2">₹78.99</span> <span className="regular-price text-secondary font-weight-normal">₹60.99</span> 
                    <IonBadge color="success">5% OFF</IonBadge>
                </p>
                <div className="small text-gray-500 d-flex align-items-center justify-content-between">
                    <small className="text-muted">300 ml</small>
                    <div className="input-group shop-cart-value">
                        <span className="input-group-btn"><button disabled="disabled" className="btn btn-sm" type="button">-</button></span>
                        <IonText className="ml-2 mr-2"> {' 1 '} </IonText>
                        {/* <input type="text" max="10" min="1" defaultValue="1" className="form-control border-form-control form-control-sm input-number text-white bg-black" name="quant[1]"/> */}
                        <span className="input-group-btn"><button className="btn btn-sm" type="button">+</button>
                        </span>
                    </div>
                </div>
            </div>                 
            </div>
        </IonCol>
        <IonCol>
            <div className="p-2 shop-homepage-item bg-black">
                <div className="shop-cart-left">
                    <img alt="img" className="not-found-img" src="assets/small/6.jpg"/>
                </div>

                <div className="shop-cart-right">
                <IonText color="light">
                    <div className="mb-2">Grapes
                </div>
                </IonText>
                <p className="font-weight-normal text-white mb-2 price">
                    <span className="old-price mr-2">₹78.99</span> <span className="regular-price text-secondary font-weight-normal">₹60.99</span> 
                    <IonBadge color="success">5% OFF</IonBadge>
                </p>
                <div className="small text-gray-500 d-flex align-items-center justify-content-between">
                    <small className="text-muted">300 ml</small>
                    <div className="input-group shop-cart-value">
                        <span className="input-group-btn"><button disabled="disabled" className="btn btn-sm" type="button">-</button></span>
                        <IonText className="ml-2 mr-2"> {' 1 '} </IonText>
                        {/* <input type="text" max="10" min="1" defaultValue="1" className="form-control border-form-control form-control-sm input-number text-white bg-black" name="quant[1]"/> */}
                        <span className="input-group-btn"><button className="btn btn-sm" type="button">+</button>
                        </span>
                    </div>
                </div>
            </div>                 
            </div>
        </IonCol>
        </IonRow>

        </IonGrid>
    );
}

export default ItemListing1;