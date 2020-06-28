import moment from 'moment';

const dateTimeHelper = {
    formatDateToStandardForm: (receivedDate,receivedDateFormat,targetDateFormat) => {
        var dateToSendBack="0000-00-00";
        try{
          if (targetDateFormat) {
            dateToSendBack = moment(receivedDate, receivedDateFormat).format(targetDateFormat);
          } else {
            dateToSendBack = moment(receivedDate, receivedDateFormat).format("YYYY-MM-DD");
          }
        }catch(err){
          console.log("in err");
          dateToSendBack="0000-00-00";
        }
        if(dateToSendBack=="Invalid date"){
          console.log("in invalid date");
          dateToSendBack = "0000-00-00";
        }
        console.log("receivedDate : dateToSendBack >> " + receivedDate + " : " + dateToSendBack);
        return dateToSendBack;
    }
  }

  export default dateTimeHelper;
