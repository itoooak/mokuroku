import { useEffect, useState } from 'react'
import axios from 'axios'
import List from './List';

function App() {
  const [index, setIndex] = useState<Index>(new Map());

  console.log(index)

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

  return (
    <>
      <List items={Array.from(index.entries())} />
    </>
  )
}

export default App
