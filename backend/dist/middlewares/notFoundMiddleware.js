export function notFoundMiddleware(req, res) {
    res.status(404).json({ message: `Not found: ${req.method} ${req.path}` });
}
