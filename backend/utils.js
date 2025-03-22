// Checks if we are in daylight savings.
function isDST() {
    const jan = new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset();
    const jul = new Date(new Date().getFullYear(), 6, 1).getTimezoneOffset();
    return Math.min(jan, jul) !== new Date().getTimezoneOffset();
}

function convertUTCToTimeZone(UTCTime, timeZone) {

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
            return UTCTime -10;
        case "SAMOA TIME":
            return - 11;
        case "CHAMORRO TIME":
            return UTCTime + 10;
        default:
            console.log("Invalid Timezone!");
            return UTCTime;
    }
}

function convertTimeToUTC(time, timeZone) {

    const isDayLightSavings = isDST();
    
    switch(timeZone) {
        case "EASTERN TIME":
            if (isDayLightSavings) {
                return time + 4;
            }
            return time + 5;
        case "CENTRAL TIME":
            if (isDayLightSavings) {
                return time + 5;
            }
            return time + 6;
        case "MOUNTAIN TIME":
            if (isDayLightSavings) {
                return time + 6;
            }
            return time + 7;
        case "PACIFIC TIME":
            if (isDayLightSavings) {
                return time + 7;
            }
            return time + 8;
        case "ALASKA TIME":
            if (isDayLightSavings) {
                return time + 8;
            }
            return time + 9;
        case "HAWAII TIME":
            return time -10;
        case "SAMOA TIME":
            return + 11;
        case "CHAMORRO TIME":
            return time - 10;
        default:
            console.log("Invalid Timezone!");
            return time;
    }
}

module.exports = {convertUTCToTimeZone, convertTimeToUTC};