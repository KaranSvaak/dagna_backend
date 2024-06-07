import donationService from "../services/donation.service.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import paypal from "paypal-rest-sdk";
import { asyncHandler } from "../utils/asyncHandler.js";
import { handleResponse, handleError } from "../helpers/helper.methods.js";

paypal.configure({
  mode: "sandbox", // Change to 'live' for production
  client_id: "AQzi_5q2DL86Yb1Q5mpwPW3lmurgpVPFpgj6XZHOLS6DTommkEm74kgxrBOQh2DjTdNEV8L9jzGUzNuc",
  client_secret: "EOUWV7CGVPoRq0IMQKx0TPwtp413wjkxtcO0nyBSvJq-0R7K1lWyE4-Ew2ihvoccUPVvZ8s3BRjTs58u",
});

//Register Role
const donation = asyncHandler(async (req, res) => {
  try {
    let donationAmount = 5;
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5000/api/v1/donation/success",
        cancel_url: "http://localhost:5000/api/v1/donation/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Donation",
                sku: "001",
                price: donationAmount,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: donationAmount,
          },
          description: "Donate to our cause",
        },
      ],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            console.log("payment.links[i].href", payment.links[i].href);
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
});

const paymentSuccess = asyncHandler(async (req, res) => {
  try {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    // First, retrieve the payment details
    paypal.payment.get(paymentId, function (error, payment) {
      if (error) {
        return res.status(500).send(error);
      } else {
        // Log the payment details to verify the amounts
        console.log("Payment Details:", payment);

        // Assuming the transaction details need to match the original payment creation
        const execute_payment_json = {
          payer_id: payerId,
          transactions: [
            {
              amount: {
                currency: "USD",
                total: payment.transactions[0].amount.total, // Ensure this matches the original
              },
            },
          ],
        };

        // Execute the payment
        paypal.payment.execute(
          paymentId,
          execute_payment_json,
          function (error, payment) {
            if (error) {
              return res.status(500).send(error);
            } else {
              console.log(
                "........................................",
                JSON.stringify(payment)
              );
              res.redirect("http://127.0.0.1:5173/#/users");
            }
          }
        );
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
});

// Handle the donation response
const registerDonation = asyncHandler(async (req, res) => {
  try {
    const response = await donationService.registerDonation(req.body);
    return res.status(200).json(
        new apiResponse(200, response, "Donation register successfully"));
  } catch (error) {
    return res.status(500).json(
        new apiError({ statusCode: error.statusCode, message: error.message }));
  }
});

//Get all Donation Infos or By Id
const getDonationInfo = asyncHandler(async (req, res) => {
  try {
    const response = await donationService.getDonationInfo(req.query.id);
    return handleResponse(res, 200, response, "Donation Info(s) fetched successfully");
  } catch (error) {
    return handleError(res, error);
  }
});

export default {
  donation, 
  paymentSuccess, 
  registerDonation,
  getDonationInfo,
};
