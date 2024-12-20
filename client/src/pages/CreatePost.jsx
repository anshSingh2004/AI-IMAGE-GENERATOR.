import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"

import { preview } from "../assets"
import { getRandomPrompt } from "../utils"
import { FormField, Loader } from '../components'

/**
 * Creates a post with an AI-generated image based on user input.
 * @returns {JSX.Element} A form section for creating and sharing AI-generated images.
 */
const CreatePost = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: ""
  })

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true)
        const response = await fetch("http://localhost:8080/api/v1/dalle"
          , {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt: form.prompt })
          })

        const data = await response.json()

        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` })

      }
      catch (error) {
        alert(error)
      } finally {
        setGeneratingImg(false)
      }
    } else {
      alert("Please Enter A Prompt")
    }
  }

  const handelSubmit = async (e) => {
    e.preventDefault()

    if (form.prompt && form.photo) {
      setLoading(true)

      try {
        const response = await fetch("http://localhost:8080/api/v1/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(form)

          })
        await response.json()
        navigate("/")

      } catch (error) {
        alert(error)
      } finally {
        setLoading(false)
      }

    }
    else {
      alert("Please Enter A Prompt")

    }

  }

  const handelChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })

  }
  const handelSupriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({ ...form, prompt: randomPrompt })
  }

  const [generatingImg, setGeneratingImg] = useState(false)
  const [loading, setLoading] = useState(false)


  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold bg-cold text-[#b8b9c7] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[14px] max-w-[500px]'>Create imaginative and visually stunning images through DALL-E AI and share them with the community  </p>
      </div>
      <form className='mt-16 max-w-3xl' onSubmit={handelSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="John Jacob"
            value={form.name}
            handelChange={handelChange}
          />
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="a bowl of soup that looks like a monster, knitted out of wool"
            value={form.prompt}
            handelChange={handelChange}
            isSupriseMe
            handelSupriseMe={handelSupriseMe}
          />
          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-gray-600 focus:border-black w-64 p-3 h-64 flex justify-center items-center '>
            {form.photo ? (
              <img src={form.photo}
                alt={form.prompt}
                className='w-full h-full oject-contain'
              />
            ) : (
              <img
                src={preview}
                alt={preview}
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}

            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={generateImage}
            className='text-white bg-red-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {generatingImg ? "Generating..." : "Generate"}

          </button>
        </div>
        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>
            Once you have created you want, you can share it with others in the community
          </p>
          <button
            type="submit"
            className='mt-3 text-white bg-[#6c6c78] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {loading ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost
