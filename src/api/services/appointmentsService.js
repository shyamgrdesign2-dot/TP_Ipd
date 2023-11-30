import PlaceholderApiProvider from "../serviceProviders/PlaceholderApiProvider";

class AppointmentsService extends PlaceholderApiProvider {
  async getAll(startDate, endDate, pageNo) {
    return this.api.post(
      `/api/v1/appointment/listAppointment`,
      {
        startDate: startDate,
        endDate: endDate,
        apStatue: 0,
        filterVisitType: "14",
        page: pageNo,
      }
    );
  }

  async getById(id) {
    return this.api.get(`/${id}`);
  }
}

const appointmentsService = new AppointmentsService();
export default appointmentsService;
