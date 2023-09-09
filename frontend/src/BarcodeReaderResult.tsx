import { QuaggaJSResultObject } from '@ericblade/quagga2';
import React from 'react';

interface BarcodeReaderResultProps {
  result: QuaggaJSResultObject;
}

const BarcodeReaderResult: React.FC<BarcodeReaderResultProps> = (props) => {
  return (
    <li>
      {props.result.codeResult.code} [{props.result.codeResult.format}]
    </li>
  );
};

export default BarcodeReaderResult;
