import Papa from 'papaparse';

/**
 * Reads in CSV data for use in generating a solution.
 */
export default class DataReader {
    /**
     * Creates an instance of DataReader.
     * 
     * @param {File|string} file - The File object representing the CSV file or a CSV string.
     */
    constructor(file) {
        this._parsedData = null;
        this.readyPromise = new Promise((resolve, reject) => {  
            if (file instanceof File) {
                this.readAndParseCSVFromFile(file, resolve, reject);
            } else if (typeof file === 'string') {
                this.readAndParseCSVFromString(file, resolve, reject);
            } else {
                reject(new Error('Invalid input: must be a File object or a CSV string.'));
            }
        });
    }

    ready() {
        return this.readyPromise;
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
     * Reads and parses the CSV file from a File object.
     * 
     * @param {File} file - The File object.
     */
    readAndParseCSVFromFile(file, resolve, reject) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target.result;
            const results = Papa.parse(data, {
                header: true,
                skipEmptyLines: true,
            });
            this.parsed(results);
            resolve(results)
        };
        reader.onerror = (err) => {
            console.error('Error reading the file:', err);
            reject(err)
        };
        reader.readAsText(file);
    }

    /**
     * Reads and parses the CSV data from a string.
     * 
     * @param {string} data - The CSV string.
     */
    readAndParseCSVFromString(data, resolve, reject) {
        try {
            const results = Papa.parse(data, {
                header: true,
                skipEmptyLines: true,
            });
            this.parsed(results);
            resolve(results);
        } catch (err) {
            console.error('Error parsing the CSV string:', err);
            reject(err);
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
