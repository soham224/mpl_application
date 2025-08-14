import { HttpRequest } from "../../../../../enums/http.methods";
import { request } from "../../../../../utils/APIRequestService";

const GET_RESULT_FOR_WHATSAPP  = "/get_result_for_wp";
const SEND_WHATSAPP_MESSAGE  = "/send_wp_message";

export async function getResultForWhatsapp(PageNumber , pageSize) {
  return await request({
    endpoint: GET_RESULT_FOR_WHATSAPP +"?page_number="+PageNumber+ "&page_size="+pageSize,
    method: HttpRequest.POST,
  });
}

export async function sendWhatsappMessaage(body,company_id) {
  return await request({
    endpoint: SEND_WHATSAPP_MESSAGE + "?company_id="+company_id,
    method: HttpRequest.POST,
    body: JSON.stringify(body),

  });
}