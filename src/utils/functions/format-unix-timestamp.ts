const formatUNIXTimeStamp = (unixTS: number, parts: string[]) => {
  const milliseconds = unixTS * 1000;
  const dateObject = new Date(milliseconds);

  let result = '';

  parts.forEach((part) => {
    switch (part) {
    case 'year':
      result += `${dateObject.getFullYear()}-`;
      break;
    case 'month':
      result += `${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-`;
      break;
    case 'day':
      result += `${dateObject.getDate().toString().padStart(2, '0')} `;
      break;
    case 'hour':
      result += `${dateObject.getHours().toString().padStart(2, '0')}:`;
      break;
    case 'minute':
      result += `${dateObject.getMinutes().toString().padStart(2, '0')}:`;
      break;
    case 'second':
      result += `${dateObject.getSeconds().toString().padStart(2, '0')}`;
      break;
    default:
      break;
    }
  });

  result = result.replace(/[:-]$/, '');

  return result;
};

export default formatUNIXTimeStamp;
