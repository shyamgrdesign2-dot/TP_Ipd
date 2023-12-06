import PlaceholderApiProvider from "../serviceProviders/PlaceholderApiProvider";

class AppointmentsService extends PlaceholderApiProvider {
  async search(query) {
    return this.api.post(
      `/api/v1/appointment/searchPatient`,
      {
        search: query,
      }
    );
  }

  async getProfile() {
    return this.api.get(`/api/v1/appointment/showProfile`,);
  }
}

const appointmentsService = new AppointmentsService();
export default appointmentsService;
