import axios from 'axios';

const getData = async (dataURL, setData) => {
  await axios
    .get(dataURL)
    .then((result) => {
      return setData(result.data);
    })
    .catch((err) => console.log(err));
};
const createData = async (dataURL, setData, createURL, body) => {
  await axios.post(createURL, body).then(() => console.log('Inserted'));
  getData(dataURL, setData);
};
const updateData = async (dataURL, setData, updateURL, body) => {
  await axios.put(updateURL, body).then(() => {
    console.log('Updated');
  });
  getData(dataURL, setData);
};
const deleteData = async (dataURL, setData, deleteURL) => {
  await axios.delete(deleteURL).then(() => {
    console.log('Deleted');
  });
  getData(dataURL, setData);
};

export { getData, createData, updateData, deleteData };
