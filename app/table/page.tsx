'use client';
import { useState, useEffect } from 'react';
import Papa from 'papaparse';  // Importing the PapaParse library to handle CSV parsing
import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

interface CsvRow {
  [key: string]: string;  // Allows dynamic keys for each row based on the CSV headers
}

export default function CsvPage() {
  const [data, setData] = useState<CsvRow[]>([]);  // Declaring a state variable 'data' to store parsed CSV data
  const [expandedRows, setExpandedRows] = useState<any[] | DataTableExpandedRows>([]);
  const [allExpanded, setAllExpanded] = useState(false);

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

  const toggleAll = () => {
    if (allExpanded) collapseAll();
    else expandAll();
  };

  const expandAll = () => {
    let _expandedRows = {} as { [key: string]: boolean };
    data.forEach((row) => (_expandedRows[`${row.Position}`] = true));

    setExpandedRows(_expandedRows);
    setAllExpanded(true);
  };

  const collapseAll = () => {
    setExpandedRows([]);
    setAllExpanded(false);
  };

  const rowExpansionTemplate = (rowData: CsvRow) => {
    return (
      <div className="orders-subtable">
        <h5>Details for {rowData.Position}</h5>
        <ul>
          {Object.entries(rowData).map(([key, value]) => (
            <li key={key}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const header = <Button icon={allExpanded ? 'pi pi-minus' : 'pi pi-plus'} label={allExpanded ? 'Collapse All' : 'Expand All'} onClick={toggleAll} className="w-11rem" />;

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Row Expand</h5>
          <DataTable value={data} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} responsiveLayout="scroll" rowExpansionTemplate={rowExpansionTemplate} dataKey="Position" header={header}>
            <Column expander style={{ width: '3em' }} />
            {Object.keys(data[0] || {}).map((key) => (
              <Column key={key} field={key} header={key} sortable />
            ))}
          </DataTable>
        </div>
      </div>
    </div>
  );
}
