const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

if(!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

module.exports = (request, response) => {
    return cors(request, response, async () => {
        try {
            const searchText = request.query.text;
            if (!searchText) {
                return response.status(400).send({ error: 'Search text is required!' });
            }

            const numberMatch = searchText.match(/\d+/);
            const streetNumber = numberMatch ? numberMatch[0] : null;
            const streetName = searchText.replace(streetNumber, '').trim();
            
            let query = db.collection('addresses');
            if (streetName) {
                query = query.where('Street Name', '==', streetName);
            }
            if (streetNumber) {
                query = query.where('Range Number- Low', '<=', parseInt(streetNumber))
                             .where('Range Number- High', '>=', parseInt(streetNumber));
            }

            const querySnapshot = await query.get();
            const addresses = [];
            querySnapshot.forEach(doc => {
                addresses.push(doc.data());
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
