const express = require("express");
const app = express();
const axios = require('axios');
const input = require('body-parser');
app.use(input.json());
app.use(input.urlencoded({extended: true}));
app.use(express.static( "views"));
const session = require('express-session');
app.use(session({secret:'ssshhh',saveUninitialized: true,resave: true}));

function checksession(req, res, next){
    var sessionPos = req.session.user_position;
    if(!sessionPos){
      res.redirect("/login"); 
      // console.log("session invalid");
    }
    else{
        // console.log("session valid");
        next();
    }

  };
app.get("/dog/:dog_detail/",checksession,function(req,res){
    var pass_url2 = require('./connection'); 
    var up = req.session.user_position;
    console.log(req.params.dog_detail);
    pass_url2.findOne({"message" : req.params.dog_detail}).then((response)=>{
      console.log(response.pic_url)
      var pic_url = JSON.parse(response.pic_url);
      res.render("dog_details.ejs",{
          user_position : up,
          dog_detail : response,
          pic_url : pic_url
      })
    })
    
    .catch(error =>{
      console.log(error);
    })
   
});

app.get("/error_page/",checksession,function(req,res){
  var pass_url2 = require('./connection'); 
  var up = req.session.user_position;
  pass_url2.findOne({}).then((response)=>{
    // console.log(response.pic_url)
    res.render("error_page.ejs",{
        user_position : up,
        dog_detail : response,
    })
  })
  
  .catch(error =>{
    console.log(error);
  })
 
});



app.get("/login",function(req,res){
  
  res.render("login.ejs");
 
});
app.get("/homepage/",checksession,function(req,res){
  var up = req.session.user_position;
  var pass_url = require('./connection'); 
  pass_url.find({}).then((response)=>{
    res.render("homepage.ejs",{
        dog_detail : response,
        user_position : up

    })
  })
  .catch(error =>{
    console.log(error);
  })
 
});
app.get('/logout', function(req, res){
  req.session.destroy((err) => {
    if(err) {
        return console.log(err);
    }
    res.redirect('/login');
});
});

app.post("/insert_result",function(req,res){
  const Dog = require('./connection');
  var details = req.body.insert_result;
  const querystr = `https://api.thedogapi.com/v1/breeds/search?q=${details}`;
  console.log(details);
  axios
    .get(querystr)
    .then((response) => {
        console.log(response);
        if(response.data[0] == null)
        {
          console.log("There is no species like this")
          res.redirect('/error_page');
        }
        var id = response.data[0].id; 
        var querystr1 = `https://api.thedogapi.com/v1/images/search?breed_id=${id}`;
        var querystr2 = `https://dog.ceo/api/breed/${details}/images/random/3`;
        axios.get(querystr1).then( (responsee)=>{
            console.log(id);
           
                var message = responsee.data[0].breeds[0].name;
                var bred_for = responsee.data[0].breeds[0].bred_for;
                var life_span = responsee.data[0].breeds[0].life_span;
                var temperament = responsee.data[0].breeds[0].temperament;
                var url = responsee.data[0].url;
                  axios.get(querystr2).then( (responseee)=>{
                    var pic_url= responseee.data.message
                    pic_url = JSON.stringify(pic_url);
      
                    var Dog1 = new Dog({
                      message: message,
                      bred_for: bred_for,
                      life_span: life_span,
                      url : url,
                      temperament : temperament,
                      pic_url : pic_url
                  });   
                 
                  Dog1
                .save({})
                .then(response2 => {
                  // console.log(response);
                  res.redirect("/homepage");
                })
                .catch(error => {
                 
                }); 
            });       
        })
        .catch((error) =>{
          console.log(error)
        })
      
      
  })
    .catch(error => {
      res.status(400).json(error);
    });
});
app.post("/search_result",function(req,res){
  var search = require('./connection');
  var searchR = req.body.search_result;
  // console.log(searchR);
  search.find({})
    .then(response => {
      var dog_row = 0
      while(dog_row < response.length)
      {
        // console.log(searchR)
        var dog_name = response[dog_row].message.toLowerCase();
        if(dog_name == searchR.toLowerCase())
        {
          console.log(dog_name);
          res.redirect("/dog/"+response[dog_row].message);
        }
      
        dog_row++;
      }
      res.redirect("/error_page");
        
    })
    .catch(error => {
      // res.status(400).json(error);
    });

 
});
app.post("/login_success",function(req,res){
  var reg = require('./register');
  var un = req.body.username;
  var pw = req.body.password;

  reg.find({})
    .then(response => {
        var row = 0;
        while(row < response.length)
        {
            if(response[row].username == un && response[row].password == pw)
            {
              req.session.user_position = response[row].user_position;
              res.redirect("/homepage/");
            }
            else
            {
              row++;
            }
          } 
        }
        
    )
    .catch(error => {
      // res.status(400).json(error);
    });

 
});
app.get("/register",function(req,res){
  res.render("register.ejs");
});


// //localhost:5000/getmovie?title=MovieTitle
// app.get('/getdog', (req, res) => {
//   const Dog = require('./connection');
//   const api = " 237f864b-a241-44e8-9a36-affe6d262bb9"
//   const querystr = `https://api.thedogapi.com/v1/breeds`;
 

//   axios
//     .get(querystr)
//     .then((response) => {
//       for (var i =0; i<10; i++)
//       {
//         var id = response.data[i].id;     
//         var querystr1 = `https://api.thedogapi.com/v1/images/search?breed_id=${id}`;
//         axios.get(querystr1).then( (responsee)=>{
//               var Dog1 = new Dog({
//                   message: responsee.data[0].breeds[0].name,
//                   bred_for: responsee.data[0].breeds[0].bred_for,
//                   life_span: responsee.data[0].breeds[0].life_span,
//                   url: responsee.data[0].url         
//             });     
//         Dog1
//         .save({})
//         .then(response2 => {
//           // console.log(response);
//           res.send(response2.data);
//         })
//         .catch(error => {
//           res.status(400).json(error);
//         }); 
        
//         })
//         .catch((error) =>{
//           console.log(error)
//         })
      
//       }
//   })
//     .catch(error => {
//       res.status(400).json(error);
//     });
    
// });

//localhost:5000/getallmovies
// app.get('/getalldog', (req, res) => {
//   Dog.find({})
//     .then(response => {
//       res.render("dog.ejs",{
//         message: response
//       });
//       res.status(200).json(response);
      
//     })
//     .catch(error => {
//       res.status(400).json(error);
//     });
// });

app.post('/user_register', (req, res) => {
  var reg = require('./register');
  var Reg = new reg({
    username: req.body.username,
    password: req.body.password,
    cf_password: req.body.cf_password,
    user_position: "user"   
    
  });
    Reg
    .save({})
    .then(response => {
      res.render("login.ejs");
    })
    .catch(error => {
      res.status(400).json(error);
    });
    
});

//localhost:5000/deletemovie?title=MovieTitle
app.post('/deletedog', (req, res) => {
  var con = require('./connection');
  var did = req.body.dog_id;
  con.deleteOne({ "_id" : did })
    .then(response => {
      res.redirect("/homepage/");
    })
    .catch(error => {
      // res.status(400).json(error);
    });
});

app.listen("3000",function(){
    console.log("success");

})