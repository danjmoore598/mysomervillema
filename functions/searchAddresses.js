const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

if(!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

module.exports = (request, response) => {
    return cors(request, response, async () => {
        const searchText = request.query.text;

        if (!searchText) {
            response.status(400).send({ error: 'Search text is required!' });
            return;
        }

        const numberMatch = searchText.match(/\d+/);
        const streetNumber = numberMatch ? parseInt(numberMatch[0]) : null;
        const streetName = searchText.replace(streetNumber.toString(), '').trim();

        let query = db.collection('addresses');

        if (streetName) {
            query = query.where('Street Name', '==', streetName);
        }

        // We only query based on the "Range Number- Low" for now.
        if (streetNumber) {
            query = query.where('Range Number- Low', '<=', streetNumber);
        }

        try {
            const querySnapshot = await query.get();
            let addresses = [];
            querySnapshot.forEach(doc => {
                const address = doc.data();

                // Filter on the server-side based on "Range Number- High".
                if (!streetNumber || (address['Range Number- High'] && address['Range Number- High'] >= streetNumber)) {
                    addresses.push(address);
                }
            });

            response.set('Access-Control-Allow-Origin', '*');
            response.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
            response.set('Access-Control-Allow-Headers', '*');
            response.send({ data: addresses });
        } catch (error) {
            console.error("Error fetching addresses: ", error);
            response.status(500).send({ error: 'Failed to fetch addresses' });
        }
    });
};
