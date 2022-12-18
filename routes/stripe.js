const express = require("express");
const app = express();
const { check, validationResult } = require("express-validator");
const config = require("config");
const StripeKey = config.get("Stripe");
const ClientURl = config.get("ClientURl");
const Stripe = require("stripe");
const router = express.Router();
const UserAuth = require("./../middleware/UserAuth");

const stripe = require("stripe")(StripeKey);

router.post(
  "/checkout",
  [UserAuth, check("dataItems", "dataItems is Required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { dataItems } = req.body;
    // console.table(dataItems);

    // const coupon = await stripe.coupons.create({
    //   percent_off: 5,
    //   duration: "once",
    // });

    const line_items = dataItems.map((e) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: e.name,
            images: [e.imageSrc],
          },
          unit_amount: e.price * 100,
        },
        quantity: e.qunatity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      // discounts: [
      //   {
      //     coupon: "qsbZdwb6",
      //   },
      // ],
      success_url: `${ClientURl}/checkout-success`,
      cancel_url: `${ClientURl}/ShopCart`,
    });

    res.send({ url: session.url });
  }
);

module.exports = router;
