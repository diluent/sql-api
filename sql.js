var sql = require('mssql');

var config = {
    user: 'Lozon_test',
    password: 'Lozon_test',
    server: 'logdev\\logdev',
    database: 'lozonweb',

    // options: {
    //     encrypt: true // Use this if you're on Windows Azure 
    // }
}

module.exports = function (router) {
    router.post('/:procname', function (req, res) {

        var procName = req.params.procname;
        const { parameters = [], fields = [] } = req.body;



        sql.connect(config)
            .then(function () {

                const sqlReq = new sql.Request();

                parameters.map(({ name, value, direction = 'input' }) => {
                    console.log(name, value, direction)
                    if (!name) throw new Error('Отсутствует поле name в parameters');
                    if (!value) throw new Error('Отсутствует поле value в parameters');
                    if (!direction in ['input, output'])
                        throw new Error('Поле deirection может быть только input, output');

                    direction === 'input'
                        ? sqlReq.input(name, sql.Text, value)
                        : sqlReq.output(name, sql.Text)
                });

                sqlReq.execute(procName).then(function (recordsets) {
                    res.json(recordsets)
                }).catch(function (err) {
                    res.json({ RequestError: err });
                });

            }).catch(function (err) {
                res.json({ ConnectionError: err.message });
            });

    });
}