const Users = require('../modules/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretOrPrivateKey = 'your_secret_key';

const registerUsers = async(req,res)=>{
    const salt = await bcrypt.genSalt(18);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);
    const user = new Users({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
        role:req.body.role
    })
    try{
        res.status(200).send(await user.save())
    }
    catch(e){
        res.status(400).send({
            "message": e.message
        })
    }
}

const login = async (req, res) => {
    try {
        const user = await Users.findOne({ email: req.body.email }).lean();
        
      if (!user) {
        return res.status(401).json({ message: 'Invalid Credentials' });
      }

      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

      if (user.role !== req.body.role) {
        return res.status(401).json({ message: 'Role Did Not Match' });
      }
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid Password' });
      }
  
      const token = jwt.sign({ email: user.email, role: user.role }, secretOrPrivateKey, {
        expiresIn: '1d'
      });
  
      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });
  
      return res.status(200).json({ token, role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  

const userLogin = async(req,res)=>{
    try{
    const cookie = req.cookies['jwt'];
    console.log('cookie',cookie);
    const claims = jwt.verify(cookie,secretOrPrivateKey);
    console.log('claims',claims);
    if(!claims){
        console.log('inside if loop');
        return res.status(401).send({
            message:'unauthenticated'
        })
    }
    const user = await Users.findOne({email:claims.email});
    console.log(user);
    const {password,...data} = await user.toJSON();
    res.send(data);
    }
    catch(e){
        console.log('inside catch loop',e);
        return res.status(401).send({
            message:'unauthenticated'
        })
    }
    
}

const logout = async(req,res)=>{
    res.cookie('jwt','',{
        maxAge:0    
    })
    res.send({
        message:'logout success'
    })
}

module.exports ={registerUsers,login,userLogin,logout};