const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

class DataReader {
    constructor(filePath) {
        this.filePath = filePath;
        this._parsedData = null;
        this.readAndParseCSV(filePath);
    }

    get parsedData() {
        return this._parsedData;
    }

    get keys() {
        if (this._parsedData && this._parsedData.length > 0) {
            return Object.keys(this._parsedData[0]);
        }
        return [];
    }

    readAndParseCSV(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            const results = Papa.parse(data, {
                header: true,
                skipEmptyLines: true,
            });
            this.parsed(results);
        } catch (err) {
            console.error('Error reading the file:', err);
        }
    }

    parsed(results) {
        this._parsedData = results.data; // Set the private property
    }
}

module.exports = DataReader;
