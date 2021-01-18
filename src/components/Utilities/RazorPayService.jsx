import { logoURL } from './ServiceCaller';

var RazorpayCheckout = require('com.razorpay.cordova/www/RazorpayCheckout');

const RazorPayService =  {
    processRazorPayment : async (transaction, successFn, cancelFn) => {
        // alert(transaction.providerData);
        // alert("RazorPay not supported");
        const providerData = JSON.parse(transaction.providerData);
        const orderId = providerData.order.id;
        const razorPayKey = providerData.key;
        const amount = providerData.order.amount;
        // alert(orderId+" "+razorPayKey+" "+amount);
        // alert(orderId);
            var options = {
                description: 'Payment towards The Vegit Club membership',
                image: logoURL,
                order_id: orderId,
                currency: 'INR',
                key: razorPayKey,
                amount: `${amount}`,
                name: 'The Vegit Club',
                theme: {
                    color: '#3399cc'
                    }
            };
            console.log(RazorpayCheckout);
            RazorpayCheckout.on('payment.success', successFn);
            RazorpayCheckout.on('payment.cancel', cancelFn);
            RazorpayCheckout.open(options);
    }
    
}


export default RazorPayService;