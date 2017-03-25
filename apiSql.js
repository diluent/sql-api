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

const directions = { input: true, output: true, inputoutput: true };

module.exports = function (router) {
    router.post('/:procname', function (req, res) {

        var procName = req.params.procname;
        const { parameters = [], fields = [] } = req.body;

        sql.connect(config)
            .then(function () {
                const sqlReq = new sql.Request();
                parameters.map(params => {
                    const error = MapParameters(params, sqlReq);
                    if (error) {
                        res.json({
                            ResultOk: false,
                            ResultMessage: error
                        });
                        return;
                    }
                });

                sqlReq.execute(procName).then(function (recordsets) {
                    res.json({
                        ResultOk: true,
                        ResultMessage: 'Операция выполнена успешно',
                        Recordsets: recordsets
                    })
                }).catch(function (err) {
                    res.json({
                        ResultOk: false,
                        ResultMessage: err
                    });
                });

            }).catch(function (err) {
                res.json({
                    ResultOk: false,
                    ResultMessage: err.message
                });
            });

    });
}

function MapParameters(params, sqlRequest) {
    const { name, value, direction } = params;
    if (!name)
        return 'Отсутствует обязательное поле name';
    if (!/^(input|output|inputoutput)$/.test(direction, 'g'))
        return 'Поле deirection может быть только input, output, inputoutput';
    if (direction === 'input' && !value)
        return 'Отсутствует поле value';


    switch (direction.toLowerCase()) {
        case 'input':
        case 'inputoutput':
            sqlRequest.input(name, sql.NVarChar, value);
            return;
        case 'output':
            sqlRequest.output(name, sql.NVarChar)
    }
}