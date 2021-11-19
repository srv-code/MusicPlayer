export default class StringUtils {
  // TODO: implement this in the search UI
  static getInlineSearchResult = (searchTerm, fullText, caseInsensitive) => {
    if (!searchTerm) throw new Error('`searchTerm` parameter cannot be empty');
    if (!fullText) throw new Error('`fullText` parameter cannot be empty');

    const matchedStartIndex = caseInsensitive
      ? fullText.toLocaleLowerCase().indexOf(searchTerm.toLocaleLowerCase())
      : fullText.indexOf(searchTerm);
    // const resultText =
    //   matchedStartIndex === -1
    //     ? fullText
    //     : `${fullText.substr(0, matchedStartIndex)}[${fullText.substr(
    //         matchedStartIndex,
    //         searchTerm.length,
    //       )}]${fullText.substr(matchedStartIndex + searchTerm.length)}`;

    return {
      searchTerm,
      fullText,
      caseInsensitive,
      matchedStartIndex,
      // resultText,
    };
  };
}
