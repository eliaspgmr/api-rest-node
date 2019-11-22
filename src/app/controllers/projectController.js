module.exports = {
    projects(req, res) {
        return res.json({ userID: req.userId })
    }
}
