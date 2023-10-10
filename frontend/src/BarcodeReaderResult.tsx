import { QuaggaJSResultObject } from '@ericblade/quagga2';
import React, { useState } from 'react';

interface BarcodeReaderResultProps {
  result: QuaggaJSResultObject;
  add: (id: ID, data: BookData) => Promise<boolean>;
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

          const isbnCode = props.result.codeResult.code as string;
          const successful = await props.add(isbnCode, data);

          if (successful) {
            alert('added successfully');
            props.clearResultList();
          } else {
            alert('already exists');
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
