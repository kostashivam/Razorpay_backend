const express = require("express");
const router = express.Router();

const {
  virtual_accounts,
  closeVirtualAccount,
  fetchAllVirtualAccounts,
  fetchVirtualAccountById
} = require("../controller/virtualAccountController");

router.post("/virtual_accounts", virtual_accounts);
router.post("/virtual_accounts/:_id", closeVirtualAccount);
router.get('/all_virtual_accounts/callback',fetchAllVirtualAccounts)
router.get("/virtual_accounts/:paymentId", fetchVirtualAccountById);

module.exports = router;
