import { useEffect, useState } from 'react'
import axios from 'axios'
import List from './List';
import AddItemPanel from './AddItemPanel';

function App() {
  const [index, setIndex] = useState<Index>(new Map());

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/books")
      .then((resp) => resp.data)
      .then(Object.entries)
      .then((entries) => {
        const newIndex: Index = new Map()
        entries.forEach((entry: [ID, BookData]) => {
          newIndex.set(entry[0], entry[1])
        });
        setIndex(newIndex);
      })
      .catch((err) => console.log(err))
  }, []);

  const addItem = async (id: ID, data: BookData) => {
    if (index.has(id)) {
      return false
    }

    const responseData = await axios.post(
      "http://127.0.0.1:3000/books",
      { id: id, data: data }
    )
      .then((resp) => resp.data as CreateResponse)
      .catch(console.log)

    if (responseData === undefined) {
      return false
    }

    const newIndex = new Map(index)
    newIndex.set(responseData.id, responseData.new)
    setIndex(newIndex)
    return true
  }

  const deleteItem = async (id: ID) => {
    if (!index.has(id)) {
      return false
    }

    const responseData = await axios.delete(
      "http://127.0.0.1:3000/books",
      {
        headers: {},
        data: { id: id },
      }
    )
      .then((resp) => {
        if (resp.status != 200)
          throw Error("not found")

        return resp.data as DeleteResponse
      })
      .catch(console.log)

    if (responseData === undefined) {
      return false
    }

    const newIndex = new Map(index)
    newIndex.delete(responseData.id)
    setIndex(newIndex)
    return true
  }

  return (
    <>
      <List
        items={Array.from(index.entries())}
        delete={deleteItem}
      />
      <AddItemPanel add={addItem} />
    </>
  )
}

export default App
