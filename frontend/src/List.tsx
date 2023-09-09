import React from 'react';

export interface ListProps {
  items: [ID, BookData][],
}

const List: React.FC<ListProps> = (props) => {
  return (
    <ul>
      {
        props.items.map(([_, data]) => {
          return (
            <li>{data.title}</li>
          )
        })
      }
    </ul>
  )
};

export default List;
