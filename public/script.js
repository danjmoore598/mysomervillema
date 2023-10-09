document.getElementById('searchInput').addEventListener('input', function(e) {
    let searchText = e.target.value;

    if (searchText.length > 2) {
        fetch(`https://us-central1-mysomervillema.cloudfunctions.net/searchAddresses?text=${searchText}`)
        .then(response => {
            console.log('Raw Response:', response);  // Debugging log
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Received Data:', data);  // Log the received data
            displaySuggestions(data.data || []);
        })
        .catch(error => {
            displayError(error.message);
        });
    } else {
        clearSuggestions();
    }
});

function displaySuggestions(data) {
    const suggestionsEl = document.getElementById('suggestions');
    suggestionsEl.innerHTML = '';

    data.forEach(address => {
        let div = document.createElement('div');
        div.textContent = address["Street Name"];
        div.onclick = () => displayAddressDetails(address);
        suggestionsEl.appendChild(div);
    });
}

function clearSuggestions() {
    document.getElementById('suggestions').innerHTML = '';
}

function displayAddressDetails(address) {
    const detailsEl = document.getElementById('addressDetails');
    detailsEl.innerHTML = `
        Street Name: ${address["Street Name"]}<br>
        Range Number- Low: ${address["Range Number- Low"]}<br>
        Range Number- High: ${address["Range Number- High"]}<br>
        Zip Code: ${address["Zip Code"]}<br>
        Ward Number: ${address["Ward Number"]}<br>
        Precinct Number: ${address["Precinct Number"]}<br>
    `;
}

function displayError(errorMessage) {
    const errorEl = document.createElement('div');
    errorEl.textContent = errorMessage;
    document.body.appendChild(errorEl);
}

function fetchInitialAddresses() {
    fetch(`https://us-central1-mysomervillema.cloudfunctions.net/searchAddresses?text=5%20COONEY%20ST`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displaySuggestions(data.data || []);
    })
    .catch(error => {
        displayError(error.message);
    });
}

// Invoke the initial address fetching on page load
window.onload = fetchInitialAddresses;
