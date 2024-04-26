import { BackOfficeAdminService } from "./back-office-admin.service";
import { BackOfficeCityService } from "./back-office-city.service";
import { BackOfficeCountryService } from "./back-office-country.service";
import { BackOfficeMagnetService } from "./back-office-magnet.service";

const backOfficeServices = [
  BackOfficeAdminService,
  BackOfficeCityService,
  BackOfficeMagnetService,
  BackOfficeCountryService,
];
export default backOfficeServices;
