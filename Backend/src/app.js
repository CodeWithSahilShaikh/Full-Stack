/*
-Server ko create krna
*/

const express = require('express');
const noteModel = require('./models/note.model');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(express.json()); // middleware use krna pdta hai taki hum req.body se data access kr ske, otherwise req.body undefined aayega.
app.use(cors({
  origin: "https://full-stack-1-o577.onrender.com/"  // 
}));  // ye line likhne se hmara server cross origin wali request accept krna chalu kr deta hai. but bss origin me jo frontend ka url diya hai usse hi.

/*
- POST /api/notes
- create new note and save data in mongoDB
*/
app.post('/api/notes', async (req, res) => {
    const {title, description} = req.body;
    const newNote = await noteModel.create({title, description})
    res.status(201).json({
        message: "Note created successfully",
         newNote
    });
    
    })

/*
 - GET /api/notes
 - Fetch all the notes data from mongodb and send them in the response.
*/

app.get('/api/notes', async (req, res) => {
    const notes = await noteModel.find();  // find method data ko always array of object me return krengi.
    res.status(200).json({
        message: "Notes fetched successfully",
        notes
    });
});

/*
- DELETE /api/notes/:id
- Delete note with the id from req.params
*/
app.delete('/api/notes/:id', async (req, res) => {
    const {id} = req.params;
    const note = await noteModel.findByIdAndDelete(id);
    res.status(200).json({
        message: "Note deleted successfully",
       note
    });
});

/*
 - PATCH /api/notes/:id
 - Update the description of the note by id
 - req.body = {description}
*/

app.patch('/api/notes/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const updateData = {};
  
      if (req.body.title !== undefined) {
        updateData.title = req.body.title;
      }
  
      if (req.body.description !== undefined) {
        updateData.description = req.body.description;
      }
  
      const updatedNote = await noteModel.findByIdAndUpdate(
        id,
        { $set: updateData }, // jo fields bheje hai only unhe hi update kro
        {
          new: true,  // Naya updated data wapas do
          runValidators: true   // Schema rules follow karo
        }
      );
  
      if (!updatedNote) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      res.json({
        message: "Note updated successfully",
        updatedNote
      });
  
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Serve static files AFTER API routes
app.use(express.static("./public"))

// wild card (middleware) : ye unn api ko handle krta hai jo api hmne bnayi nhi hai (create nhi kri hai)  and unn api pr user ne kuch bhi request kr diya. toh uss request ke response me hm index.html file send krte hai.
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "..", "/public/index.html"))
    // res.send("this is wild card")
})

// __dirname ka mtlb kya hota hai?
// hm jis bhi file me ise likh denge, uss file ke folder tb ka path ye hme de deta hai and aage jo hmne "/public/index.html" ye likha hai iska mtlb hme aur aage kaha tk ka path chahiye. lekin isse pehle hme ".." likha hai iska mtlb folder se bahr jana hota hai. for example jb hm console.log(__dirname) krenge to hme src folder tk ka path milega but index.html public folder me hai jo src se bahr hai isliye hm ".." lga kr src se bahr jayenge and then public me jayenge then index.html.
// ab jb hmne index.html file ki request kri hai toh index.html file me hmne css and js ki file link kri hai to index.html file request krti hai ki wo dono bhi ise mil jaye but index.html file ko css and js ki file nhi mil pati hai. Inn dono ke response me hme html file hi milti hai.
// Aisa kyu hota hai?
// jb tum devtools me aakr Network me aake inn file ke request ke Headers me dekte ho aapko request url me "http://localhost:3000/assets/index-DvxqN-F2.js" kuch aisa likha dikhega.
// Aur hmne upr wild card (middleware) me yhi kaha tha ki jo api create nhi hui hai waha html bhejo toh iss request url ko dhyan se dekhoo "http://localhost:3000/" ke aage jo bhi likha hua hai wo api hmne toh create nhi kri hai isliye hme css and js file ke request me bhi html hi milta hai.
// lekin hm chahte hai ki inki request me js and css ki file aani chahiye.
// isi ke liye hmare paas ek aur middleware hota hai "app.use(express.static("./public"))"
// bss isi middleware ko lgane se hmara backend ke url pr frontend dikhana chalu ho gya and fully work bhi kr rha hai.
// Lekin ye hua kaise?
// toh suno ye middleware kya krti hai - iss middleware me hm jo bhi folder ka path dete hai, uss folder ke sabhi files ko publically available kra deti hai means ab use koi bhi access kr skta hai.

// "http://localhost:3000/assets/index-DvxqN-F2.js"  iss url me assets folder and js file ka jo name hai wo exist krti hai isi liye koi error nhi aayga agr yaha koi aise file ka naam hota jo exist nhi krti hai to response me fir html hi milta.

// Hmm index.html kyu bhejte hai?
// Kyunki React Single Page Application (SPA) hai!
//User browser mein type karta hai:
// https://tumharisite.com/notes
// Server sochta hai → "/notes" ka koi route hai mere paas?
// ❌ Nahi hai → 404 Error!
// Wildcard se fix
// Koi bhi URL aaye → index.html bhej do
// Browser ko index.html mila → React load hua
// React ne URL dekha → /notes → apna route handle kiya ✅
// yaha se React dekhega kis route pr kya dikhana hai.

module.exports = app;