const DataReader = require('../data/io/data-reader.js');
const fs = require('fs');
const path = require('path');

// Mock the file system
jest.mock('fs');

describe('DataReader', () => {
    const mockCsvData = 'name,age\nJohn Doe,30\nJane Doe,25';
    const mockFilePath = path.join(__dirname, 'mock-data.csv');

    beforeEach(() => {
        fs.readFileSync.mockClear();
    });

    test('should read data correctly', () => {
        fs.readFileSync.mockReturnValue(mockCsvData);

        const dataReader = new DataReader(mockFilePath);
        expect(dataReader.parsedData).toEqual([
            { name: 'John Doe', age: '30' },
            { name: 'Jane Doe', age: '25' }
        ]);
        expect(dataReader.keys).toEqual(['name', 'age']);
    });
});
