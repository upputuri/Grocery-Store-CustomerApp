import { IonBadge, IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonSlide, IonSlides, IonText } from '@ionic/react';
import { checkmarkCircle as checkMarkIcon, star as starIcon } from 'ionicons/icons';
import Client from 'ketting';
import React from 'react';
import { withRouter } from "react-router-dom";
import { CartContext, LoginContext } from '../App';
import BaseToolbar from '../components/Menu/BaseToolbar';
import { serviceBaseURL } from '../components/Utilities/ServiceCaller.ts'

class SingleProduct extends React.Component {
    state = {
        productId: null,
        resource: null,
        data: null,
        variantIndex: 0,
    }

    // shouldComponentUpdate()
    // {
    //     return this.state.productId !== null && 
    //     this.state.resource !== null && 
    //     this.state.data !== null;
    // }
    componentDidMount()
    {
        const { productId } = this.props.match.params;
        if (this.state.productId && this.state.productId === productId)
        return; //do nothing as the resource is already loaded
        this.setState({productId: productId});
        this.loadSingleProduct(productId);
    }

    componentDidUpdate()
    {
        const { productId } = this.props.match.params;
        if (this.state.productId && this.state.productId === productId)
            return; //do nothing as the resource is already loaded
        this.setState({productId: productId});
        this.loadSingleProduct(productId);
    }

    async loadSingleProduct(id)
    {
        let path = serviceBaseURL + '/products/'+id;
        if (this.state.resource !== null && path.localeCompare(this.state.resource.uri) === 0)
            return;

        const client = new Client(path);
        const resource = client.go();
        let receivedState;
        try{
            receivedState = await resource.get();
        }
        catch(e)
        {
            console.log("Service call failed with - "+e);
            return;
        }
        const product = receivedState.data;
        // alert(JSON.stringify(products));
        this.setState({
            data: product,
            resource: resource
        })        
    }

    variantSelected(index) 
    {
        this.setState({variantIndex: index});
    }

    addToCart(loginContext, cartContext, productId, variantId, qty)
    {
        if (!loginContext.isAuthenticated)
        {
            console.log("Customer is not authenticated, hence redirecting to login page");
            let { history } = this.props;
            history.push("/login");
            return;
        }
        console.log("Invoking add Item on cart context");
        cartContext.addItem(productId, variantId, qty);
    }

    render() {
        return (
            <IonPage>
                <IonHeader className="osahan-nav">
                    <BaseToolbar title="Product Detail"/>
                    <IonSearchbar className="pt-1" placeholder="Search for products"></IonSearchbar>      
                </IonHeader>                
                <IonContent color="dark">
                    {this.state.data && 
                    <div>
                        <IonSlides pager="true">
                            <IonSlide>
                                <img alt="img" className="single-img" src="assets/item/7.jpg"/>
                            </IonSlide>
                            <IonSlide>
                                <img alt="img" className="single-img" src="assets/item/10.jpg"/>
                            </IonSlide>
                            <IonSlide>
                                <img alt="img" className="single-img" src="assets/item/9.jpg"/>
                            </IonSlide>
                        </IonSlides>
                        <div className="p-3">
                            <div className="mb-2 card p-3 single-page-info">
                                <div>
                                <div className="single-page-shop">
                                    <IonText color="primary">
                                        <h6 className="mb-1">{this.state.data.name}</h6>
                                    </IonText>


                                    {/* <p className="font-weight-normal text-white mb-2 price">
                                    <span className="old-price mr-2">₹338.99</span> <span className="regular-price text-secondary font-weight-normal">₹190.99</span> 
                                    <IonBadge color="success">25% OFF</IonBadge>
                                    </p> */}
                                    <div className="font-weight-normal mb-2 price">
                                        <span><IonText><h5 className="mb-2 text-white">{'₹'+this.state.data.variations[this.state.variantIndex].price}
                                            <span>
                                            <IonText color="success">  {this.state.data.discount > 0 ? this.state.data.discount+'% OFF':''}</IonText></span></h5></IonText>
                                        </span>  
                                    </div>
                                    <small className="text-secondary">
                                        <strong>
                                            <IonIcon color="success" icon={checkMarkIcon}></IonIcon>
                                            Available in - 
                                        </strong>
                                        <span>
                                            {this.state.data.variations.map((v, index) => {
                                                
                                                return <IonBadge color={
                                                    index === this.state.variantIndex? 'red':'tertiary'
                                                }className='ml-1' key={v.id} onClick={this.variantSelected.bind(this, index)}>{v.name}</IonBadge>
                                            })}
                                        </span>
                                    </small>                                                      
                                    <div className="small text-gray-500 d-flex align-items-center justify-content-between">
                                        <div>
                                            <IonIcon color="tertiary" icon={starIcon}></IonIcon>
                                            4.4
                                        </div>
                                        <LoginContext.Consumer>
                                            {loginContext => 
                                                <CartContext.Consumer>
                                                    {cartContext =>
                                                    <IonButton 
                                                        onClick={() => this.addToCart(loginContext, cartContext, this.state.productId, this.state.data.variations[this.state.variantIndex].id, 1)} 
                                                        color="secondary" shape="round">Add</IonButton>
                                                    }
                                                </CartContext.Consumer>
                                            }
                                        </LoginContext.Consumer>
                                        {/* <!-- <div className="input-group shop-cart-value">
                                            <span className="input-group-btn"><button disabled="disabled" className="btn btn-sm" type="button">-</button></span>
                                            <input type="text" max="10" min="1" value="1" className="form-control border-form-control form-control-sm input-number bg-black text-white" name="quant[1]">
                                            <span className="input-group-btn"><button className="btn btn-sm" type="button">+</button>
                                            </span>
                                        </div> --> */}
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="mb-2 card p-3 single-page-info">
                                <div className="short-description">
                                <small className="float-right">Availability: <span className="badge badge-success">{this.state.data.inStock ? 'In Stock': 'Out of Stock'}</span></small>
                                <h6 className="font-weight-bold mb-3">
                                    Quick Overview  
                                </h6>
                                <p className="text-secondary">{this.state.data.description}
                                </p>
                                <p className="mb-0 text-secondary">{this.state.data.variations[this.state.variantIndex].description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    }
                    </IonContent>
            </IonPage>

        )
    }
}

export default withRouter(SingleProduct);