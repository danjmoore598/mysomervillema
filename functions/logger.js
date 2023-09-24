// logger.js
module.exports = {
    logToConsole: function(message) {
        console.log(message);
    },
    logToPage: function(message, elementId = 'errorDisplay') {
        const displayElement = document.getElementById(elementId);
        displayElement.innerHTML = message;
    },
    logError: function(errMessage) {
        this.logToConsole(`Error: ${errMessage}`);
        this.logToPage(`Failed to fetch: ${errMessage}`);
    }
};
