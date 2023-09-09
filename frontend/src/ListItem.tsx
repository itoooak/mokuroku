import React, { useState } from 'react';
import UpdateItemPanel from './UpdateItemPanel';

export interface ListItemProps {
  id: ID,
  data: BookData,
  delete: (id: ID) => Promise<boolean>,
  update: (id: ID, data: BookData) => Promise<boolean>,
}

const ListItem: React.FC<ListItemProps> = (props) => {
  const [isUpdating, setIsUpdating] = useState(false)

  return (
    <li key={props.id}>
      <h2>{props.data.title}</h2>

      <button onClick={() => {
        setIsUpdating((isUpdating) => !isUpdating)
      }}>
        {isUpdating ? "閉じる" : "編集"}
      </button>

      {
        isUpdating ?
          <UpdateItemPanel id={props.id} update={props.update} /> :
          null
      }

      <button
        onClick={async () => {
          const successful = await props.delete(props.id)

          if (successful) {
            alert("deleted successfully")
          } else {
            alert("not found")
          }
        }}
      >
        削除
      </button>
    </li>
  )
}

export default ListItem
