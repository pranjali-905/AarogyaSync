const facilityService = require('../services/facilityService');
const inventoryService = require('../services/inventoryService');
const { success } = require('../utils/apiResponse');

const getFacilities = async (req, res, next) => {
  try {
    const facilities = await facilityService.getFacilities(req.query);
    return success(res, facilities, 'Facilities retrieved successfully');
  } catch (err) {
    next(err);
  }
};

const getFacilityById = async (req, res, next) => {
  try {
    const facility = await facilityService.getFacilityById(req.params.id);
    return success(res, facility, 'Facility details retrieved');
  } catch (err) {
    next(err);
  }
};

const getFacilityInventory = async (req, res, next) => {
  try {
    const inventory = await facilityService.getFacilityInventory(req.params.id);
    return success(res, inventory, 'Facility inventory stock retrieved');
  } catch (err) {
    next(err);
  }
};

const getMedicineAvailability = async (req, res, next) => {
  try {
    const availability = await inventoryService.getMedicineAvailability(req.query);
    return success(res, availability, 'Medicine availability across facilities retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFacilities,
  getFacilityById,
  getFacilityInventory,
  getMedicineAvailability
};
