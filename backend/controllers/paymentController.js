const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


exports.createCheckoutSession = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { doctorName, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Consultation with ${doctorName}`,
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      success_url: "https://healthcare-platform-smos.vercel.app/payment-success",
      cancel_url: "https://healthcare-platform-smos.vercel.app/payment-cancel",
    });

   res.json({
  id: session.id,
  url: session.url,
});


  } catch (error) {
    console.error("Stripe Error:", error); 
    res.status(500).json({ error: error.message });
  }
};
