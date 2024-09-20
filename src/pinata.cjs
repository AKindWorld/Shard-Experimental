import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_APIKEY;

const uploadFileToPinata = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  let data = new FormData();
  data.append('file', file);

  const metadata = JSON.stringify({
    name: file.name
  });
  data.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0
  });
  data.append('pinataOptions', options);

  try {
    const response = await axios.post(url, data, {
      maxContentLength: "Infinity",
      headers: {
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        'Authorization': `Bearer ${PINATA_API_KEY}`
      }
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    return null;
  }
};

export default uploadFileToPinata;
