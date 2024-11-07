function formatArrayToStrings(keywordsObj: Record<string, string>): string {
  if (!keywordsObj) {
    return '';
  }

  const valuesArray = Object.values(keywordsObj);
  const joinedString = valuesArray.join(', ');

  return joinedString;
}

export default formatArrayToStrings;