import axios from "axios";
export const getEbayItems = async (): Promise<string> => {
  const res = await axios.get('https://api.kanye.rest');
  await new Promise(r => setTimeout(r, 2000));
  return res.data.quote;
};
