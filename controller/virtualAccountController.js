const Razorpay = require("razorpay");
const virtualAccountModel = require("../model/virtualAccountModel");
const fetch = require("node-fetch");

// API FOR CREATE VIRTUAL ACCOUNT
const virtual_accounts = async (req, res) => {
  try {
    const { customer_name, description } = req.body;
    if (req.body != "") {
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
      return res.status(201).json({ data: vaccount });
    } else {
      return res.status(404).json({ Invalid: "Invalid field" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({ message: "Bad Request Error" });
  }
};

// API FOR CLOSE VIRTUAL ACCOUNT
const closeVirtualAccount = async (req, res) => {
  try {
    let account_id = req.params.account_id;
    if (account_id) {
      let url = `${process.env.RAZORPAY_URL}/virtual_accounts/${account_id}/close`;
      let resp = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${process.env.TOKEN}`,
        },
      });
      return res.status(200).json(resp);
    } else {
      return res.status(404).json({ error: "Account Id is not found" });
    }
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
    if (true) {
      const allVirtualAccounts = await instance.virtualAccounts.all();
      return res.status(200).json({ virtualAccounts: allVirtualAccounts });
    } else {
      return res.status(404).json({ error: "Not found data" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
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

    if (virtual_id) {
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
      console.log(data);
      return res.status(200).json({
        message: "Updated amount",
        data: data,
      });
    } else {
      return res.status(404).json({ Invalid: "Invalid virutal id" });
    }
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
