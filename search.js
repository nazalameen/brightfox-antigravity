const fs = require('fs');
const path = require('path');

const files = ['index.html', 'style.css', 'app.js'];
const searchTerms = ['chennai', 'central', 'address', 'location', 'road', 'mumbai', 'delhi', 'bangalore'];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${file}`);
        return;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        searchTerms.forEach(term => {
            if (line.toLowerCase().includes(term)) {
                console.log(`[${file}:${index + 1}] (${term}): ${line.trim()}`);
            }
        });
    });
});
