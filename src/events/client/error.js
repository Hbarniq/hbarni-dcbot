module.exports = {
    name: 'error',
    async execute(err, client) {
        if (err.code == 1006) return;
        else console.log(err);
    }
}