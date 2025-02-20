package data.io;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Reads in the data from a CSV file (data that is created by the results from a
 * form).
 */
public class DataReader {
    private String fileName;
    private File file;
    private List<String> header;
    private List<List<String>> data;

    /**
     * Constructor for a DataReader object (automaticly reads the data in from the
     * given file).
     * 
     * @param fileName the name of the file to read in
     */
    public DataReader(String fileName) {
        this.fileName = fileName;
        this.file = new File(this.fileName);
        readData(file);
        close();
    }

    /**
     * Reads the data from the file that was provided into the header and data
     * attributes.
     * 
     * @param file the file object to read the data from
     */
    private void readData(File file) {
        data = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            boolean isHeader = true;

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                if (isHeader) {
                    header = new ArrayList<>(Arrays.asList(values));
                    isHeader = false;
                } else {
                    data.add(Arrays.asList(values));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * Closes the file.
     */
    public void close() {
        // Method to close any resources if needed
        if (file != null) {
            file = null;
        }
    }

    /**
     * Getter for the header list.
     * 
     * @return 
     */
    public List<String> getHeader() {
        return header;
    }

    /**
     * Getter for the data list.
     * 
     * @return the 2D list of data
     */
    public List<List<String>> getData() {
        return data;
    }
}