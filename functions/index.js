const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const engines = require('consolidate');
const { constructConfig, getDataFromDB } = require('./util');

admin.initializeApp(functions.config().firebase);

const app = express();
const db = admin.firestore();

app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.post('/shorten', async (request, response) => {
    try {
        const { urls } = request.body;
        if (Array.isArray(urls) && urls.length >0) {
            const data = constructConfig(urls);
            const ref = await db.collection('links').add(data);
            const obj = await ref.get();

            response.json({
                id: ref.id,
                data: obj.data()
            });
        } else {
            response.status(400).send('urls should be of type array and not empty');
        }
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get('/open', async (request, response) => {
    try {
        const {
            aliasLink,
            passCode
        } = request.query;
        const ref = await db.collection('links');
        const data = await getDataFromDB(ref, aliasLink, passCode);
        const links = data.link;
        response.render('open', {links});
        // response.json(data);
    } catch(error) {
        response.status(500).send(error);
    }
});

exports.app = functions.https.onRequest(app);
