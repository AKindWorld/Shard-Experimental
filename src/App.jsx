import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FileStorage from '../artifacts/contracts/FileStorage.sol/FileStorage.json'
import ipfs from '../src/ipfs.cjs';
import uploadFileToPinata from '../src/pinata.cjs';

const App = () => {
  const [account, setAccount] = useState('');
  const [fileStorage, setFileStorage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    //const provider = ((window.ethereum != null) ? new ethers.providers.Web3Provider(window.ethereum) : ethers.providers.getDefaultProvider());
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    setAccount(await signer.getAddress());

    const contractAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const fileStorageContract = new ethers.Contract(contractAddress, FileStorage.abi, signer);
    setFileStorage(fileStorageContract);

    const files = await fileStorageContract.getAllFiles();
    setFileList(files);
  };

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    setFile(file);
  };

  const uploadFile = async (fileName, fileType) => {
    const ipfsHash = await uploadFileToPinata(file); // Upload file to Pinata

    if (ipfsHash) {
      // Store file info on the blockchain
      await fileStorage.uploadFile(ipfsHash, fileName, fileType);

      const files = await fileStorage.getAllFiles();
      setFileList(files);
    }
  };

  return (
    <div>
      <h1>Decentralized File Sharing</h1>
      <p>Account: {account}</p>

      <input type="file" onChange={captureFile} />
      <button onClick={() => uploadFile(file.name, file.type)}>Upload</button>

      <h3>Uploaded Files</h3>
      <ul>
        {fileList.map((file, index) => (
          <li key={index}>
            <p><strong>{file.fileName}</strong> ({file.fileType})</p>
            <p>Uploaded by: {file.uploader}</p>
            <p>
              <a href={`https://salmon-broad-chicken-471.mypinata.cloud/ipfs/${file.ipfsHash}`} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;