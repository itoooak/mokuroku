import { QuaggaJSResultObject } from '@ericblade/quagga2';
import React, { useState } from 'react';

interface BarcodeReaderResultProps {
  result: QuaggaJSResultObject;
  add: (book: Book) => Promise<APIResult>;
  clearResultList: () => void;
}

const BarcodeReaderResult: React.FC<BarcodeReaderResultProps> = (props) => {
  const [data, setData] = useState<BookData>({ title: '' });

  return (
    <li>
      {props.result.codeResult.code} [{props.result.codeResult.format}]
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!props.result.codeResult.code) return;
          if (data.title === '') return;

          const isbnCode = props.result.codeResult.code;
          const result = await props.add({ id: isbnCode, ...data });

          if (result.successful) {
            alert('added successfully');
            props.clearResultList();
          } else {
            alert(`failed to add item: status ${result.statusCode}, ${result.message}`);
          }
        }}
      >
        <label>title</label>
        <input
          type='text'
          value={data.title}
          onChange={(e) => {
            setData({ title: e.target.value });
          }}
        />
        <input type='submit' value='追加' />
      </form>
    </li>
  );
};

export default BarcodeReaderResult;
