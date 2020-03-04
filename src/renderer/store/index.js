import axios from 'axios'
import db from 'electron-db'

export const state = () => ({
  authUser: null
})

export const mutations = {
  SET_USER(state, user) {
    if (user === null) {
      db.updateRow(
        'config',
        { username: state.authUser.username },
        { username: null, password: null, remember: false },
        (succ, msg) => {
          console.log('Success: ' + succ)
          console.log('Message: ' + msg)
        }
      )
      state.authUser = null
    } else {
      if (user.remember === true) {
        db.updateRow(
          'config',
          { username: null },
          {
            username: user.user.username,
            password: user.password,
            remember: true
          },
          (succ, msg) => {
            console.log('Success: ' + succ)
            console.log('Message: ' + msg)
          }
        )
      }
      state.authUser = user.user
    }
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtClientInit({ commit }) {
    db.getField('config', 'username', (succ, username) => {
      if (username[0]) {
        db.getField('config', 'password', async (succ, password) => {
          if (password[0]) {
            db.getField('config', 'remember', async (succ, remember) => {
              if (remember[0]) {
                try {
                  const loginUser = await axios.post(
                    'http://51.83.74.154:3000/api/login',
                    { username: username[0], password: password[0] }
                  )
                  const session = await axios.post(
                    'http://51.83.74.154:3000/api/sessionKey',
                    { token: loginUser.data.userInfo.token }
                  )
                  const userInfo = {
                    user: loginUser.data.userInfo,
                    password: password[0],
                    session: session.data.session,
                    remember: remember[0]
                  }
                  commit('SET_USER', userInfo)
                } catch (err) {
                  if (err.response && err.response.status === 401) {
                    throw new Error(err.response.data.message)
                  }
                  throw err
                }
              }
            })
          }
        })
      }
    })
  },
  async login({ commit }, { username, password, remember }) {
    try {
      const loginUser = await axios.post('http://51.83.74.154:3000/api/login', {
        username,
        password
      })
      const session = await axios.post(
        'http://51.83.74.154:3000/api/sessionKey',
        { token: loginUser.data.userInfo.token }
      )
      db.getField('config', 'remember', async (succ, rememberDB) => {
        if (remember === true) {
          db.updateRow(
            'config',
            { remember: rememberDB[0] },
            { remember: true },
            (succ, msg) => {
              console.log('Success: ' + succ)
              console.log('Message: ' + msg)
            }
          )
        } else {
          db.updateRow(
            'config',
            { remember: rememberDB[0] },
            { remember: false },
            (succ, msg) => {
              console.log('Success: ' + succ)
              console.log('Message: ' + msg)
            }
          )
        }
        const userInfo = {
          user: loginUser.data.userInfo,
          password,
          session: session.data.session,
          remember
        }
        commit('SET_USER', userInfo)
      })
    } catch (err) {
      if (err.response && err.response.status === 401) {
        throw new Error(err.response.data.message)
      }
      throw err
    }
  },
  async register(store, { email, username, password }) {
    try {
      await axios
        .post('http://51.83.74.154:3000/api/register', {
          email,
          username,
          password
        })
        .then(function() {
          store.dispatch('login', {
            username,
            password,
            remember: false
          })
        })
        .catch(function(err) {
          if (err.response && err.response.status === 401) {
            throw new Error(err.response.data.message)
          }
          throw err
        })
    } catch (err) {
      if (err.response && err.response.status === 401) {
        throw new Error(err.response.data.message)
      }
      throw err
    }
  },
  async logout({ commit }) {
    commit('SET_USER', null)
  }
}
