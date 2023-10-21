const Stripe = require('stripe');
const stripe = Stripe('sk_test_51O1lXaKYnblhv6ZOT1LZZc8pMohtP52I48iPLdrBe0OPBL3awWf9Fx4A7Sfmj190rMMeIeEFzh6rbXuQ4Mv5M8qc00rlkOWKww');

var customer = await stripe.customers.retrieve(
    'cu_1O1larKYnblhv6ZOydkLoUO6',
    {
      apiKey: 'sk_test_51O1lXaKYnblhv6ZOT1LZZc8pMohtP52I48iPLdrBe0OPBL3awWf9Fx4A7Sfmj190rMMeIeEFzh6rbXuQ4Mv5M8qc00rlkOWKww'
    }
  );