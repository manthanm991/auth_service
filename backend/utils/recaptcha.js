async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  const params = new URLSearchParams();
  params.append('secret', secret);
  params.append('response', token);

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  const data = await response.json();
  return data;
}

module.exports = { verifyRecaptcha };