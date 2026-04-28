const cloudinary = require('cloudinary').v2;

const combos = [];
const p7s = ['I', 'l', '1', 'i'];
const p12s = ['I', 'l', '1', 'i'];
const p23s = ['O', '0', 'o'];
const p24s = ['s', 'S'];
const p27s = ['k', 'K'];

for (let p7 of p7s) {
    for (let p12 of p12s) {
        for (let p23 of p23s) {
            for (let p24 of p24s) {
                for (let p27 of p27s) {
                    combos.push(`dHC2FT${p7}TYqY${p12}U2YGdjneHd${p23}${p24}FG${p27}`);
                }
            }
        }
    }
}

console.log('Testing', combos.length, 'combinations...');

async function testSecret(secret) {
    cloudinary.config({
        cloud_name: 'dvtwcbaoh',
        api_key: '955453852188325',
        api_secret: secret
    });
    try {
        await cloudinary.api.ping();
        return secret;
    } catch (e) {
        return null;
    }
}

(async () => {
    let batchSize = 10;
    for (let i = 0; i < combos.length; i += batchSize) {
        const batch = combos.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(testSecret));
        const found = results.find(r => r !== null);
        if (found) {
            console.log('FOUND SECRET:', found);
            process.exit(0);
        }
    }
    console.log('NONE WORKED');
    process.exit(1);
})();
