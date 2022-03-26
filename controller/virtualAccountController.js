const Razorpay = require("razorpay");
const virtualAccountModel = require("../model/virtualAccountModel");
const request = require("request");

exports.virtual_accounts = async (req, res) => {
  try {
    const { customer_name, description } = req.body;

    var instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.SECRETE_KEY,
    });

    const virtualAccount = await instance.virtualAccounts.create({
      receivers: {
        types: ["bank_account"],
      },
      description: description,
      customer_id: "cust_JAvXcLLk5wJhNM",
      close_by: 1681615838,
      notes: {
        project_name: "Banking Software",
      },
    });
    console.log("virtualAccount" , virtualAccount);

    const createVirtualAccounts = new virtualAccountModel({
      _id: virtualAccount.id,
      customer_id: "cust_CaVDm8eDRSXYME",
      customer_name: customer_name,
      description: description,
    });
    await createVirtualAccounts.save();

    return res.status(201).json({ data: createVirtualAccounts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(error);
  }
};

// exports.closeVirtualAccount = async (req, res) => {
//   try {
//     id = req.params.id;
//     console.log(id);
//     var instance = new Razorpay({
//       key_id: process.env.KEY_ID,
//       key_secret: process.env.SECRETE_KEY,
//     });
//     console.log(instance.virtualAccounts);
//     const x = await instance.virtualAccounts.close(id,(err,result) => {
//       if(err){
//         console.log(err);
//       }else{
//         console.log(result);
//       }
//     });
//     // const closeAccount = await virtualAccountModel.findByIdAndRemove({ account_id: id });
//     console.log(x);

//     return res.status(200).json({
//       message: "successfully close account",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ error: "Internal Server Error" });
//   }
// };

exports.closeVirtualAccount = async (req, res) => {
  try {
    const data = await virtualAccountModel.findOneAndUpdate(
      { _id: req.params._id },
      {
        $set: {
          isDeleted: false
        },
        $currentDate: { lastModified: true },
      },
      { new: true, useFindAndModify: false }
    );
    return res.status(200).json({
      message: "Account successfully closed",
      data: { data },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchAllVirtualAccounts = async (req, res) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.SECRETE_KEY,
    });
    const allVirtualAccounts = await instance.virtualAccounts.all();
    const ViewVirtualAccounts = await virtualAccountModel.find();
    return res.status(200).json({virtualAccounts: ViewVirtualAccounts});
  } catch (error) {
      console.log(error);
    return res.status(400).json({ error: "Bad Request" });
  }
};

// exports.fetchVirtualAccountById = async (req, res) => {
//   virtualAccountModel.findById(req.params.paymentId).exec((err, data) => {
//     if (err) {
//       return res.status(404).json({ error: "No Orders Found" });
//     } else {
//       request(
//         `https://${process.env.KEY_ID}:${process.env.SECRETE_KEY}@api.razorpay.com/v1/virtual_accounts/${req.params.paymentId}`,
//         function (error, response, body) {
//           if (error) {
//             res.status(500).json({ error: "Internal server error" });
//           }
//           const result = JSON.parse(body);
//           console.log("RESULT:", result);
//           return res.status(200).json(result);
//         }
//       );
//     }
//   });
// };


// exports.paymentCallback = async (req, res) => {
//   try {
//     // const secret = '12345678'
//     const form = Formidable();
//     form.parse(req, (err, fields, files) => {
//       if (fields) {
//         console.log("FIELDS", fields);

//         const hash = createHmac("sha256", process.env.SECRETE_KEY)
//           .update(orderId + "|" + fields.razorpay_payment_id)
//           .digest("hex");

//         if (fields.razorpay_signature === hash) {
//           // store details in DB
//           // const info = {
//           //   _id: fields.razorpay_payment_id,
//           //   razorpay_order_id: fields.razorpay_order_id,
//           // };
//           // const virtualAccount = new virtualAccountModel({
//           //   _id: info._id,
//           //   orders: info.razorpay_order_id,
//           // });

//           // virtualAccount.save((err, data) => {
//           //   if (err) {
//           //     res.status(400).json({ error: "Not able to save in DB" });
//           //   } else {
//           //     res.redirect(
//           //       `${process.env.FRONTEND}/payment/status/${fields.razorpay_payment_id}`
//           //     );
//           //   }
//           // });
//         }
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.webHook = async(req,res) => {
  
}
exports.makePayment = async(req,res) => {

}