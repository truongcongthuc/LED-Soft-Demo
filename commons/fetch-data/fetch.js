import axios from "axios";

const getHeader = (accessToken) => {
  if (accessToken)
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
  else
    return {
      headers: {
        "Content-Type": "application/json",
      },
    };
};

const postApi = async (url, body, accessToken) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, body, getHeader(accessToken))
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
};

const getApi = (url, accessToken) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, getHeader(accessToken))
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
};

export { postApi, getApi };
