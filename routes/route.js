const express = require("express");
const router = express.Router();
const Constroller = require("../controller/index");

//NOTE - CITYS APIS
router.post("/INTSERT_CITYS", Constroller.INTSERT_CITYS);
router.get("/GET_CITYS", Constroller.CITY_SELECTION);
router.put("/UPDATE_CITYS", Constroller.UPDATE_CITY);

///

//NOTE - VEHICLE APIS
router.post("/INTSERT_VEHICLE", Constroller.INTSERT_CITYS);
router.get("/GET_VEHICLE", Constroller.VEHICLE_SELECTION);
router.put("/UPDATE_VEHICLE", Constroller.UPDATE_VEHICLE);

//NOTE - Capture APIS
router.post("/CAPTURE_FUGITIVE", Constroller.CAPTURE_FUGITIVE);



module.exports = router;