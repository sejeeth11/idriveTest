import externalConnectors from "../../externalConnectors.json";
import axios from "axios";

 var config = {
  baseURL: externalConnectors.serverIp,
  timeout:50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    token: "",
    Id:"",
    userName:"",
    accountId:"",
    serviceId:""
  }
};



const addHeader = dataObject => {
  config.headers[dataObject.key] = dataObject.value;
};

const executeAxios = function(urlKey, methodType, data, callBack) {

  var finalUrl = externalConnectors.routes[urlKey];
  if(finalUrl  == undefined){
    console.log('Reached Undefien')
    triggerAxios(urlKey, methodType, data, callBack);
  }else{
    triggerAxios(finalUrl, methodType, data, callBack);
  }
};

const triggerAxios = function(url, methodType, data, callBack) {
  if (methodType == "GET") {
    var finalUrl = url + "?" + data;
   // console.log("finalUrl eacrwgerqr >>" + finalUrl);
    axios
      .get(finalUrl, config)
      .then(res => {
        return res.data;
      })
      .then(res => {
        checkIfSessionExpiredOrNot(res, status => {
          callBack(res);
        });
      })
      .catch(ex => {
        callBack('Error');
      });
  } else if (methodType == "GETSLASH") {
    var finalUrl = url+data;
    console.log("finalUrl GETSLASH INSIDE>>" + finalUrl);
    axios
      .get(finalUrl, config)
      .then(res => {
        return res.data;
      })
      .then(res => {
        checkIfSessionExpiredOrNot(res, status => {
          callBack(res);
        });
      })
      .catch(ex => {
        callBack('Error');
      });
  } 
  
  
  
  
  else if (methodType == "POST") {
   
    axios
      .post(url, data, config)
      
      .then(res => {
        return res.data;
      })
      .then(res => {
        checkIfSessionExpiredOrNot(res, status => {
          callBack(res);
        });
      })
      .catch(ex => {
        console.log("parsing failed", ex);
        callBack('Error');
      });
  }
};

const checkIfSessionExpiredOrNot = function(receivedResponse, callback) {
  //console.log("TOken Expired => "+JSON.stringify(receivedResponse))
  if (receivedResponse.STATUS == "TOKEN_EXPIRED") {
    executeImmediateLogout();
  } else {
    callback(true);
  }
};

export default {
  executeAxios,
  addHeader
};
