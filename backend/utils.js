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
        time.toString();
        time = time + ":00:00";
    } else {
        time.toString();
        time = "0" + time + ":00:00";
    }
    
    return time.toString();
}




function convertUTCToTimeZone(UTCTime, timeZone, isAM) {

    const isDayLightSavings = isDST();

    switch(timeZone) {
        case "EASTERN TIME":
            if (isDayLightSavings) {
                return UTCTime - 4;
            }
            return UTCTime - 5;
        case "CENTRAL TIME":
            if (isDayLightSavings) {
                return UTCTime - 5;
            }
            return UTCTime - 6;
        case "MOUNTAIN TIME":
            if (isDayLightSavings) {
                return UTCTime - 6;
            }
            return UTCTime - 7;
        case "PACIFIC TIME":
            if (isDayLightSavings) {
                return UTCTime - 7;
            }
            return UTCTime - 8;
        case "ALASKA TIME":
            if (isDayLightSavings) {
                return UTCTime - 8;
            }
            return UTCTime - 9;
        case "HAWAII TIME":
            return UTCTime + 10;
        case "SAMOA TIME":
            return - 11;
        case "CHAMORRO TIME":
            return UTCTime + 10;
        default:
            console.log("Invalid Timezone!");
            return UTCTime;
    }
}

function convertTimeToUTC(time, timeZone, isAM) {

    const isDayLightSavings = isDST();
    let newTime;

    // Times 10, 11, or 12
    if (time.length > 4) {
        newTime = time.substring(0, 1);
    } else {
        newTime = time.substring(0, 0);
    }

    let timeNumericalValue = parseInt(newTime, 10);

    // If time is PM, add 12.
    if ( ((!isAM) && (timeNumericalValue != 12)) || ((isAM) && (timeNumericalValue == 12)) ) {
        timeNumericalValue = timeNumericalValue + 12;
    }
    
    switch(timeZone) {
        case "EASTERN TIME":
            if (isDayLightSavings) {
                timeNumericalValue + 4;
            } else {
                timeNumericalValue + 5;
            }
            timeNumericalValue = modTime(timeNumericalValue);
            return convertTimeToString(timeNumericalValue);
        case "CENTRAL TIME":
            if (isDayLightSavings) {
                timeNumericalValue + 5;
            } else {
                timeNumericalValue + 6;
            }
            timeNumericalValue = modTime(timeNumericalValue);
            return convertTimeToString(timeNumericalValue);
        case "MOUNTAIN TIME":
            if (isDayLightSavings) {
                timeNumericalValue + 6;
            } else {
                timeNumericalValue + 7;
            }
            timeNumericalValue = modTime(timeNumericalValue);
            return convertTimeToString(timeNumericalValue);
        case "PACIFIC TIME":
            if (isDayLightSavings) {
                timeNumericalValue + 7;
            } else {
                timeNumericalValue + 8;
            }
            timeNumericalValue = modTime(timeNumericalValue);
            return convertTimeToString(timeNumericalValue);
        case "ALASKA TIME":
            if (isDayLightSavings) {
                timeNumericalValue + 8;
            } else {
                timeNumericalValue + 9;
            }
            timeNumericalValue = modTime(timeNumericalValue);
            return convertTimeToString(timeNumericalValue);
        case "HAWAII TIME":
            timeNumericalValue - 10;
            timeNumericalValue = modTime(timeNumericalValue);
            return convertTimeToString(timeNumericalValue);
        case "SAMOA TIME":
            timeNumericalValue + 11;
            timeNumericalValue = modTime(timeNumericalValue);
            return convertTimeToString(timeNumericalValue);
        case "CHAMORRO TIME":
            timeNumericalValue - 10;
            timeNumericalValue = modTime(timeNumericalValue);
            return convertTimeToString(timeNumericalValue);
        default:
            console.log("Invalid Timezone!");
    }
}

module.exports = {convertUTCToTimeZone, convertTimeToUTC};