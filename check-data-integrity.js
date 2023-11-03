const fs = require('fs');
const path = require('path');

function check_catalog_ids() {
  const d = require('./src/assets/katana-locations.json');
  const duplicates = arr => arr.filter((item, index) => arr.indexOf(item) !== index)
  const dd = duplicates(d.data.map(x => x.id));
  if (dd.length == 0) {
    console.log('All IDs are unique.');
  } else {
    console.error(`Data integrity check failed: ${dd}`);
    process.exit(1);
  }
}

check_catalog_ids();

console.log('Data integrity check passed.');
