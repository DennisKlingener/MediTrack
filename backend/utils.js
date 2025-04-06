const moment = require("moment");

// Checks if we are in daylight savings.
function isDST() {
    const jan = new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(new Date().getFullYear(), 6, 1).getTimezoneOffset();
    return Math.min(jan, jul) !== new Date().getTimezoneOffset();
}

function modTime(time) {
    if (time > 24) {
        time = (time % 24);
    }
    
    return time;
}

function convertTimeToString(time) {
    if (time > 9) {
        timeString = time.toString();
        formattedTimeString = timeString + ":00:00";
    } else {
        timeString = time.toString();
        formattedTimeString = "0" + timeString + ":00:00";
    }
    
    return formattedTimeString;
}

function convertUTCToTimeZone(UTCTime, timeZone) {

    const isDayLightSavings = true;
    
    console.log("here is isDLV:", isDayLightSavings);
    let newTime;

    // Times 10, 11, or 12
    if (UTCTime.charAt(0) != '0') {
        newTime = UTCTime.substring(0, 2);
    } else {
        newTime = UTCTime.charAt(1);
    }

    let timeNumericalValue = parseInt(newTime, 10);

    switch(timeZone) {
        case "EASTERN TIME":
            if (isDayLightSavings) {
                timeNumericalValue -= 4;
            } else {
                timeNumericalValue -= 5;
            }
            break;
        case "CENTRAL TIME":
            if (isDayLightSavings) {
                timeNumericalValue -= 5;
            } else {
                timeNumericalValue -= 6;
            }
            break;
        case "MOUNTAIN TIME":
            if (isDayLightSavings) {
                timeNumericalValue -= 6;
            } else {
                timeNumericalValue -= 7;
            }
            break;
        case "PACIFIC TIME":
            if (isDayLightSavings) {
                timeNumericalValue -= 7;
            } else {
                timeNumericalValue -= 8;
            }
            break;
        case "ALASKA TIME":
            if (isDayLightSavings) {
                timeNumericalValue -= 8;
            } else {
                timeNumericalValue -= 9;
            }
            break;
        case "HAWAII TIME":
            timeNumericalValue += 10;
            break;
        case "SAMOA TIME":
            timeNumericalValue -= 11;
            break;
        case "CHAMORRO TIME":
            timeNumericalValue += 10;
            break;
        default:
            console.log("Invalid Timezone!");
            return UTCTime;
    }

    if (timeNumericalValue > 12) {
        timeNumericalValue = (timeNumericalValue % 12);
    } else if (timeNumericalValue < 0) {
        timeNumericalValue *= -1;
        timeNumericalValue = (timeNumericalValue >= 12) ? (24 - timeNumericalValue) : (24 - timeNumericalValue) - 12;
    } else if (timeNumericalValue == 0) {
        timeNumericalValue = 12;
    }

    return convertTimeToString(timeNumericalValue);
}

function convertTimeToUTC(time, timeZone, isAM) {

    const isDayLightSavings = true;
    let newTime;

    // Times 10, 11, or 12
    if (time.length > 4) {
        newTime = time.substring(0, 2);
    } else {
        newTime = time.substring(0, 1);
    }

    console.log("here is new time: ", newTime);

    let timeNumericalValue = parseInt(newTime, 10);

    console.log("here is timeNumericalValue: ", timeNumericalValue);

    // If time is PM, add 12.
    if ( ((!isAM) && (timeNumericalValue != 12)) || ((isAM) && (timeNumericalValue == 12)) ) {
        timeNumericalValue = timeNumericalValue + 12;
    }
    
    switch(timeZone) {
        case "EASTERN TIME":
            if (isDayLightSavings) {
                timeNumericalValue += 4;
            } else {
                timeNumericalValue += 5;
            }
            break;
        case "CENTRAL TIME":
            if (isDayLightSavings) {
                timeNumericalValue += 5;
            } else {
                timeNumericalValue += 6;
            }
            break;
        case "MOUNTAIN TIME":
            if (isDayLightSavings) {
                timeNumericalValue += 6;
            } else {
                timeNumericalValue += 7;
            }
            break;
        case "PACIFIC TIME":
            if (isDayLightSavings) {
                timeNumericalValue += 7;
            } else {
                timeNumericalValue += 8;
            }
            break;
        case "ALASKA TIME":
            if (isDayLightSavings) {
                timeNumericalValue += 8;
            } else {
                timeNumericalValue += 9;
            }
            break;
        case "HAWAII TIME":
            timeNumericalValue -= 10;
            break;
        case "SAMOA TIME":
            timeNumericalValue += 11;
            break;
        case "CHAMORRO TIME":
            timeNumericalValue -= 10;
            break;
        default:
            console.log("Invalid Timezone!");
    }

    timeNumericalValue = modTime(timeNumericalValue);
    return convertTimeToString(timeNumericalValue);
}   

module.exports = {convertUTCToTimeZone, convertTimeToUTC};