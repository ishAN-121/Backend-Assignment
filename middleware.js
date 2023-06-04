const db = require("./database");

exports.validate = (req, res, next) => {
    const cookie = req.headers.cookie.slice(10);
    if (req.headers.cookie.includes("sessionId")) {
        db.query(
            `SELECT cookies.userId, cookies.sessionId, cookies.username, users.admin FROM cookies, users WHERE sessionid=${db.escape(
                cookie
            )} AND users.id=cookies.userId;`,
            (err, result) => {
                if (err) throw err;
                if (result.length == 0) return res.redirect("login");
                req.admin = result[0].admin;

                if (cookie === result[0].sessionId) {
                    req.userId = result[0].userId;
                    req.username = result[0].username;

                    next();
                } else {
                    return res.json({
                        error: "Not Authenticated",
                    });
                }
            }
        );
    } else {
        return res.status(403).json({
            error: "Not Authenticated",
        });
    }
}