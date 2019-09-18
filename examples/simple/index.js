import React from "react";
import ReactDOM from "react-dom";
import MUIDataTable from "../../src/";

class Example extends React.Component {

  render() {

    const columns = ["Name", "Title", "Location"];

    const data = [
      ["Gabby George", "Business Analyst", "Minneapolis"],
      ["Aiden Lloyd", "Business Consultant", "Dallas"],
      ["Jaden Collins", "Attorney", "Santa Ana"],
      ["Franky Rees", "Business Analyst", "St. Petersburg"],
      ["Aaren Rose", null, "Toledo"],

      ["Jack Jackson", "Business Analyst", "El Paso"],
      ["Joe Campo", "Computer Programmer", "Severna Park"],
      ["Justin Gerock", "Rock Star", "Seattle"],
      ["Jim Gillespie", "Physicist", "Ellicott City"],
      ["Patti Gillespie", "Physicist", "Ellicott City"],

      ["Carl Adkins", "Donut Shop Owner", "Severna Park"],
    ];


    const options = {
      filter: true,
      filterType: 'dropdown',
      displayMode: 'stacked',
    };

    return (
      <MUIDataTable title={"ACME Employee list"} data={data} columns={columns} options={options} />
    );

  }
}

export default Example;
