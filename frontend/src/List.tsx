import React from 'react';

export interface ListProps {
  items: [ID, BookData][],
}

const List: React.FC<ListProps> = (props) => {
  return (
    <ul>
      {
        props.items.map(([id, data]) => {
          return (
            <li key={id}>{data.title}</li>
          )
        })
      }
    </ul>
  )
};

export default List;
