export const calculateTimeAgo = (
  timestamp: string,
  setTimeAgo: (value: string) => void
) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const differenceInSeconds = Math.floor(
    (now.getTime() - messageTime.getTime()) / 1000
  );

  if (differenceInSeconds < 60) {
    setTimeAgo(`${differenceInSeconds}s`);
  } else if (differenceInSeconds < 3600) {
    const minutes = Math.floor(differenceInSeconds / 60);
    setTimeAgo(`${minutes}m`);
  } else if (differenceInSeconds < 86400) {
    const hours = Math.floor(differenceInSeconds / 3600);
    setTimeAgo(`${hours}h`);
  } else if (differenceInSeconds < 604800) {
    const days = Math.floor(differenceInSeconds / 86400);
    setTimeAgo(`${days}d`);
  } else if (differenceInSeconds < 2592000) {
    const weeks = Math.floor(differenceInSeconds / 604800);
    setTimeAgo(`${weeks} ${weeks === 1 ? "week" : "weeks"}`);
  } else if (differenceInSeconds < 31536000) {
    const months = Math.floor(differenceInSeconds / 2592000);
    setTimeAgo(`${months} ${months === 1 ? "month" : "months"} `);
  } else {
    const formattedDate = `${messageTime.getDate()}/${
      messageTime.getMonth() + 1
    }/${messageTime.getFullYear()}`;
    setTimeAgo(`${formattedDate}`);
  }
};
