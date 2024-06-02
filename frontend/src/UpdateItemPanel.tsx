import React, { useState } from 'react';

export interface UpdateItemPanelProps {
  id: ID;
  update: (id: ID, book: Book) => Promise<APIResult>;
}

const UpdateItemPanel: React.FC<UpdateItemPanelProps> = (props) => {
  const [data, setData] = useState<BookData>({ title: '' });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (data.title === '') return;

        const result = await props.update(props.id, { id: props.id, ...data });

        if (result.successful) {
          alert('updated successfully');
          setData({ title: '' }); // 更新後はフォームをクリア
        } else {
          alert(
            `failed to update: status ${result.statusCode}, ${result.message}`,
          );
        }
      }}
    >
      <label>title</label>
      <input
        type='text'
        value={data?.title}
        onChange={(e) => {
          setData({ title: e.target.value });
        }}
      />
      <input type='submit' value='更新' />
    </form>
  );
};

export default UpdateItemPanel;
