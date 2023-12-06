import PlaceholderApiProvider from "../serviceProviders/PlaceholderApiProvider";

class AppointmentsService extends PlaceholderApiProvider {
  async getProfile() {
    return this.api.get(`/api/v1/appointment/showProfile`,);
  }
}

const appointmentsService = new AppointmentsService();
export default appointmentsService;
