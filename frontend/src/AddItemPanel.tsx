import React, { useState } from 'react';
import { emptyBookData } from './util';

export interface AddItemPanelProps {
  add: (book: Book) => Promise<APIResult>;
}

const AddItemPanel: React.FC<AddItemPanelProps> = (props) => {
  const [id, setId] = useState<ID>('');
  const [data, setData] = useState<BookData>(emptyBookData);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (id === '' || data.title === '') return;

        const result = await props.add({ id: 'manual:' + id, ...data });

        if (result.successful) {
          alert('added successfully');
          setId('');
          setData(emptyBookData);
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
          setData({ ...emptyBookData, title: e.target.value });
        }}
      />
      <input type='submit' value='追加' />
    </form>
  );
};

export default AddItemPanel;
