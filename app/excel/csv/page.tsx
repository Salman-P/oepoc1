'use client'
import { useState, useEffect } from 'react';
import Papa from 'papaparse';  // Importing the PapaParse library to handle CSV parsing

interface CsvRow {
  [key: string]: string;  // Allows dynamic keys for each row based on the CSV headers
}

export default function CsvPage() {
  const [data, setData] = useState<CsvRow[]>([]);  // Declaring a state variable 'data' to store parsed CSV data

  useEffect(() => {
    // Define an async function that fetches and parses the CSV file
    const fetchCsv = async () => {
      const response = await fetch('/Sample_PositionsData_v02 - Positions.csv');  // Fetching the CSV file from the 'public' directory
      const reader = response.body?.getReader();  // Reading the file's response stream
      const decoder = new TextDecoder('utf-8');  // Decoding the file content from binary to text
      const result = await reader?.read();  // Reading the content from the stream

      if (result?.value) {
        const csv = decoder.decode(result.value);  // Decoding the content into a readable string
        const parsedData = Papa.parse<CsvRow>(csv, { header: true });  // Parsing the CSV string using PapaParse, with headers
        setData(parsedData.data);  // Setting the parsed data into the 'data' state
      }
    };

    fetchCsv();  // Calling the fetchCsv function to load the CSV data when the component is mounted
  }, []);

  // Rendering the parsed CSV data in an unordered list
  return (
    <div>
      <h1>CSV Data</h1>
      <ul>
        {data.map((row, index) => (
          <li key={index}>{JSON.stringify(row)}</li>  // Converting each row object to a JSON string and displaying it
        ))}
      </ul>
    </div>
  );
}
