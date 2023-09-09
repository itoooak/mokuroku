import React, { useCallback, useLayoutEffect } from 'react';
import Quagga, { QuaggaJSCodeReader, QuaggaJSResultObject } from '@ericblade/quagga2';

function getMedian(arr: number[]) {
  const newArr = [...arr];
  newArr.sort((a, b) => a - b);
  const half = Math.floor(newArr.length / 2);
  if (newArr.length % 2 === 1) {
    return newArr[half];
  }
  return (newArr[half - 1] + newArr[half]) / 2;
}

function getMedianOfCodeErrors(decodedCodes: { error?: number, code?: number, start: number, end: number }[]) {
  const errors = decodedCodes.flatMap(x => x.error).filter(x => x !== undefined);
  const medianOfErrors = getMedian(errors as number[]);
  return medianOfErrors;
}

const defaultConstraints = {
  width: 640,
  height: 480,
};

const defaultLocatorSettings = {
  patchSize: 'medium',
  halfSample: true,
  willReadFrequently: true,
};

const defaultDecoders: QuaggaJSCodeReader[] = ['ean_reader'];

interface BarcodeScannerProps {
  onDetected: (result: QuaggaJSResultObject) => void;
  scannerRef: React.MutableRefObject<HTMLDivElement>;
  cameraId: string;
  facingMode?: string;
  constraints?: object;
  locator?: object;
  decoders?: QuaggaJSCodeReader[];
  locate?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onDetected,
  scannerRef,
  cameraId,
  facingMode,
  constraints = defaultConstraints,
  locator = defaultLocatorSettings,
  decoders = defaultDecoders,
  locate = true,
}: BarcodeScannerProps) => {
  const errorCheck = useCallback((result: QuaggaJSResultObject) => {
    if (!onDetected) {
      return;
    }
    const err = getMedianOfCodeErrors(result.codeResult.decodedCodes);
    if (err < 0.25) {
      onDetected(result);
    }
  }, [onDetected]);

  const handleProcessed = (result: QuaggaJSResultObject) => {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;
    drawingCtx.font = "24px Arial";
    drawingCtx.fillStyle = 'green';

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width') ?? "err"), parseInt(drawingCanvas.getAttribute('height') ?? "err"));
        result.boxes.filter((box) => box !== result.box).forEach((box) => {
          Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'purple', lineWidth: 2 });
        });
      }
      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: 'blue', lineWidth: 2 });
      }
      if (result.codeResult && result.codeResult.code) {
        drawingCtx.font = "24px Arial";
        drawingCtx.fillText(result.codeResult.code, 10, 20);
      }
    }
  };

  useLayoutEffect(() => {
    let ignoreStart = false;
    const init = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1));
      if (ignoreStart) {
        return;
      }

      await Quagga.init({
        inputStream: {
          type: 'LiveStream',
          constraints: {
            ...constraints,
            ...(cameraId && { deviceId: cameraId }),
            ...(!cameraId && { facingMode }),
          },
          target: scannerRef.current,
          willReadFrequently: true,
        },
        locator,
        decoder: { readers: decoders },
        locate,
      }, async (err) => {
        Quagga.onProcessed(handleProcessed);

        if (err) {
          return console.error('Error starting Quagga:', err);
        }
        if (scannerRef && scannerRef.current) {
          Quagga.start();
        }
      });
      Quagga.onDetected(errorCheck);
    };
    init();
    return () => {
      ignoreStart = true;
      Quagga.stop();
      Quagga.offDetected(errorCheck);
      Quagga.offProcessed(handleProcessed);
    };
  }, [cameraId, onDetected, scannerRef, errorCheck, constraints, locator, decoders, locate, facingMode]);
  return null;
}

export default BarcodeScanner;

