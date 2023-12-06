import api from './axiosService'

const ApiAppointments = {}

ApiAppointments.getAll = function (params) {
    console.log(params)
    return api.post(`/api/v1/appointment/listAppointment`, params)
}

export default ApiAppointments;