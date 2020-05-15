const nodeMailer = require("nodemailer");

async function Send(user){
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'hlb0932055041@gmail.com',
            pass: 'Taolatao0' 
        }
    });

    const url = (process.env.BASE_URL || "localhost:3000") + ("/signup/" + user.id + "/" + user.token);

    return await transporter.sendMail({
        from: 'Ly Ly <hlb0932055041@gmail.com>',
        to: user.email,
        subject: 'Xác thực tài khoản TODOAPP - NTS',
        text: 'Liên kết vào link sau để kích hoạt tài khoản: ' + url,
    }).then(console.log("Gui thanh cong")).catch("Gui khong duoc"); 
}

module.exports = {Send}



