export const syncSleep = () => {
  const wakeUpTime = Date.now() + 3000;
  while (Date.now() < wakeUpTime) {}
};

export const asyncSleep = () => {
  new Promise((resolve) => setTimeout(resolve, 6000));
};
