const homeRouter = require('./home');
const authLogin = require('./login');
const adminRouter = require('./admin');


function route(app) {
    app.use('/auth', authLogin);
    app.use('/', homeRouter);
    app.use('/admin', adminRouter);
}
module.exports = route;