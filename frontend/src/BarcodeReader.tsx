import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import BarcodeScanner from "./BarcodeScanner";
import BarcodeReaderResult from "./BarcodeReaderResult";

const BarcodeReader: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState("");
  const [cameraError, setCameraError] = useState(null);
  const [results, setResults] = useState<QuaggaJSResultObject[]>([]);
  const [torchOn, setTorch] = useState(false);
  const scannerRef = useRef<Element>() as MutableRefObject<HTMLDivElement>;

  useEffect(() => {
    const enableCamera = async () => {
      await Quagga.CameraAccess.request(null, {});
    };
    const disableCamera = async () => {
      await Quagga.CameraAccess.release();
    };
    const enumerateCameras = async () => {
      const cameras = await Quagga.CameraAccess.enumerateVideoDevices();
      console.log('Cameras Detected: ', cameras);
      return cameras;
    };

    enableCamera()
      .then(disableCamera)
      .then(enumerateCameras)
      .then((cameras) => setCameras(cameras))
      .then(() => Quagga.CameraAccess.disableTorch())
      .catch((err) => setCameraError(err));

    return () => { disableCamera(); }
  }, [])

  const onTorchClick = useCallback(() => {
    const torch = !torchOn;
    setTorch(torch);
    if (torch) {
      Quagga.CameraAccess.enableTorch();
    } else {
      Quagga.CameraAccess.disableTorch();
    }
  }, [torchOn, setTorch]);

  return (
    <div>
      {cameraError ? <p>Error: Init Camera ${JSON.stringify(cameraError)}</p> : null}

      {
        cameras.length === 0 ?
          <p>Enumerating Cameras, browser may be prompting for permissions beforehand</p> :
          <form>
            <select onChange={(event) => setCameraId(event.target.value)}>
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || camera.deviceId}
                </option>
              ))}
            </select>
          </form>
      }

      <button onClick={onTorchClick}>{torchOn ? 'Disable Torch' : 'Enable Torch'}</button>
      <button onClick={() => setScanning(!scanning)}>{scanning ? 'Stop' : 'Start'}</button>

      <ul>
        {
          Array.from(
            new Map(results.map(result => [result.codeResult.code, result]))
              .entries()
          )
            .map(([key, val]) => <BarcodeReaderResult key={key} result={val} />)
        }
      </ul>

      <div ref={scannerRef} style={{ position: 'relative', border: '3px solid red' }}>
        <canvas className="drawingBuffer" style={{
          position: 'absolute',
          top: '0px',
          border: '3px solid green',
        }} width="640" height="480" />
        {
          scanning ?
            <BarcodeScanner scannerRef={scannerRef} cameraId={cameraId} onDetected={(result) => setResults([...results, result])} /> :
            null
        }
      </div>
    </div>
  )
}

export default BarcodeReader;
