import React, { useState } from 'react'

export interface UpdateItemPanelProps {
  id: ID,
  update: (id: ID, data: BookData) => Promise<boolean>,
}

const UpdateItemPanel: React.FC<UpdateItemPanelProps> = (props) => {
  const [data, setData] = useState<BookData>({ title: "" });

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      if (data.title === "")
        return

      const successful = await props.update(props.id, data)

      if (successful) {
        alert("updated successfully")
      } else {
        alert("failed to update")
      }
    }}>
      <label>title</label>
      <input
        type='text' value={data?.title}
        onChange={(e) => {
          setData({ title: e.target.value })
        }}
      />
      <input type='submit'>更新</input>
    </form>
  )
}

export default UpdateItemPanel
