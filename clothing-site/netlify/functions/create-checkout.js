const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { items } = JSON.parse(event.body);

  const line_items = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: 'https://arivonapparel.netlify.app/success.html',
    cancel_url: 'https://arivonapparel.netlify.app/cart.html',
    shipping_address_collection: { allowed_countries: ['US'] },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};
