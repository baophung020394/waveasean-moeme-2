const currencyFormat = (num: any) => {
  if (!num) return;
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export { currencyFormat };

const statisticsFormat = (num: any) => {
  if (!num) return;
  return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

export { statisticsFormat };
