const Razorpay = require("razorpay");
const virtualAccountModel = require("../model/virtualAccountModel");
const fetch = require("node-fetch");

// API FOR CREATE VIRTUAL ACCOUNT
const virtual_accounts = async (req, res) => {
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
      customer_id: process.env.CUSTOMER_ID,
      close_by: 1681615838,
      notes: {
        project_name: "Banking Software",
      },
    });
    const createVirtualAccounts = new virtualAccountModel({
      _id: virtualAccount.id,
      customer_id: process.env.CUSTOMER_ID,
      customer_name: customer_name,
      description: description,
    });
    const vaccount = await createVirtualAccounts.save();
    // console.log("vaccount", vaccount);
    return res.status(201).json({ data: vaccount });
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({ message: "Bad Request Error" });
  }
};

// API FOR CLOSE VIRTUAL ACCOUNT
const closeVirtualAccount = async (req, res) => {
  try {
    let account_id = req.params.account_id;
    let url = `${process.env.RAZORPAY_URL}/virtual_accounts/${account_id}/close`;
    let resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
      },
    });
    return res.status(200).json(resp);
  } catch (error) {
    console.log("err: ", error);
    return res.status(401).json({ error: "Bad Request" });
  }
};

// API FOR FETCH ALL VIRTUAL ACCOUNTS
const fetchAllVirtualAccounts = async (req, res) => {
  try {
    var instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.SECRETE_KEY,
    });
    const allVirtualAccounts = await instance.virtualAccounts.all();
    return res.status(200).json({ virtualAccounts: allVirtualAccounts });
  } catch (error) {
    return res.status(404).json({ error: "Request failed" });
  }
};

// API FOR FETCH VIRTUAL ACCOUNT PAYMENT BY ID
const fetchPaymentVirtualAccountById = async (req, res) => {
  try {
    let virtualId = req.params.virtualId;
    var instance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.SECRETE_KEY,
    });
    if (virtualId) {
      const viewPayments = await instance.virtualAccounts.fetchPayments(
        virtualId
      );
      return res.status(200).json({ response: viewPayments });
    } else {
      return res.status(404).json({ Invalid: "invalid virtual id" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// API FOR WEBHOOK EVENTS
const webhook = async (req, res) => {
  try {
    let virtual_id = req.body.payload.virtual_account.entity.id;
    let amount_paid = req.body.payload.virtual_account.entity.amount_paid;
    let method = req.body.payload.payment.entity.method;

    const data = await virtualAccountModel.findOneAndUpdate(
      { _id: virtual_id },
      {
        $set: {
          amount: amount_paid / 100,
          method: method,
        },
        $currentDate: { lastModified: true },
      },
      { new: true, useFindAndModify: false }
    );
    console.log("data: ", data);
    return res.status(200).json({
      message: "Updated amount",
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  virtual_accounts,
  closeVirtualAccount,
  fetchAllVirtualAccounts,
  fetchPaymentVirtualAccountById,
  webhook,
};
