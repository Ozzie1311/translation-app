import OpenAI from 'openai'
import { useState } from 'react'

export const MainApp = () => {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('')
  const [translation, setTranslation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTranslate, setIsTranslate] = useState(false)

  const languages = [
    {
      name: 'Spanish',
      img: '/assets/españa.png',
    },
    {
      name: 'French',
      img: '/assets/francia.png',
    },
    {
      name: 'Germany',
      img: '/assets/germany.png',
    },
    {
      name: 'Italy',
      img: '/assets/italia.png',
    },
    {
      name: 'Japanese',
      img: '/assets/japon.png',
    },
  ]

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value)
  }

  const handleStartOverClick = () => {
    setIsTranslate(false)
    setText('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!text || !language) {
      alert('Por favor ingresa un texto y selecciona un idioma')
      return
    }

    setIsLoading(true)
    setTranslation('')

    try {
      const client = new OpenAI({
        dangerouslyAllowBrowser: true,
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: import.meta.env.VITE_API_KEY,
      })

      const response = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content:
              'You are a skillfull traductor, and your only job is gonna be translate what the user ask to you to translate in the language that the user requires. Only answer with the traduction, nothing more.',
          },
          {
            role: 'user',
            content: `Translate the following text: "${text}". Translate it to ${language}`,
          },
        ],
        temperature: 0.8,
      })

      console.log(response.choices[0].message.content)

      setTranslation(response.choices[0].message.content)
      setIsTranslate(true)
    } catch (err) {
      console.error('Error fetching traduction', err)
      setTranslation('Error')
    } finally {
      setIsLoading(false)
      //   setText('')
    }
  }

  return (
    <div id='main'>
      {!isTranslate ? (
        <form id='form' onSubmit={handleSubmit}>
          <div>
            <label id='input' htmlFor='input'>
              Text to translate
            </label>
            <textarea
              type='text'
              id='input'
              placeholder='Type here...'
              value={text}
              onChange={(event) => setText(event.target.value)}
            />
          </div>

          <div>
            <h3 id='select-language'>Select language</h3>
            <ul>
              {languages.map((lang) => (
                <li key={lang.name}>
                  <input
                    id={lang.name}
                    type='radio'
                    name='languageSelection'
                    value={lang.name}
                    onChange={handleLanguageChange}
                  />
                  <label htmlFor={lang.name}>{lang.name}</label>
                  <img src={lang.img} alt={lang.name} />
                </li>
              ))}
            </ul>
          </div>

          <button type='submit' disabled={isLoading}>
            {isLoading ? 'Translating' : 'Translate'}
          </button>
        </form>
      ) : (
        <div id='main-2'>
          <div id='inner'>
            <h3>Original Text</h3>
            <div id='box'>
              <p>{text}</p>
            </div>

            <div id='translation'>
              <h3>Your translation</h3>
              <div id='box'>
                <p>{translation}</p>
              </div>
            </div>
          </div>
          <button id='start-over' onClick={handleStartOverClick}>
            Start Over
          </button>
        </div>
      )}
    </div>
  )
}
