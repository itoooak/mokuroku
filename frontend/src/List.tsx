import React from 'react';

export interface ListProps {
  items: [ID, BookData][],
  delete: (id: ID) => Promise<boolean>,
}

const List: React.FC<ListProps> = (props) => {
  return (
    <ul>
      {
        props.items.map(([id, data]) => {
          return (
            <li key={id}>
              <h2>{data.title}</h2>
              <button
                onClick={async () => {
                  const successful = await props.delete(id)

                  if (successful) {
                    alert("deleted successfully")
                  } else {
                    alert("not found")
                  }
                }}
              >削除</button>
            </li>
          )
        })
      }
    </ul>
  )
};

export default List;
