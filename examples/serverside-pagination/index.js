import React from "react";
import ReactDOM from "react-dom";
import { CircularProgress, Typography } from '@material-ui/core';
import MUIDataTable from "../../src/";

class Example extends React.Component {

  state = {
    page: 0,
    count: 1,
    rowsPerPage: 5,
    sortField: undefined,
    sortDir: undefined,
    data: [["Loading Data..."]],
    columns: [
      {
        name: "fullName",
        label: "Full Name",
        options: {
          customBodyRender: (value, tableMeta, updateValue) => {
            
            // Here you can render a more complex display.
            // You're given access to tableMeta, which has
            // the rowData (as well as the original object data).
            // See the console for a detailed look at this object.
            
            console.log('customBodyRender');
            console.dir(tableMeta);
            return value;
          }
        },
      },
      {
        name: "title",
        label: "Title",
        options: {},
      },
      {
        name: "location",
        label: "Location",
        options: {},
      },
    ],
    isLoading: false
  };

  componentDidMount() {
    this.getData("", 0);
  }

  // get data
  getData = (url, page) => {
    this.setState({ isLoading: true });
    this.xhrRequest(url, page).then(res => {
      this.setState({ data: res.data, isLoading: false, count: res.total });
    });
  }

  getSrcData = () => {
    return [
      {fullName: "Gabby George", title: "Business Analyst", location: "Minneapolis"},
      {fullName: "Aiden Lloyd", title: "Business Consultant", location: "Dallas"},
      {fullName: "Jaden Collins", title: "Attorney", location: "Santa Ana"},
      {fullName: "Franky Rees", title: "Business Analyst", location: "St. Petersburg"},
      {fullName: "Aaren Rose", title: "Business Analyst", location: "Toledo"},

      {fullName: "John George", title: "Business Analyst", location: "Washington DC"},
      {fullName: "Pat Lloyd", title: "Computer Programmer", location: "Baltimore"},
      {fullName: "Joe Joe Collins", title: "Attorney", location: "Las Cruces"},
      {fullName: "Franky Hershy", title: "Paper Boy", location: "El Paso"},
      {fullName: "Aaren Smalls", title: "Business Analyst", location: "Tokyo"},

      {fullName: "Boogie G", title: "Police Officer", location: "Unknown"},
      {fullName: "James Roulf", title: "Business Consultant", location: "Video Game Land"},
      {fullName: "Mike Moocow", title: "Burger King Employee", location: "New York"},
      {fullName: "Mimi Gerock", title: "Business Analyst", location: "McCloud"},
      {fullName: "Jason Evans", title: "Business Analyst", location: "Mt Shasta"},

      {fullName: "Simple Sam", title: "Business Analyst", location: "Mt Shasta"},
      {fullName: "Marky Mark", title: "Business Consultant", location: "Las Cruces"},
      {fullName: "Jaden Jam", title: "Attorney", location: "El Paso"},
      {fullName: "Holly Jo", title: "Business Analyst", location: "St. Petersburg"},
      {fullName: "Suzie Q", title: "Business Analyst", location: "New York"},
    ];
  }

  sort = (page, sortField, sortDir) => {
    this.setState({ isLoading: true });
    this.xhrRequest("", page, sortField, sortDir).then(res => {
      //console.dir(res);

      var columns = this.state.columns.map(function(col) {
        var myCol = Object.assign({}, col);
        if (myCol.name === sortField) {
          myCol.options = Object.assign({}, myCol.options, {
            sortDirection: sortDir
          });
        } else {
          myCol.options = Object.assign({}, myCol.options);
          delete myCol.options.sortDirection;
        }
        console.log(myCol);
        return myCol;
      });
      console.dir( JSON.parse(JSON.stringify(columns)) );

      this.setState({ 
        data: res.data, 
        page: res.page, 
        sortField, 
        sortDir, 
        isLoading: false, 
        count: res.total,
        columns,
      });
    });
  }

  // mock async function
  xhrRequest = (url, page, sortField, sortDir) => {

    return new Promise((resolve, reject) => {
      // mock page data
      let fullData = this.getSrcData();
      const total = fullData.length;  // mock record count from server - normally this would be a number attached to the return data

      if (sortField) {
        fullData = fullData.sort((a, b) => {
          if (a[sortField] < b[sortField]) {
            return  1 * (sortDir === 'asc' ? -1 : 1);
          } else if (a[sortField] > b[sortField]) {
            return -1 * (sortDir === 'asc' ? -1 : 1);
          } else {
            return 0;
          }
        });
      }

      const srcData = fullData.slice(page * this.state.rowsPerPage, (page+1) * this.state.rowsPerPage);
      let data = srcData;

      setTimeout(() => {
        resolve({
          data, total, page
        });
      }, 500);

    });

  }

  changePage = (page, sortField, sortDir) => {
    this.setState({
      isLoading: true,
    });
    this.xhrRequest(`/myApiServer?page=${page}`, page, sortField, sortDir).then(res => {
      this.setState({
        isLoading: false,
        page: res.page,
        sortField: sortField,
        sortDir: sortDir,
        data: res.data,
        count: res.total,
      });
    });
  };

  render() {

    const { data, page, count, isLoading, rowsPerPage } = this.state;

    const options = {
      filter: true,
      filterType: 'dropdown',
      responsive: 'scroll',
      serverSide: true,
      count: count,
      rowsPerPage: rowsPerPage,
      rowsPerPageOptions: [],
      onTableChange: (action, tableState) => {

        console.log(action, tableState);
        
        // a developer could react to change on an action basis or
        // examine the state as a whole and do whatever they want

        switch (action) {
          case 'changePage':
            this.changePage(tableState.page, this.state.sortField, this.state.sortDir);
            break;
          case 'sort':
            var col = tableState.columns.filter(col => col.sortDirection !== 'none');
            this.sort(tableState.page, col[0].name, col[0].sortDirection);
            break;
          default:
            console.log('action not handled.');
        }
      }
    };

    console.log('COLUMNS');
    console.dir( JSON.parse(JSON.stringify(this.state.columns)) );

    return (
      <div>
        <MUIDataTable title={<Typography variant="h6">
          ACME Employee list
          {isLoading && <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}} />}
          </Typography>
          } data={data} columns={this.state.columns} options={options} />
      </div>
    );

  }
}

export default Example;
