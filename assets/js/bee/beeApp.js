var script = document.getElementById("beeConfig");
var apiKey = "CN1-3Db3RE5L";
var projectId = "evsethio";
var address;
var mainAddress = "auf.gov.et";
var schem = "https";
var storePort = 2434;
var authPort = 2435;
var storagePort = 2437;
var dnsPort = 1702;
var token;


class Bee {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async initializeApp() {
    try {
      var url = `${schem}://${mainAddress}:${dnsPort}/getAddress?apiKey=${this.apiKey}`;

      var response = await fetch(url)

      if (response.status == 200) {
        const value = await response.text();
        address = value;
        localStorage.setItem("address", value);
      } else {
        setTimeout(async function () {
          address = localStorage.getItem("address");
          await new Bee(this.apiKey).initializeApp();
        }, 5000);
      }
    } catch (e) {
      setTimeout(async function () {
        address = localStorage.getItem("address");
        await new Bee(this.apiKey).initializeApp()
      }, 5000);
    }
  }

}

(async () => {
  await new Bee("CN1-R3bR").initializeApp();
})()



async function _address(port) {
  if (address == null) {
    await new Bee(apiKey).initializeApp();
    if (address != null) {
      return address;
    }
  } else {
    return `${schem}://${address}:${port}/${apiKey.split("-")[1]}`;
  }
}

class BeeStore {
  constructor({ path }) {
    this.path = path;
  }

