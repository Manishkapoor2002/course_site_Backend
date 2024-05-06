import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import express from "express";
import dotenv from 'dotenv';
import cors from 'cors'
import {authenticationJWTAdmin,authenticationJWTUser} from './middlewares/auth'
const app = express();
const port = process.env.PORT || 5000;
const secretKeyAdmin = process.env.SKeyAdmin
const secretKeyUser = process.env.SKeyUser
dotenv.config();

app.use(express.json());
app.use(cors())

mongoose.connect("mongoose Url")


app.get('/admin/me',authenticationJWTAdmin,(req,res)=>{
    res.status(200).json({username : req.user.username})
})

app.post('/admin/signup', async (req, res) => {
    console.log("hello")
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (admin) {
        res.status(403).json({ "message": "Admin Already Exist!!" })
    } else {
        const newAdmin = new Admin({ 'username': username, 'password': password });
        await newAdmin.save();
        const token = jwt.sign({ username }, secretKeyAdmin, { expiresIn: '2h' });
        console.log(token)
        // const token = generateToken(admin,secretKeyAdmin);
        res.json({ "message": "Admin created successfull!!", "token": token })
    }
})

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.headers;
    const admin = await Admin.findOne({ username, password })
    if (admin) {
        const token = jwt.sign({ username }, secretKeyAdmin, { expiresIn: '2h' });
        res.status(200).json({ "message": "Login Successfull", "token": token })
    } else {
        res.status(403).json({ "message": "Admin authorization failed!!" })
    }
})


app.post('/admin/courses', authenticationJWTAdmin, async (req, res) => {
    // const course = req.body;
    // course.id = Date.now();
    // console.log(course)
    const newCourse = new Course(course);
    await newCourse.save();
    res.status(200).json({ "message": "Course added Successfully!!", "Course Id ": course.id })
})



app.put('/admin/courses/:CourseId', authenticationJWTAdmin, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.CourseId, req.body, { new: true });
    if (course) {
        res.json({ "message": "successfully updated!!" })
    } else {
        res.status(404).json({ "messgae": "course not found!!" })
    }
})


app.get('/admin/currCourse/:CourseId',authenticationJWTAdmin,async(req,res)=>{
    const course = await Course.findById(req.params.CourseId);
    if(course){
        res.json(course);
    }else{
        res.status(404).json({"message":"course not found"})
    }
})


app.get('/admin/courses', authenticationJWTAdmin, async (req, res) => {
    // console.log(req)
    res.send(await Course.find({}));
})

// User Routes:::


app.post('/users/signup', async (req, res) => {
    const { username, password } = req.body;
    console.log(username + " " + password)
    const user = await User.findOne({ username });
    if (user) {
        res.status(403).json({ "message": "User Already Exist!!" })
    } else {
        const newUser = new User({ 'username': username, 'password': password });
        await newUser.save();
        const token = jwt.sign({ username }, secretKeyUser, { expiresIn: '2h' })
        res.json({ "message": "Admin created successfull!!", "token": token })
    }
})

app.post('/users/login', async (req, res) => {
    const { username, password } = req.headers;
    console.log(username + " " + password)
    const user = await User.findOne({ username, password })
    // console.log("here :->" + user)
    if (user) {
        const token = jwt.sign({ username }, secretKeyUser, { expiresIn: '2h' })
        res.status(200).json({ "message": "Login Successfull", "token": token })
    } else {
        res.status(403).json({ "message": "Admin authorization failed!!" })
    }
})

app.get('/users/courses', authenticationJWTUser, async (req, res) => {
    res.send(await Course.find({ published: true }));
})


app.post('/users/courses/:courseId', authenticationJWTUser, async (req, res) => {
    console.log(req.user)
    const course = await Course.findById(req.params.courseId);
    // console.log(course);
    if (course) {
        const user = await User.findOne({ username: req.user.username });
        // console.log(user);
        if (user) {
            user.purchasedCourses.push(course);
            await user.save();
            res.status(200).json({ "message": "Course purchased successfully!" })

        } else {
            res.status(403).json({ "message": "User not found!!" })
        }
    } else {
        res.status(404).json({ "message": "Course not found!!" })
    }

})

app.get('/users/purchasedCourses', authenticationJWTUser, async (req, res) => {
    const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
    if (user) {
        res.json({ "Courses": user.purchasedCourses || [] });
    } else {
        res.json({ "message": "User not found!!" })
    }
})
app.listen(port, () => {
    console.log("Successfully running")
})