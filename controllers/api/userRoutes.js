const router = require('express').Router()
const e = require('express')
const session = require('express-session')
const { User } = require('../../models')

router.post('/signup', async (req, res) => {
    try{
        const newUser = await User.create({
            email: req.body.newEmail,
            user_name: req.body.newUserName,
            password: req.body.newPassword
        })


        res.status(200).json(newUser)
    } catch(err){
        res.status(500).json(err)
    }
})

router.post('/login', async (req, res) => {
    try{
        const userData = await User.findOne({ where: {email: req.body.email} })
        
        if (!userData) {
            res
              .status(400)
              .json({ message: 'Incorrect email or password, please try again' });
            return;
        }
        
        //replace with encryption later
        if(!req.body.password === userData.password){
            res.status(400).json({ message: "incorrect email or password"})
        }
        
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

        res.json({user: userData, message: 'Log in successful'})
        });

    } catch(err){
        res.status(500).json(err)
    }

})

router.post('/logout', (req, res)=>{
    if(req.session){
        req.session.destroy()
        res.status(204).end()
    }
    res.status(404).end()
})

router.post('/switch', (req, res)=>{
    if(req.session.switch){
        req.session.switch = false;
        res.render('login-signup', {switch: req.session.switch})
    }
    else if(!req.session.switch){
        req.session.switch = true;
        res.render('login-signup', {switch: req.session.switch})
    }
    res.status(204)

})

router.put('/link_account', async (req, res)=>{
    try {
        const userData = await User.findByPk(req.body.email)

        if(!userData){
            res.status(404).message({ message: 'No user with that email' })
            return
        }
        
        const updatedData = await userData.update({linked_account: req.body.linked_account})
        res.status(200).json(updatedData)
    } catch(err){
        res.status(500).json(err)
    }

})



module.exports = router;