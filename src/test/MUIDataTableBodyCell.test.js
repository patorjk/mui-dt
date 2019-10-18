import React from 'react';
import { spy, stub } from 'sinon';
import { mount, shallow } from 'enzyme';
import { assert, expect, should } from 'chai';
import textLabels from '../src/textLabels';
import TableBodyCell from '../src/components/TableBodyCell';

describe('<TableBodyCell />', function() {
  let classes;

  before(() => {
    classes = {
      root: {},
    };
  });

  it('should trigger onCellClick prop callback when clicking cell', () => {
    const options = { sort: true, textLabels, onCellClick: spy() };

    const fullWrapper = mount(
      <TableBodyCell
        options={options}
        colIndex={0}
        rowIndex={0}
        dataIndex={0}
        print={false}
        columnHeader="Header"
        onCellClick={options.onCellClick}
        classes={classes}>
        some content
      </TableBodyCell>,
    );

    // The test should click on both TDs that are rendered, but only 1 onCellClick
    // should fire because the first TD represents the column header (due to responsive design).
    fullWrapper.find('td').forEach(item => {
      item.simulate('click');
    });

    assert.strictEqual(options.onCellClick.callCount, 1);

  });
});
