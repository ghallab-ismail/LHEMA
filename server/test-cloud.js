const cloudinary = require('cloudinary').v2;

const combos = [];
const pos6 = ['I', 'l', '1'];
const pos11 = ['I', 'l', 'i', '1'];
const pos22 = ['O', '0', 'o'];

for (let p6 of pos6) {
    for (let p11 of pos11) {
        for (let p22 of pos22) {
            combos.push(`dHC2FT${p6}TYqY${p11}U2YGdjneHd${p22}sFGk`);
        }
    }
}

let found = false;
(async () => {
    for (let secret of combos) {
        cloudinary.config({
            cloud_name: 'dvtwcbaoh',
            api_key: '955453852188325',
            api_secret: secret
        });
        try {
            await cloudinary.api.ping();
            console.log('SUCCESS:', secret);
            found = true;
            break;
        } catch (e) {
            // failed, try next
        }
    }
    if (!found) console.log('NONE WORKED');
})();
