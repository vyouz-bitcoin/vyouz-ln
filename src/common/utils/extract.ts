export function extractValues(text: string) {
  // Object to store field-value pairs
  const fields = {
    'Photo Description': '',
    'Photo Featuring': '',
    Amount: '',
    'Lightning Address': '',
    'Email address': '',
  };

  // Regular expressions for each field
  const regexes = {
    'Photo Description': /Photo Description:([\s\S]*?)(?=Photo Featuring:|$)/,
    'Photo Featuring':
      /Photo Featuring:([\s\S]*?)(?=Amount you want to sell|$)/,
    Amount:
      /Amount you want to sell \(in sats, enter 0 if free\):([\s\S]*?)(?=Lightning Address:|$)/,
    'Lightning Address': /Lightning Address:([\s\S]*?)(?=Email address:|$)/,
    'Email address': /Email address:([\s\S]*)/,
  };

  // Loop through each field and extract the value using regex
  for (const field in regexes) {
    const match = text.match(regexes[field]);
    if (match) {
      fields[field] = match[1].trim();
    }
  }

  return fields;
}
