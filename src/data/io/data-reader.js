const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

/**
 * Reads in CSV data for use in generating a solution.
 */
class DataReader {
    /**
     * Creates an instance of DataReader.
     * 
     * @param {string} filePath - The path to the CSV file.
     */
    constructor(filePath) {
        this.filePath = filePath;
        this._parsedData = null;
        this.readAndParseCSV(filePath);
    }

    /**
     * Gets the parsed data.
     * 
     * @returns {Array<Object>} The parsed data.
     */
    get parsedData() {
        return this._parsedData;
    }

    /**
     * Gets the keys of the parsed data.
     * 
     * @returns {Array<string>} The keys of the parsed data.
     */
    get keys() {
        if (this._parsedData && this._parsedData.length > 0) {
            return Object.keys(this._parsedData[0]);
        }
        return [];
    }

    /**
     * Reads and parses the CSV file.
     * 
     * @param {string} filePath - The path to the CSV file.
     */
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

    /**
     * Sets the parsed data.
     * 
     * @param {Object} results - The results from parsing the CSV file.
     */
    parsed(results) {
        this._parsedData = results.data; // Set the private property
    }
}

module.exports = DataReader;
