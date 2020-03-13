const mdMirror = require('md-mirror')

module.exports = (req, res) => {

    const mm = new mdMirror({
        baseLocalUrl: '/md',
        baseRemoteUrl: 'https://raw.githubusercontent.com/openfab-lab',
        viewManager: (content) => {
            // While caching is not available set pages to be cached 24h
            res.setHeader('Cache-Control', 'public, max-age=' + (60*60*24));
            res.render('../src/views/md.ejs', {
                content,
                user: req.user
            })
        }
    })

    return mm.render(req.url)
}

