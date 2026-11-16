export default function handler(req, res) {
  res.status(200).json({ 
    success: true, 
    message: 'API funcionando!',
    method: req.method,
    url: req.url
  })
}
