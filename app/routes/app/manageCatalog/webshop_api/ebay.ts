export const getEbayItems = async (): Promise<string> => {
  const res = fetch('https://api.kanye.rest');
  await new Promise(r => setTimeout(r, 2000));
  return new Promise(r => "sup");
};
