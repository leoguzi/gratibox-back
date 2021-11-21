async function registerSignature(req, res) {
  console.log(req.userId);
  return res.sendStatus(201);
}
export { registerSignature };