  async getSnapshot({ field, start, end, reversed } = {}) {
    if (address == null) {
      await new Bee(apiKey).initializeApp();
    }

    try {
      var url = `${await _address(storePort)}/readSnapshot${field != null ? "Field" : ""}`;
      var data = {
        "path": `${this.path}`,
        "field": field,
        "reversed": reversed,
        "start": start,
        "end": end,
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(data),
        });
      if (response.status == 200) {
        return response.json();
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }

  async getQuerySnapshot({ field, type, value, startFrom, fields, onlyId, end } = {}) {
    if (address == null) {
      await new Bee(apiKey).initializeApp();
    }
    try {
      var url = `${await _address(storePort)}/readSnapshotQuery`;
      var data = {
        "path": `${this.path}`,
        "filters": [{ field, type, value }],
        "onlyId": onlyId,
        "field": fields,
        "start": startFrom,
        "end": end,
        "reversed": true
      };
      var response = await fetch(url,
        {
          method: "POST",
         
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(data),
        });
      if (response.status == 200) {
        return response.json();
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }

  async getDoc({ field } = {}) {
    try {
      var url = `${await _address(storePort)}/${this.path}${field != null || token != null ? "?" : ""}${token != null ? `token=${token}` : ""}${(field != null && token != null) ? "&" : ""}${field != null ? `field=${field}` : ""}`;

      var response = await fetch(url);
      if (response.status == 200) {
        return response.json();
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }

  async getId() {
    try {
      var url = `${await _address(storePort)}/getId`;
      var temp = {
        "path": this.path,
        "token": token,
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(temp),
        });

      if (response.status == 200) {
        return response.text();
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }

  async serverTime() {
    try {
      var url = `${await _address(storePort)}/?time`;
      var response = await fetch(url);

      if (response.status == 200) {
        return response.json();
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }
  async setDoc(data, { hasDocId } = {}) {
    try {
      var url = `${await _address(storePort)}/set`;
      var temp = {
        "path": this.path,
        "data": data,
        "token": token,
        "hasDocId": hasDocId
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(temp),
        });

        
      if (response.status == 200) {
        return true;
      } else {
        return false;
      }

    } catch (e) {
      return null;
    }
  }
  async addDoc(data) {
    try {
      var url = `${await _address(storePort)}/set`;
      var temp = {
        "path": this.path,
        "data": data,
        "token": token,
        "hasDocId": false
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(temp),
        });

      if (response.status == 200) {
        return response.body;
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }

  async updateDoc(data = {}) {
    try {
      var url = `${await _address(storePort)}/updateDoc`;
      var temp = {
        "path": this.path,
        "data": data,
        "token": token,
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(temp),
        });

      if (response.status == 200) {
        return true;
      } else {
        return false;
      }

    } catch (e) {
      return null;
    }
  }

  async deleteDoc() {
    try {
      var url = `${await _address(storePort)}/deleteDoc`;
      var temp = {
        "path": this.path,
        "token": token,
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(temp),
        });

      if (response.status == 200) {
        return true;
      } else {
        return false;
      }

    } catch (e) {
      return null;
    }
  }

  async deleteCollection() {
    try {
      var url = `${await _address(storePort)}/deleteCollection`;
      var temp = {
        "path": this.path,
        "token": token,
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(temp),
        });

      if (response.status == 200) {
        return true;
      } else {
        return false;
      }

    } catch (e) {
      return null;
    }
  }

  async snapshotLength() {
    try {
      var url = `${await _address(storePort)}/snapshotLength`;
      var temp = {
        "path": this.path,
        "token": token,
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(temp),
        });

      if (response.status == 200) {
        return response.json();
      } else if (response.status == 404) {
        return -1;
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }

  async overallSnapshot() {
    try {
      var p = this.path == null ? "root" : this.path;
      var url = `${await _address(storePort)}/readOverallSnapshot`;
      var temp = {
        "path": p,
        "token": token,
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(temp),
        });

      if (response.status == 200) {
        return response.json();
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }

  async searchDoc({ field, value, end, onlyId } = {}) {
    try {
      var url = `${await _address(storePort)}/searchField`;
      var data = {
        "path": `${this.path}`,
        "field": field,
        "value": value,
        "token": token,
        "onlyId": onlyId,
        "end": end,
      };
      var response = await fetch(url,
        {
          method: "POST",
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify(data),
        });

      if (response.status == 200) {
        return response.json();
      } else {
        return null;
      }

    } catch (e) {
      return null;
    }
  }
}


class BeeStorage {
  async upload({ file, path } = {}) {

    const url = `${schem}://${address}:${storagePort}/upload`;
    const data = {
      apiKey: apiKey.split("-")[1],
      token: token,
      action: "upload",
      files: {
        path: path,
        data: Array.from(file)
      },
    };
    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data)
      });
      console.log(response.text());
      if (response.status === 200) {
        return true;
      } else {
        console.error('Error uploading file:', response.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error uploading file:', e);
      return null;
    }
  }
}


async function rsaEncrypt(publicKeyPem, plaintext) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKeyPem);
  return encrypt.encrypt(plaintext);
}

class BeeAuth {
  async signup(email, password) {
    if (address == null) {
      await new Bee(apiKey).initializeApp();
    }
    const url = `${await _address(authPort)}`;
    try {
      const connect = await fetch(url);
      const publicKeyPem = await connect.text();
      const encryptedEmail = await rsaEncrypt(publicKeyPem, email);
      const encryptedPassword = await rsaEncrypt(publicKeyPem, password);
      const request = await fetch(`${url}/signup`, {
        method: 'POST',
        body: JSON.stringify({ ctoken: encryptedEmail, key: encryptedPassword })
      });
      if (request.status === 200) {
        const r = await request.json();
        i.setItem("sId", r.sessionId);
        sid = r.sessionId;
        return { body: r, statusCode: request.status };
      } else {
        return { body: await request.text(), statusCode: request.status };
      }
    } catch (e) {
      console.error('Error signing up:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async requestOTP() {
    if (address == null) {
      await new Bee(apiKey).initializeApp();
    }
    const url = `${await _address(authPort)}`;
    try {
      const request = await fetch(`${url}/requestOTP`, {
        method: 'POST',
        body: JSON.stringify({ uid: uid, token: token })
      });
      if (request.status === 200) {
        return true;
      } else {
        console.error('Error requesting OTP:', request.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error requesting OTP:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async requestResetLink(email) {
    if (address == null) {
      await new Bee(apiKey).initializeApp();
    }
    const url = `${await _address(authPort)}`;
    try {
      const connect = await fetch(url);
      const publicKeyPem = await connect.text();
      const request = await fetch(`${url}/reqResetLink`, {
        method: 'POST',
        body: JSON.stringify({ email: await rsaEncrypt(publicKeyPem, email) })
      });
      if (request.status === 200) {
        return true;
      } else {
        console.error('Error requesting reset link:', request.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error requesting reset link:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async verifyOTP(otp) {
    if (address == null) {
      await new Bee(apiKey).initializeApp();
    }
    const url = `${await _address(authPort)}`;
    try {
      const request = await fetch(`${url}/verifyOTP`, {
        method: 'POST',
        body: JSON.stringify({ uid: uid, otp: otp, token: token })
      });
      if (request.status === 200) {
        return true;
      } else {
        console.error('Error verifying OTP:', request.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error verifying OTP:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async otpState() {
    if (address == null) {
      await new Bee(apiKey).initializeApp();
    }
    const url = `${await _address(authPort)}`;
    try {
      const request = await fetch(`${url}/otpState`, {
        method: 'POST',
        body: JSON.stringify({ uid: uid, token: token })
      });
      if (request.status === 200) {
        return request.text();
      } else {
        console.error('Error getting OTP state:', request.statusText);
        return false;
      }
    } catch (e) {
      console.error('Error getting OTP state:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }

  async login(email, password) {
    if (address == null) {
      await new Bee(apiKey).initializeApp();
    }
    const url = `${await _address(authPort)}`;
    try {
      const connect = await fetch(url);
      const publicKeyPem = await connect.text();
      const encryptedEmail = await rsaEncrypt(publicKeyPem, email);
      const encryptedPassword = await rsaEncrypt(publicKeyPem, password);
      const request = await fetch(`${url}/login`, {
        method: 'POST',
        body: JSON.stringify({ token: encryptedEmail, key: encryptedPassword })
      });
      if (request.status === 200) {
        const r = await request.json();
        i.setItem("sId", r.sessionId);
        return { body: r, statusCode: request.status };
      } else {
        return { body: await request.text(), statusCode: request.status };
      }
    } catch (e) {
      console.error('Error logging in:', e);
      return { body: "Failed to connect", statusCode: 404 };
    }
  }
}
