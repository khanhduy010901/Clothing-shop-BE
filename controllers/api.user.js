var mdU = require('../models/user.model');
const mongoose = require('mongoose');
const moment = require('moment-timezone');

const timeZone = 'Asia/Ho_Chi_Minh';
var now = moment().tz(timeZone);


const bcrypt = require('bcrypt');
var objReturn = {
    status: 1,
    msg: 'OK'
}

exports.getAll = async (req, res, next) => {
    let list = [];

    try {
        list = await mdU.userModel.find();
        if (list.length > 0) {
            objReturn.data = list;
            objReturn.msg = 'Tìm thành công';

        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không có dữ liệu phù hợp';
        }

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
}
exports.getById = async (req, res, next) => {
    objReturn.data = null;

    try {
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            objReturn.status = 0;
            objReturn.msg = 'userId không hợp lệ';
            return res.status(400).json(objReturn);
        }
        const user = await mdU.userModel.findById(userId);

        if (user) {
            objReturn.msg = 'tìm thành công';

            objReturn.data = user;
        } else {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm thấy người dùng';
            return res.status(400).json(objReturn);
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
}
exports.addUser = async (req, res, next) => {
    objReturn.data = null;

    try {
        const { FullName, Email, PhoneNumber, Password: userPassword } = req.body;

        const RegistrationDate = now;
        const existingUser = await mdU.userModel.findOne({ Email });
        if (existingUser) {

            objReturn.msg = 'Email đã tồn tại';
            objReturn.status = 0;
            return res.status(401).json(objReturn)

        }
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        const newUser = new mdU.userModel({
            FullName,
            Password: hashedPassword,
            PhoneNumber,
            Email,
            RegistrationDate
        });

        const savedUser = await newUser.save();

        const { Password: pwd, ...userWithoutPassword } = savedUser.toObject();



        objReturn.data = userWithoutPassword;
        objReturn.msg = `người dùng được tạo thành công :${savedUser.Email} `;

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
    }

    res.json(objReturn);
}
exports.updateById = async (req, res, next) => {
    objReturn.data = null;

    try {
        const userId = req.params.userId;
        const updateFields = req.body;

        delete updateFields.Password;

        // if (updateFields.password) {
        //     const hashedPassword = await bcrypt.hash(updateFields.password, 10); // 10 là số vòng lặp (cost factor)
        //     updateFields.password = hashedPassword;
        // }


        const updatedUser = await mdU.userModel.findByIdAndUpdate(userId, updateFields, { new: true });

        if (!updatedUser) {
            objReturn.status = 0;
            objReturn.msg = 'Không tìm thấy người dùng';
        } else {
            objReturn.msg = 'Cập nhật thành công';
            objReturn.data = updatedUser;
        }
    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(401).json(objReturn)

    }

    res.json(objReturn);
}
exports.changePassword = async (req, res, next) => {
    objReturn.data = null;

    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.params.userId;

        const user = await mdU.userModel.findById(userId);
        if (!user) {

            objReturn.msg = 'Người dùng không tồn tại';
            objReturn.status = 0;
            return res.status(404).json(objReturn);
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.Password);
        if (!isPasswordMatch) {
            objReturn.msg = 'Mật khẩu cũ không chính xác';
            objReturn.status = 0;
            return res.status(401).json(objReturn);
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.Password = hashedNewPassword;
        await user.save();

        objReturn.msg = 'Mật khẩu đã được thay đổi thành công';
        objReturn.status = 1;
        return res.status(200).json(objReturn);
    } catch (error) {
        objReturn.msg = 'Đã xảy ra lỗi khi thay đổi mật khẩu';
        objReturn.status = 0;
        return res.status(500).json(objReturn);
    }
}

exports.userLogin = async (req, res, next) => {
    const { Email, Password } = req.body;
    objReturn.data = null;

    try {
        const user = await mdU.userModel.findOne({ Email });

        if (!user) {
            return res.status(401).json({ message: 'Tên người dùng hoặc mật khẩu không chính xác 1' })
        }
        const isPasswordmatch = await bcrypt.compare(Password, user.Password);
        if (!isPasswordmatch) {
            return res.status(401).json({ message: 'Tên người dùng hoặc mật khẩu không chính xác' })

        }
        objReturn.msg = "đăng nhập thành công";
        objReturn.data = user;

    } catch (error) {
        objReturn.status = 0;
        objReturn.msg = error.message;
        return res.status(500).json(objReturn)

    }
    res.json(objReturn);
}