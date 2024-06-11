import React, { useState } from 'react';
import { isValidDate } from './util';

export interface UpdateItemPanelProps {
  book: Book;
  update: (id: ID, book: Book) => Promise<APIResult>;
}

const UpdateItemPanel: React.FC<UpdateItemPanelProps> = (props) => {
  const [data, setData] = useState<BookData>(props.book);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (data.title === '') return;

        const result = await props.update(props.book.id, {
          id: props.book.id,
          ...data,
        });

        if (result.successful) {
          alert('updated successfully');
          setData(data);
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
        value={data.title}
        onChange={(e) => {
          setData({ ...data, title: e.target.value });
        }}
      />

      <label>入手日</label>
      <input
        type='date'
        value={data.obtained?.toISOString().split('T')[0]}
        onChange={(e) => {
          const date = new Date(e.target.value + 'T12:00:00');
          setData({ ...data, obtained: isValidDate(date) ? date : null });
        }}
      />

      <label>読了日</label>
      <input
        type='date'
        value={data.finished?.toISOString().split('T')[0]}
        onChange={(e) => {
          const date = new Date(e.target.value + 'T12:00:00');
          setData({ ...data, finished: isValidDate(date) ? date : null });
        }}
      />

      <input type='submit' value='更新' />
    </form>
  );
};

export default UpdateItemPanel;
