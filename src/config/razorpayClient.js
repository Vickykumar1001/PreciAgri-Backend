const Razorpay = require('razorpay');

apiKey="rzp_test_bCwRAS88ZwEfxA"
apiSecret="d9xSHTcjcvcDjjEKgthYatcf"

const razorpay = new Razorpay({
    key_id: apiKey,
    key_secret: apiSecret,
  });


  module.exports=razorpay;