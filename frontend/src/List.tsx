import React from 'react';
import ListItem from './ListItem';

export interface ListProps {
  items: [ID, BookData][];
  delete: (id: ID) => Promise<boolean>;
  update: (id: ID, data: BookData) => Promise<boolean>;
}

const List: React.FC<ListProps> = (props) => {
  return (
    <ul>
      {props.items.map(([id, data]) => {
        return (
          <ListItem
            key={id}
            id={id}
            data={data}
            delete={props.delete}
            update={props.update}
          />
        );
      })}
    </ul>
  );
};

export default List;
