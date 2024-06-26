import React, { useState } from 'react';
import UpdateItemPanel from './UpdateItemPanel';

export interface ListItemProps {
  book: Book;
  delete: (id: ID) => Promise<APIResult>;
  update: (id: ID, book: Book) => Promise<APIResult>;
}

const ListItem: React.FC<ListItemProps> = (props) => {
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <li key={props.book.id}>
      <h2>{props.book.title}</h2>

      <button
        onClick={() => {
          setIsUpdating((isUpdating) => !isUpdating);
        }}
      >
        {isUpdating ? '閉じる' : '編集'}
      </button>

      {isUpdating ? (
        <UpdateItemPanel book={props.book} update={props.update} />
      ) : null}

      <button
        onClick={async () => {
          const result = await props.delete(props.book.id);

          if (result.successful) {
            alert('deleted successfully');
          } else {
            alert(
              `failed to delete item: status ${result.statusCode}, ${result.message}`,
            );
          }
        }}
      >
        削除
      </button>
    </li>
  );
};

export default ListItem;
