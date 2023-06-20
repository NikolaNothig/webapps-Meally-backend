const User = require('./models/User');

async function verify(email, loginToken, name, surname) {
    if (!email || !loginToken) {
        return false;
    }

    let user = await User.findOne({ email: email, name: name, surname: surname });
    if (!user) return false;

    if (loginToken == user.loginToken) {
        return true;
    } else {
        return false;
    }
}

module.exports = verify;
