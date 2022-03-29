const express = require("express");
const router = express.Router();

const {
  virtual_accounts,
  closeVirtualAccount,
  fetchAllVirtualAccounts,
  fetchPaymentVirtualAccountById,
  webhook,
} = require("../controller/virtualAccountController");

router.post("/virtual_accounts", virtual_accounts);
router.post("/virtual_accounts/:account_id/close", closeVirtualAccount);
router.get("/all_virtual_accounts/callback", fetchAllVirtualAccounts);
router.get("/virtual_accounts/:virtualId", fetchPaymentVirtualAccountById);
router.post("/webhook", webhook);

module.exports = router;
