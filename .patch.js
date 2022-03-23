const fs = require('fs');
const versionType = process.argv[2];


const manifestFile = fs.readFileSync('dist/manifest.json', "utf8");

const manifestJSON = JSON.parse(manifestFile);

function changeVersion(type) {
    if (type) {
        let [major, minor, patch] = manifestJSON.widget.version.split('.');

        if (type === 'major') {
            major = +major + 1;
        }
        if (type === 'minor') {
            minor = +minor + 1;
        }
        if (type === 'patch') {
            patch = +patch + 1;
        }

        manifestJSON.widget.version = `${ major }.${ minor }.${ patch }`;
        fs.writeFileSync('dist/manifest.json', JSON.stringify(manifestJSON, null, '\t'), "utf8");

        console.log(`Новая версия проекта: ${ manifestJSON.widget.version }`);
    }
}

changeVersion(versionType);