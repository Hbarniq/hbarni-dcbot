exports.removeDuplicates = async (arr) => {
    const cleaned = [];
    arr.forEach((e) => {
      if (cleaned.indexOf(e) === -1) {
        cleaned.push(e);
      }
    });
    return cleaned;
}