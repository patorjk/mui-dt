import React from 'react';
import { useDrag } from 'react-dnd';

function TableHeadCellLabel(props) {
  const [{isDragging}, drag] = useDrag({
    item: { type: 'TABLE_HEAD_CELL_LABEL' },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab',
      }}
    >
      {props.children}
    </div>
  );
}

export default TableHeadCellLabel;