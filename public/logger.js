const logger = {
    logError: function(message) {
        const errorElement = document.getElementById('errorDisplay');
        errorElement.textContent = message;
    },

    clearErrors: function() {
        const errorElement = document.getElementById('errorDisplay');
        errorElement.textContent = '';
    }
};

export default logger;
