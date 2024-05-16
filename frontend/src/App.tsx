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
      .then(Object.entries)
      .then((entries) => {
        const newIndex: Index = new Map();
        entries.forEach((entry: [ID, BookData]) => {
          newIndex.set(entry[0], entry[1]);
        });
        setIndex(newIndex);
      })
      .catch((err) => console.log(err));
  }, []);

  const addItem = async (id: ID, data: BookData) => {
    if (index.has(id)) {
      return false;
    }

    const status = await axios
      .post(API_URL_BASE + '/books', { id: id, data: data })
      .then((resp) => resp.status)
      .catch(console.log);

    if (status !== 200) {
      return false;
    }

    const newIndex = new Map(index);
    newIndex.set(id, data);
    setIndex(newIndex);

    return true;
  };

  const deleteItem = async (id: ID) => {
    if (!index.has(id)) {
      return false;
    }

    const status = await axios
      .delete(API_URL_BASE + `/books/${id}`)
      .then((resp) => resp.status)
      .catch(console.log);

    if (status !== 200) {
      return false;
    }

    const newIndex = new Map(index);
    newIndex.delete(id);
    setIndex(newIndex);

    return true;
  };

  const updateItem = async (id: ID, data: BookData) => {
    if (!index.has(id)) {
      return false;
    }

    const status = await axios
      .put(API_URL_BASE + `/books/${id}`, { data: data })
      .then((resp) => resp.status)
      .catch(console.log);

    if (status !== 200) {
      return false;
    }

    const newIndex = new Map(index);
    newIndex.set(id, data);
    setIndex(newIndex);

    return true;
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
