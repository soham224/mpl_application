import { request } from "../../../../../utils/APIRequestService";
import {HttpRequest} from "../../../../../enums/http.methods";

export const ADD_VEHICLE_DETAILS = "/add_vehicle_details";
export const GET_ALL_VEHICLE_DETAILS = "/get_all_vehicle_details";
export const GET_SPEED_DETAILS = "/get_number_plate_details";
export const GET_VEHICLE_DETAILS_BY_NUMBER_PLATE = '/get_vehicle_details_by_number_plate';
export const GET_VEHICLE_DETAILS_BY_ID = "/get_vehicle_details_by_id";

export const UPDATE_VEHICLE_DETAILS="/update_vehicle_details";
export const UPDATE_VEHICLE_DETAILS_STATUS="/update_vehicle_status"
export const UPLOAD_VEHICLE_DETAIL="/upload_vehicle_details"


export function addVehicleDetails(data) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data'},
    endpoint: ADD_VEHICLE_DETAILS,
    method: HttpRequest.POST,
    body: data,
  });
}


export async function getAllVehicleDetails() {
  return await request({
    endpoint: GET_ALL_VEHICLE_DETAILS ,
    method:HttpRequest.GET,
  });
}


export function getSpeedDetails(data) {
  return request({
    endpoint: GET_SPEED_DETAILS,
    method: HttpRequest.POST,
    body: data,
  });
}

export function getVehicleDetailsByNumberPlate(numberPlate) {
  return request({
    endpoint: GET_VEHICLE_DETAILS_BY_NUMBER_PLATE +`?number_plate=${numberPlate}`,
    method: HttpRequest.GET,
  });
}

export function getVehicleDetailsById(vehicleId) {
  return request({
    endpoint: GET_VEHICLE_DETAILS_BY_ID +`?vehicle_id=${vehicleId}`,
    method: HttpRequest.GET,
  });
}

export function updateVehicleDetails(data,vehicleId) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data'},
    endpoint: UPDATE_VEHICLE_DETAILS +`?vehicle_id=${vehicleId}`,
    method: HttpRequest.POST,
    body: data,

  });
}


export function updateVehicleDetailsStatus(vehicleId,vehicleStatus) {
  return request({
    endpoint: UPDATE_VEHICLE_DETAILS_STATUS +`?vehicle_details_id=${vehicleId}&vehicle_details_status=${vehicleStatus}`,
    method: HttpRequest.POST,
  });
}



export function uploadVehicleDetails(body) {
  return request({
    endpoint: UPLOAD_VEHICLE_DETAIL ,
    method: HttpRequest.POST,
    body: body,
  });
}


