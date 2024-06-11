import { useEffect, useState } from 'react';
import axios from 'axios';
import List from './List';
import AddItemPanel from './AddItemPanel';
import BarcodeReader from './BarcodeReader';

// cf. https://ja.vitejs.dev/guide/env-and-mode.html
const API_URL_BASE = import.meta.env.VITE_API_URL_BASE;

function App() {
  const [index, setIndex] = useState<Index>(new Map());
  const [selectedInput, setSelectedInput] = useState<string>();

  useEffect(() => {
    axios
      .get(API_URL_BASE + '/books')
      .then((resp) => resp.data)
      .then((entries) => {
        const newIndex: Index = new Map();
        entries.forEach((item: any) => {
          const book = {
            ...item,
            obtained: item.obtained ? new Date(item.obtained) : null,
            finished: item.finished ? new Date(item.finished) : null,
          };
          newIndex.set(book.id, book);
        });
        setIndex(newIndex);
      })
      .catch(console.log);
  }, []);

  const addItem = async (book: Book): Promise<APIResult> => {
    if (index.has(book.id)) {
      return {
        successful: false,
        statusCode: undefined,
        message: `ID ${book.id} already in use`,
      };
    }

    const status = await axios
      .post(API_URL_BASE + '/books', book)
      .then((resp) => resp.status)
      .catch(console.log);

    if (status !== 200) {
      return { successful: false, statusCode: status, message: '' };
    }

    const newIndex = new Map(index);
    newIndex.set(book.id, book);
    setIndex(newIndex);

    return { successful: true, statusCode: status, message: '' };
  };

  const deleteItem = async (id: ID): Promise<APIResult> => {
    if (!index.has(id)) {
      return {
        successful: false,
        statusCode: undefined,
        message: `ID ${id} not found`,
      };
    }

    const status = await axios
      .delete(API_URL_BASE + `/books/${id}`)
      .then((resp) => resp.status)
      .catch(console.log);

    if (status !== 200) {
      return { successful: false, statusCode: status, message: '' };
    }

    const newIndex = new Map(index);
    newIndex.delete(id);
    setIndex(newIndex);

    return { successful: true, statusCode: status, message: '' };
  };

  const updateItem = async (id: ID, book: Book): Promise<APIResult> => {
    if (!index.has(id)) {
      return {
        successful: false,
        statusCode: undefined,
        message: `ID ${id} not found`,
      };
    }

    const data = {
      ...book,
      obtained: book.obtained?.toISOString(),
      finished: book.finished?.toISOString(),
    };

    const status = await axios
      .put(API_URL_BASE + `/books/${id}`, data)
      .then((resp) => resp.status)
      .catch(console.log);

    if (status !== 200) {
      return { successful: false, statusCode: status, message: '' };
    }

    const newIndex = new Map(index);
    newIndex.set(book.id, book);
    setIndex(newIndex);

    return { successful: true, statusCode: status, message: '' };
  };

  return (
    <>
      <List
        items={Array.from(index.entries())}
        delete={deleteItem}
        update={updateItem}
      />

      <label>
        Input:
        <select
          value={selectedInput}
          onChange={(e) => setSelectedInput(e.target.value)}
        >
          <option value='noinput'>no input</option>
          <option value='manual'>manual</option>
          <option value='barcode'>barcode</option>
        </select>
      </label>

      {selectedInput === 'manual' ? (
        <AddItemPanel add={addItem} />
      ) : selectedInput === 'barcode' ? (
        <BarcodeReader add={addItem} />
      ) : null}
    </>
  );
}

export default App;
