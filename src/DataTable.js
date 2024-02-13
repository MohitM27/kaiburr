import React, { useState } from "react";
import { Form } from "react-bootstrap";
import DataTable from "react-data-table-component";

const DataTableComponent = ({ data, columns, onSelectRow }) => {
  const [searchText, setSearchText] = useState("");
  const handleChange = ({ selectedRows }) => {
    onSelectRow(selectedRows);
  };
  const filteredData = data.filter((row) => {
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    );
  });
  return (
    <DataTable
      title="User List"
      columns={columns}
      data={filteredData}
      selectableRows
      pagination
      onSelectedRowsChange={handleChange}
      subHeader
      subHeaderComponent={
        <div>
          <Form.Control
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      }
    />
  );
};

export default DataTableComponent;
