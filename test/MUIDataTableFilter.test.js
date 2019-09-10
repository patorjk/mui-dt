import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { assert } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { spy } from 'sinon';
import TableFilter from '../src/components/TableFilter';
import textLabels from '../src/textLabels';

describe('<TableFilter />', function() {
  let data;
  let columns;
  let filterData;

  beforeEach(() => {
    columns = [
      { name: 'firstName', label: 'First Name', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'company', label: 'Company', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'city', label: 'City Label', display: true, sort: true, filter: true, sortDirection: 'desc' },
      { name: 'state', label: 'State', display: true, sort: true, filter: true, sortDirection: 'desc' },
    ];

    data = [
      ['Joe James', 'Test Corp', 'Yonkers', 'NY'],
      ['John Walsh', 'Test Corp', 'Hartford', 'CT'],
      ['Bob Herm', 'Test Corp', 'Tampa', 'FL'],
      ['James Houston', 'Test Corp', 'Dallas', 'TX'],
    ];

    filterData = [
      ['Joe James', 'John Walsh', 'Bob Herm', 'James Houston'],
      ['Test Corp'],
      ['Yonkers', 'Hartford', 'Tampa', 'Dallas'],
      ['NY', 'CT', 'FL', 'TX'],
    ];
  });

  it('should render label as filter name', () => {
    const options = { filterType: 'checkbox', textLabels };
    const filterList = [[], [], [], []];
    const shallowWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}}/>,
    );
    const labels = shallowWrapper
      .find(Typography)
      .filterWhere(n => n.html().match(/MUIDataTableFilter-checkboxListTitle/))
      .map(n => n.text());
    assert.deepEqual(labels, ['First Name', 'Company', 'City Label', 'State']);
  });

  it("should render data table filter view with checkboxes if filterType = 'checkbox'", () => {
    const options = { filterType: 'checkbox', textLabels };
    const filterList = [[], [], [], []];
    const shallowWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    const actualResult = shallowWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 13);
  });

  it('should render data table filter view with no checkboxes if filter=false for each column', () => {
    const options = { filterType: 'checkbox', textLabels };
    const filterList = [[], [], [], []];
    columns = columns.map(item => (item.filter = false));

    const mountWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    const actualResult = mountWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should render data table filter view with selects if filterType = 'select'", () => {
    const options = { filterType: 'select', textLabels };
    const filterList = [['Joe James'], [], [], []];

    const mountWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    const actualResult = mountWrapper.find(Select);
    assert.strictEqual(actualResult.length, 4);
  });

  it('should render data table filter view no selects if filter=false for each column', () => {
    const options = { filterType: 'select', textLabels };
    const filterList = [['Joe James'], [], [], []];
    columns = columns.map(item => (item.filter = false));

    const mountWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    const actualResult = mountWrapper.find(Select);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should render data table filter view with checkbox selects if filterType = 'multiselect'", () => {
    const options = { filterType: 'multiselect', textLabels };
    const filterList = [['Joe James', 'John Walsh'], [], [], []];

    const mountWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    const actualResult = mountWrapper.find(Select);
    assert.strictEqual(actualResult.length, 4);
  });

  it("should data table custom filter view with if filterType = 'custom' and a valid display filterOption is provided", () => {
    const options = {
      filterType: 'custom',
      textLabels,
      filterOptions: {
        names: [],
        logic(city, filters) {
          return false;
        },
        display: (filterList, onChange, index, column) => (
          <div>
            <TextField id="custom-filter-render">Custom Filter Render</TextField>
          </div>
        ),
      },
    };
    const filterList = [[], [], [], []];
    const mountWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    const actualResult = mountWrapper.find('#custom-filter-render');
    assert.isAtLeast(actualResult.length, 1);
  });

  it("should render column.label as filter label if filterType = 'textField'", () => {
    const options = { filterType: 'textField', textLabels };
    const filterList = [[], [], [], []];
    const shallowWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );
    const labels = shallowWrapper
      .find(TextField)
      .filterWhere(n => n.html().match(/MuiInputLabel-formControl/))
      .map(n => n.text());
    assert.deepEqual(labels, ['First Name', 'Company', 'City Label', 'State']);
  });

  it("should data table filter view with TextFields if filterType = 'textfield'", () => {
    const options = { filterType: 'textField', textLabels };
    const filterList = [[], [], [], []];
    const shallowWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    const actualResult = shallowWrapper.find(TextField);
    assert.strictEqual(actualResult.length, 4);
  });

  it("should data table filter view with no TextFields if filter=false when filterType = 'textField'", () => {
    const options = { filterType: 'textField', textLabels };
    const filterList = [[], [], [], []];
    columns = columns.map(item => (item.filter = false));

    const shallowWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    const actualResult = shallowWrapper.find(TextField);
    assert.strictEqual(actualResult.length, 0);
  });

  it("should data table filter view with checkboxes if column.filterType = 'checkbox' irrespective of global filterType value", () => {
    const options = { filterType: 'textField', textLabels };
    const filterList = [[], [], [], []];
    columns.forEach(item => (item.filterType = 'checkbox'));

    const shallowWrapper = mount(
      <TableFilter 
        columns={columns} 
        filterData={filterData} 
        filterList={filterList} 
        options={options} 
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    const actualResult = shallowWrapper.find(Checkbox);
    assert.strictEqual(actualResult.length, 13);
  });

  it('should trigger onFilterUpdate prop callback when calling method checkbox onchange triggered', () => {
    const options = { filterType: 'checkbox', textLabels };
    const filterList = [[], [], [], []];
    const onFilterUpdate = spy();

    const fullWrapper = mount(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    fullWrapper.find('input[type="checkbox"]').at(0).simulate('change');
    assert.strictEqual(onFilterUpdate.callCount, 1);
  });

  it('should trigger onFilterUpdate prop callback when Select onChange event occurs for dropdown', () => {
    const options = { filterType: 'select', textLabels };
    const filterList = [[], [], [], []];
    const onFilterUpdate = spy();

    const fullWrapper = mount(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    let event = { target: { value: 'Joe James' } };
    fullWrapper.find(Select).at(0).props().onChange(event);
    assert.strictEqual(onFilterUpdate.callCount, 1);

    event = { target: { value: 'All' } };
    fullWrapper.find(Select).at(0).props().onChange(event);
    assert.strictEqual(onFilterUpdate.callCount, 2);

    event = { target: { value: 'Joe James' } };
    fullWrapper.find(Select).at(0).props().onChange(event);
    assert.strictEqual(onFilterUpdate.callCount, 3);
  });

  it('should trigger onFilterUpdate prop callback when Select onChange event occurs for multi-select', () => {
    const options = { filterType: 'multiselect', textLabels };
    const filterList = [[], [], [], []];
    const onFilterUpdate = spy();

    const fullWrapper = mount(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    let event = { target: { value: 'Joe James' } };
    fullWrapper.find(Select).at(0).props().onChange(event);
    assert.strictEqual(onFilterUpdate.callCount, 1);

    event = { target: { value: 'All' } };
    fullWrapper.find(Select).at(0).props().onChange(event);
    assert.strictEqual(onFilterUpdate.callCount, 2);

    event = { target: { value: 'Joe James' } };
    fullWrapper.find(Select).at(0).props().onChange(event);
    assert.strictEqual(onFilterUpdate.callCount, 3);
  });

  it('should trigger onFilterUpdate prop callback when calling onChange for text filter', () => {
    const options = { filterType: 'textField', textLabels };
    const filterList = [[], [], [], []];
    const onFilterUpdate = spy();

    const fullWrapper = mount(
      <TableFilter
        columns={columns}
        onFilterUpdate={onFilterUpdate}
        filterData={filterData}
        filterList={filterList}
        options={options}
        updateFilterByType={() => {}}
        filterPopoverOptions={{}} />,
    );

    let event = { target: { value: 'Joe James' } };
    fullWrapper.find(TextField).at(0).props().onChange(event);
    assert.strictEqual(onFilterUpdate.callCount, 1);

    event = { target: { value: '' } };
    fullWrapper.find(TextField).at(0).props().onChange(event);
    assert.strictEqual(onFilterUpdate.callCount, 2);

    event = { target: { value: 'La la la' } };
    fullWrapper.find(TextField).at(0).props().onChange(event);
    assert.strictEqual(onFilterUpdate.callCount, 3);

  });
});
