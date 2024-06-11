import React from 'react';
import ListItem from './ListItem';

export interface ListProps {
  items: [ID, Book][];
  delete: (id: ID) => Promise<APIResult>;
  update: (id: ID, book: Book) => Promise<APIResult>;
}

const List: React.FC<ListProps> = (props) => {
  return (
    <ul>
      {props.items.map(([id, data]) => {
        return (
          <ListItem
            key={id}
            book={data}
            delete={props.delete}
            update={props.update}
          />
        );
      })}
    </ul>
  );
};

export default List;
