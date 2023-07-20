export default function authHeader() {
    const authData = JSON.parse(localStorage.getItem('auth'));

    if (authData && authData.access_token) {
      return { "Authorization": 'Bearer ' + authData.access_token };
    } else {
      return {};
    }
  }