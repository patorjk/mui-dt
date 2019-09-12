import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

class Example extends React.Component {

  render() {

    const columns = [
      {
        name: "name",
        label: "Name",
        options: {
          filter: true,
          //display: 'excluded',
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
          customBodyRender: (value, tableMeta, updateValue) => {
            console.dir(value);
            console.dir(tableMeta);
            console.dir(updateValue);
          }
        }
      },      
      {
        name: "title",
        label: "Modified Title Label",
        options: {
          filter: true,
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {        
        name: "location",
        label: "Location",
        options: {
          filter: false,
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "age",
        Label: "Age",
        options: {
          filter: true,
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "salary",
        label: "Salary",
        options: {
          filter: true,
          sort: false,
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone.home",
        label: "Home Phone",
        options: {
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone.fake",
        label: "Not a Phone #",
        options: {
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone2.cell",
        label: "Cell Phone",
        options: {
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone3.home",
        label: "Not An Attribute",
        options: {
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone4.home",
        label: "Not An Attribute",
        options: {
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone4.home",
        label: "Not An Attribute",
        options: {
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      }
    ];


    const data = [
      { name: "Gabby George the First of his Name", title: "Business Analyst", location: "Minneapolis", age: 30, salary: "$100,000", phone: { home: '867-5309', cell: '123-4567' } },
      { name: "Aiden Lloyd", title: "Business Consultant", location: "Dallas",  age: 55, salary: "$200,000", phone: { home: '867-5310', cell: '123-4568' } },
      { name: "Jaden Collins", title: "Attorney", location: "Santa Ana", age: 27, salary: "$500,000", phone: { home: '867-5311', cell: '123-4569' } },
      { name: "Franky Rees", title: "Business Analyst", location: "St. Petersburg", age: 22, salary: "$50,000", phone: { home: '867-5312', cell: '123-4569' } },

      { name: "Gabby George the First of his Name", title: "Business Analyst", location: "Minneapolis", age: 30, salary: "$100,000", phone: { home: '867-5309', cell: '123-4567' } },
      { name: "Aiden Lloyd", title: "Business Consultant", location: "Dallas",  age: 55, salary: "$200,000", phone: { home: '867-5310', cell: '123-4568' } },
      { name: "Jaden Collins", title: "Attorney", location: "Santa Ana", age: 27, salary: "$500,000", phone: { home: '867-5311', cell: '123-4569' } },
      { name: "Franky Rees", title: "Business Analyst", location: "St. Petersburg", age: 22, salary: "$50,000", phone: { home: '867-5312', cell: '123-4569' } },

      { name: "Gabby George the First of his Name", title: "Business Analyst", location: "Minneapolis", age: 30, salary: "$100,000", phone: { home: '867-5309', cell: '123-4567' } },
      { name: "Aiden Lloyd", title: "Business Consultant", location: "Dallas",  age: 55, salary: "$200,000", phone: { home: '867-5310', cell: '123-4568' } },
      { name: "Jaden Collins", title: "Attorney", location: "Santa Ana", age: 27, salary: "$500,000", phone: { home: '867-5311', cell: '123-4569' } },
      { name: "Franky Rees", title: "Business Analyst", location: "St. Petersburg", age: 22, salary: "$50,000", phone: { home: '867-5312', cell: '123-4569' } },

      { name: "Gabby George the First of his Name", title: "Business Analyst", location: "Minneapolis", age: 30, salary: "$100,000", phone: { home: '867-5309', cell: '123-4567' } },
      { name: "Aiden Lloyd", title: "Business Consultant", location: "Dallas",  age: 55, salary: "$200,000", phone: { home: '867-5310', cell: '123-4568' } },
      { name: "Jaden Collins", title: "Attorney", location: "Santa Ana", age: 27, salary: "$500,000", phone: { home: '867-5311', cell: '123-4569' } },
      { name: "Franky Rees", title: "Business Analyst", location: "St. Petersburg", age: 22, salary: "$50,000", phone: { home: '867-5312', cell: '123-4569' } },

      { name: "Gabby George the First of his Name", title: "Business Analyst", location: "Minneapolis", age: 30, salary: "$100,000", phone: { home: '867-5309', cell: '123-4567' } },
      { name: "Aiden Lloyd", title: "Business Consultant", location: "Dallas",  age: 55, salary: "$200,000", phone: { home: '867-5310', cell: '123-4568' } },
      { name: "Jaden Collins", title: "Attorney", location: "Santa Ana", age: 27, salary: "$500,000", phone: { home: '867-5311', cell: '123-4569' } },
      { name: "Franky Rees", title: "Business Analyst", location: "St. Petersburg", age: 22, salary: "$50,000", phone: { home: '867-5312', cell: '123-4569' } },

      { name: "Gabby George the Second of his Name", title: "Business Analyst", location: "Minneapolis", age: 30, salary: "$100,000", phone: { home: '867-5309', cell: '123-4567' } },
      { name: "Aiden Lloyd II", title: "Business Consultant", location: "Dallas",  age: 55, salary: "$200,000", phone: { home: '867-5310', cell: '123-4568' } },
      { name: "Jaden Collins Jr", title: "Attorney", location: "Santa Ana", age: 27, salary: "$500,000", phone: { home: '867-5311', cell: '123-4569' } },
      { name: "Franky Rees Jr", title: "Business Analyst", location: "St. Petersburg", age: 22, salary: "$50,000", phone: { home: '867-5312', cell: '123-4569' } },
    ];

    const options = {
      filter: true,
      rowsPerPage: 10,
      filterType: 'dropdown',
      responsive: 'scroll',//stacked
      tableBodyMaxHeight: '600px',
      tableBodyMinHeight: '600px',
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    );

  }
}

export default Example;
