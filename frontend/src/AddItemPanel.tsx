import React, { useState } from 'react';

export interface AddItemPanelProps {
  add: (book: Book) => Promise<APIResult>;
}

const AddItemPanel: React.FC<AddItemPanelProps> = (props) => {
  const [id, setId] = useState<ID>('');
  const [data, setData] = useState<BookData>({ title: '' });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (id === '' || data.title === '') return;

        const result = await props.add({ id, ...data });

        if (result.successful) {
          alert('added successfully');
          setId('');
          setData({ title: '' });
        } else {
          alert(
            `failed to add item: status ${result.statusCode}, ${result.message}`,
          );
        }
      }}
    >
      <label>ID</label>
      <input
        type='text'
        value={id}
        onChange={(e) => {
          setId(e.target.value);
        }}
      />

      <label>title</label>
      <input
        type='text'
        value={data?.title}
        onChange={(e) => {
          setData({ title: e.target.value });
        }}
      />
      <input type='submit' value='追加' />
    </form>
  );
};

export default AddItemPanel;
