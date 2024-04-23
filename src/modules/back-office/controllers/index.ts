import { BackOfficeCityController } from "./back-office-city.controller";
import { BackOfficeCountryController } from "./back-office-country.controller";
import { BackOfficeAdminController } from "./back-office-admin.controller";
import { BackOfficeMagnetController } from "./back-office-magnet.controller";

const backOfficeControllers = [
  BackOfficeCountryController,
  BackOfficeCityController,
  BackOfficeAdminController,
  BackOfficeMagnetController,
];
export default backOfficeControllers;
