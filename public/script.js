document.addEventListener("DOMContentLoaded", function() {
    fetchInitialAddresses();
});

document.getElementById('searchInput').addEventListener('input', function(e) {
    let searchText = e.target.value;

    if (searchText.length > 2) {
        fetchAddresses(searchText);
    } else {
        clearSuggestions();
    }
});

function fetchAddresses(searchText) {
    fetch(`https://us-central1-mysomervillema.cloudfunctions.net/searchAddresses?text=${searchText}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.data) {
            displaySuggestions(data.data);
        }
    })
    .catch(error => {
        displayError(error.message);
    });
}

function fetchInitialAddresses() {
    fetch(`https://us-central1-mysomervillema.cloudfunctions.net/searchAddresses?text=`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.data) {
            displaySuggestions(data.data);
        }
    })
    .catch(error => {
        displayError(error.message);
    });
}

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
    detailsEl.innerHTML = `Street Name: ${address["Street Name"]}<br>
    Range Number- Low: ${address["Range Number- Low"]}<br>
    Range Number- High: ${address["Range Number- High"]}<br>
    Zip Code: ${address["Zip Code"]}<br>
    Ward Number: ${address["Ward Number"]}<br>
    Precinct Number: ${address["Precinct Number"]}<br>`;
}

function displayError(message) {
    const detailsEl = document.getElementById('addressDetails');
    detailsEl.innerHTML = `<span style="color:red">${message}</span>`;
}
