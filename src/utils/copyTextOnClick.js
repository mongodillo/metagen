export const copyTextOnClick = async (e) => {
  e.preventDefault();
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(e.target.value);
  } else {
    return document.execCommand("copy", true, e.target.value);
  }
};
