const nanoid = require('nanoid');

function constructConfig(urls) {
    let data = {
        link: urls,
        adminPassCode: nanoid(5),
        genPassCode: nanoid(5),
        aliasLink: nanoid(5)
    };
    return data;
}

function getDataFromDB(ref, aliasLink, passCode) {
    return new Promise(async (resolve) => {
        const adminQueryRef = await ref.where('aliasLink', '==', aliasLink).where('adminPassCode', '==', passCode).get();
        const genQueryRef = await ref.where('aliasLink', '==', aliasLink).where('genPassCode', '==', passCode).get();
        if (genQueryRef.size > 0) {
            genQueryRef.forEach((doc) => {
                resolve(doc.data());
            });
        } else if (adminQueryRef.size > 0) {
            adminQueryRef.forEach((doc) => {
                resolve(doc.data());
            });
        }
    });
}

module.exports = {
    constructConfig,
    getDataFromDB
};
