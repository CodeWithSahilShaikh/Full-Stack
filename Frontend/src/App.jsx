import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'


function App() {
  const BASE_URL = "https://full-stack-1-o577.onrender.com"
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  function fetchNotes() {
    axios.get(`${BASE_URL}/api/notes`)
    .then((res) => {
      // console.log(res.data)  // abhi browser pr CORS error aayega, ye browser(client) side pr aata hai, ye policy bolti hai ki aap ek website pr rehte huye dusri kisi website pr request nhi kr skte. Abhi hmara frontend and backend local pr run ho rha hai but inka address alg hai isliye error aayega. isi liye sirf development time pr ham CORs request ko accept krenge. isko accept krne keliye hm backend ke terminal pr cors packaage install krenge, "npm i cors"
      //  HMNE CORS INSTALL KR LIYA TO AB AA JAYEGA.
 
      setNotes(res.data.notes || []); // ✅ Nested in 'notes' key with fallback
   
    })
    .catch((err) => {
      console.error("Error fetching notes:", err);
      setNotes([]);
    })
  }

  useEffect(() => {
    fetchNotes()
  }, [])


  function handleEdit(note) {
    setTitle(note.title);
    setDescription(note.description);
    setEditingId(note._id); // mark as editing

  }




  function handleDelete(noteId) {
    console.log(noteId)
    axios.delete(`${BASE_URL}/api/notes/${noteId}`)
    .then((res) => {
      console.log(res.data)
      fetchNotes()
    })
  }




function handleSubmit(e) {
  e.preventDefault()

  const payload = {}

  if (title && title.trim() !== "") {
    payload.title = title.trim()
  }

  if (description && description.trim() !== "") {
    payload.description = description.trim()
  }

  console.log("Payload:", payload)

  if (editingId) {
    // UPDATE
    axios.patch(
      `${BASE_URL}/api/notes/${editingId}`, payload,
      payload
    )
    .then(res => {
      console.log("Updated:", res.data)
      setEditingId(null)
      fetchNotes()
      setTitle('')
      setDescription('')
    })
  } else {
    // CREATE
    axios.post(
      `${BASE_URL}/api/notes`, payload
    )
    .then(res => {
      console.log("Created:", res.data)
      fetchNotes()
      setTitle('')
      setDescription('')
    })
  }
}
  

  return (
    <>
    <form className='note-create-form' onSubmit={handleSubmit}>
      <input onChange={(e) => setTitle(e.target.value)} type="text" name='title' value={title} placeholder='Enter Title' />
      <input onChange={(e) => setDescription(e.target.value)} type="text" name='description' value={description} placeholder='Enter Description' />
      <button>
    {editingId ? "Update Note" : "Create Note"}
      </button>
    </form>
    <div className="notes">
      {
        notes.map(note => {
          return (
            <div className="note" key={note._id}>
              <h1>{note.title}</h1>
              <p>{note.description}</p>
              <div className="note-actions">
                <button className="btn-delete" onClick={()=>handleDelete(note._id)}>Delete</button>
                <button className="btn-edit" onClick={() => handleEdit(note)}>Edit</button>
              </div>
            </div>
          )
        })
      }
    </div>
    </>
  )
}

export default App

// Note: "npm run build" -> ye command hmare pure react code ko html css and javascript ke code me convert krke de deti hai.
// jb iss command ko frontend ke terminal pr run kroge to ye aapko ek new folder bna kr degi jiska name "dist" hoga aur usme tumhara code hoga html csss and js me.
// hm iss dist folder me se apni asset folder jisme css and js ki file hogi and apni html ki file ko move krenge.
// Move kidhar krna hai? hm backend wale foler me ek new folder bnayege jiska name "public" hoga and uss folder me move kr denge.
// ab move kyu kiya hai ispr abhi baat krte hai.
// hmne isko move krke frontend and backend sath me lekr aa gye hai.
// sath me isi liye lekr aaye hai taki frontend and backend ko alg-alg deploy na krna pde, hm inko easily sath me deploy kr ske.

// Let suppose agr hm in future react ke code me kuch bhi update krte hai toh hme wapis se dubara "npm run build" chlana pdega and dubara Backend me public folder me unn files ko dalna pdega jo hme "dist" me milegi.

// hme dist file ko code backend me bhejna kyu pda? hm inn dono ko alg alg bhi deploy kr skte the Frontend ka code Vercel pr aur Backend ka code Render pr fir inko ek sath kyu krna pda?
// avhi aapko problem isliye samajh nhi aayegi kyuki tum vercel and render ko free me use kr rhe ho abhi, production ka code free ke server pr nhi rehta, hme hr ek cheez ke liye pay krna pdta hai.
// agr hm inhe alg-alg deploy krte to hme alg-alg paise bhi pay krna pdta and alg alg manage bhi krna pdega.
