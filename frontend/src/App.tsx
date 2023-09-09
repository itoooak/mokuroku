import { useEffect, useState } from 'react';
import axios from 'axios';
import List from './List';
import AddItemPanel from './AddItemPanel';
import BarcodeReader from './BarcodeReader';

const API_URL_BASE = 'http://127.0.0.1:3000';

function App() {
  const [index, setIndex] = useState<Index>(new Map());

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
      <AddItemPanel add={addItem} />

      <BarcodeReader />
    </>
  );
}

export default App;
