class HttpStatus extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.mesage = message;
  }
}

const httpStatus = {
  CONTINUE: new HttpStatus(100, "The server has received the request headers and the client should proceed to send the request body"),
  SWITCHING_PROTOCOLS: new HttpStatus(101, "The requester has asked the server to switch protocols"),
  PROCESSING: new HttpStatus(102, "The server is processing the request, but no response is available yet"),
  EARLY_HINTS: new HttpStatus(103, "The server is likely to send a final response with the header fields included in the informational response"),
  OK: new HttpStatus(200, "The request has succeeded"),
  CREATED: new HttpStatus(201, "The request has been fulfilled and a new resource has been created"),
  ACCEPTED: new HttpStatus(202, "The request has been accepted for processing, but the processing has not been completed"),
  NON_AUTHORITATIVE_INFORMATION: new HttpStatus(203, "The server is a transforming proxy that received a 200 OK from its origin, but is returning a modified version of the origin's response"),
  NO_CONTENT: new HttpStatus(204, "The server successfully processed the request, but is not returning any content"),
  RESET_CONTENT: new HttpStatus(205, "The server successfully processed the request, but is not returning any content, and the requester should reset the document view"),
  PARTIAL_CONTENT: new HttpStatus(206, "The server is delivering only part of the resource due to a range header sent by the client"),
  MULTI_STATUS: new HttpStatus(207, "The message body that follows is an XML message and can contain a number of separate response codes, depending on how many sub-requests were made"),
  ALREADY_REPORTED: new HttpStatus(208, "The members of a DAV binding have already been enumerated in a preceding part of the (multistatus) response"),
  IM_USED: new HttpStatus(226, "The server has fulfilled a request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance"),
  MULTIPLE_CHOICES: new HttpStatus(300, "The request has more than one possible response"),
  MOVED_PERMANENTLY: new HttpStatus(301, "The URL of the requested resource has been changed permanently"),
  FOUND: new HttpStatus(302, "The URL of the requested resource has been changed temporarily"),
  SEE_OTHER: new HttpStatus(303, "The response to the request can be found under another URL using a GET method"),
  NOT_MODIFIED: new HttpStatus(304, "The requested resource has not been modified since the last request"),
  USE_PROXY: new HttpStatus(305, "The requested resource is available only through a proxy, the address for which is provided in the response"),
  UNUSED: new HttpStatus(306, "This status code is no longer used, but was previously used to indicate that a requested response must be accessed by a proxy"),
  TEMPORARY_REDIRECT: new HttpStatus(307, "The requested resource has been temporarily moved to another URL"),
  PERMANENT_REDIRECT: new HttpStatus(308, "The requested resource has been permanently moved to another URL"),
  BAD_REQUEST: new HttpStatus(400, "The server cannot or will not process the request due to an apparent client error"),
  UNAUTHORIZED: new HttpStatus(401, "The client must authenticate to get the requested response"),
  FORBIDDEN: new HttpStatus(403, "The server refused to authorize the request"),
  NOT_FOUND: new HttpStatus(404, "The requested resource was not found"),
  METHOD_NOT_ALLOWED: new HttpStatus(405, "The request method is not supported for the requested resource"),
  INTERNAL_SERVER_ERROR: new HttpStatus(500, "The server encountered an internal error"),
  NOT_IMPLEMENTED: new HttpStatus(501, "The server does not support the requested functionality"),
  BAD_GATEWAY: new HttpStatus(502, "The server received an invalid response from an upstream server"),
  SERVICE_UNAVAILABLE: new HttpStatus(503, "The server is temporarily unable to handle the request"),
  GATEWAY_TIMEOUT: new HttpStatus(504, "The server did not receive a timely response from an upstream server"), 
}

export default httpStatus
