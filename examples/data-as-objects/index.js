import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";
import { debounceSearchRender } from "../../src/";

class Example extends React.Component {

  render() {

    const columns = [
      {
        name: "name",
        label: "Name11",
        options: {
          filter: true,
          //display: 'excluded',
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
          customBodyRenderLite: (dataIndex, rowIndex) => {
            //console.dir(value);
            //console.dir(tableMeta);
            //console.dir(updateValue);
            return <div style={{fontWeight:'bold'}}>Hi {data[dataIndex].name}!</div>;
          },
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
          filter: true,
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone.fake",
        label: "Not a Phone #",
        options: {
          filter: false,
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone2.cell",
        label: "Cell Phone",
        options: {
          filter: false,
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone3.home",
        label: "Not An Attribute",
        options: {
          filter: false,
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone4.home",
        label: "Not An Attribute",
        options: {
          filter: false,
          setCellProps: () => ({style:{whiteSpace:'pre'}}),
          setCellHeaderProps: () => ({style:{whiteSpace:'pre'}}),
        }
      },
      {
        name: "phone4.home",
        label: "Not An Attribute",
        options: {
          filter: false,
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

    const rand = (size) => {
      return Math.floor( Math.random() * size );
    };

    const firstNames = ['Adam', 'Jack', 'Edward', 'Donna', 'Sarah', 'Suzie', 'Sam', 'RJ', 'Henry', 'Ryan', 'Ricky', 'James'];
    const lastNames  = ['Ronson', 'Johnson', 'Jackson', 'Campo', 'Edwards', 'Brown', 'Green', 'White', 'Simmons', 'Gates', 'Jobs'];
    const titles = ['Owner', 'Unemployed', 'Burger Flipper', 'Coder', 'Business Analyst', 'Attorney', 'Consultant', 'Singer','Painter'];
    const locations = ['New York', 'El Paso', 'DC', 'Dallas', 'Santa Ana','St. Petersburg', 'London','Paris'];
    const salarys = ['$100,000', '$50,000', '$75,000', '$80,000'];

    for (var ii = 0; ii < 3000; ii++) {
      data.push({
        name: firstNames[ rand(firstNames.length)] + ' ' + lastNames[ rand(lastNames.length) ],
        title: titles[ rand(titles.length)],
        location: locations[ rand(locations.length) ],
        salary: salarys[ rand(salarys.length )],
      });
    }
console.dir(debounceSearchRender);
    const options = {
      filter: true,
      rowsPerPage: 100,
      rowsPerPageOptions: [10,100,200,500],
      filterType: 'dropdown',
      displayMode: 'scroll',//stacked
      tableBodyHeight: '400px',
      customSearchRender: debounceSearchRender(1500),
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    );

  }
}

export default Example;
