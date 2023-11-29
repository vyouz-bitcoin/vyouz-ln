export function getFileExtension(url) {
  // Extract the portion of the URL after the last period (.)
  const extension = url.split('?')[0].split('.').pop();
  return extension;
}
