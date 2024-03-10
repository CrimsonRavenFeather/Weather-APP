import React, { useContext, useState } from 'react';
import userContext from '../context/user_context';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { user, set_user, refreshToken, set_refreshToken } = useContext(userContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleName = (e) => {
    setName(e.target.value)
  }

  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  // HANDLE AUTHORIZATION

  const handlesubmit = async (e) => {
    e.preventDefault();
    const uuid = crypto.randomUUID()                          // [ UUID IS GENERATED AT CLIENT SIDE ]
    try {
      const response = fetch("http://localhost:4040/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/JSON"
        },
        body: JSON.stringify({
          username: name,
          email: email,
          uuid: uuid
        })
      })
      const json = await (await response).json()
      set_user(json.access_token)                             // [ GETTING ACCESS TOKEN ]
      set_refreshToken(json.refresh_token)                    // [ GETTING REFRESH TOKEN ]
      navigate('/weather')
    } catch (error) {
      console.log(error)
    }
  }

  // COMPONETS

  return (
    <>
      <section className="vh-100 gradient-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card text-black" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-5 text-center">

                <div className="mb-md-5 mt-md-4 pb-5">

                  <h2 className="fw-bold mb-2 text-uppercase">Authorization</h2>
                  <p className="text-black-50 mb-5">Please enter your name and password!</p>

                  <div className="form-outline form-black mb-4">
                    <input type="name" id="typeNameX" className="form-control form-control-lg" onChange={handleName} />
                    <label className="form-label" htmlFor="typeNameX" >Name</label>
                  </div>

                  <div className="form-outline form-black mb-4">
                    <input type="email" id="typeEmailX" className="form-control form-control-lg" onChange={handleEmail} />
                    <label className="form-label" htmlFor="typeEmailX">Email</label>
                  </div>
                </div>

                <div>
                  <button className="btn btn-outline-dark btn-lg px-5" type="submit" disabled={name.length === 0 || email.length === 0} onClick={handlesubmit}>Authorize</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
