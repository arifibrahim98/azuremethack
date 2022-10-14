import React, { useEffect, useState } from "react";
import { launchAsync } from "@microsoft/immersive-reader-sdk"
require('dotenv').config() // load in env variables

function App() {

  const [token, setToken] = useState('');

  const styles = {
    immersive_reader_button: {
      marginTop: 25,
      float: 'right'
    }
  };

  const getCredentials = async () => {

    // Verify environment variables values
    if( !process.env.REACT_APP_CLIENT_ID ){
      console.log("ClientId is null! Did you add that info to .env file? See ReadMe.md.")
    }
    if( !process.env.REACT_APP_CLIENT_SECRET ){
      console.log("Client Secret is null! Did you add that info to .env file? See ReadMe.md.")
    }
    if( !process.env.REACT_APP_TENANT_ID ){
      console.log("TenantId is null! Did you add that info to .env file? See ReadMe.md.")
    }
    if( !process.env.REACT_APP_SUBDOMAIN ){
      console.log("Subdomain is null! Did you add that info to .env file? See ReadMe.md.")
    }

    // Form details to be passed to fetch
    const details = {
      grant_type: 'client_credentials',
      client_id: process.env.REACT_APP_CLIENT_ID,
      client_secret: process.env.REACT_APP_CLIENT_SECRET,
      resource: 'https://cognitiveservices.azure.com/'
    };

    // Build up the form data -> it needs to be converted to a form type
    let formBodyArr = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBodyArr.push(encodedKey + "=" + encodedValue);
    }

    const formBodyStr = formBodyArr.join("&"); // This is what we can pass to the post request

    try {

      const response = await fetch(`http://localhost:3000/${process.env.REACT_APP_TENANT_ID}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBodyStr,
      });
      const json = await response.json();
      const { access_token } = json;
      setToken(access_token)

    }
    catch (err) {
      console.log({ err })
      alert('There was a problem fetching your credentials, please check the console and make sure your environment variables are prefixed with REACT_APP_');
    }
  }

  const launchReader = async () => {

    const data = {
      title: document.getElementById('ir-title').innerText,
      chunks: [{
        content: document.getElementById('ir-content').innerHTML,
        mimeType: "text/html"
      }]
    };

    // Learn more about options https://docs.microsoft.com/azure/cognitive-services/immersive-reader/reference#options
    const options = {
      "uiZIndex": 2000,
      "cookiePolicy": 1
    };

    try {
      await launchAsync("c64b16bdb3a14625b19305d5324e40cc", "https://methack.cognitiveservices.azure.com/", data, options)
    }
    catch (error) {
      console.log(error);
      alert("Error in launching the Immersive Reader. Check the console.");
    }
  }

  // We use a react hook to fetch when the component is rendered (similar to componentDidMount)
  useEffect(() => {
    getCredentials();
  }, [])

  return (
    <div>
      <div id="iframeContainer"></div>
      <div className="container">
        <button className="immersive-reader-button" data-button-style="iconAndText" data-locale="en" style={styles.immersive_reader_button} onClick={launchReader}>Launch Reader</button>
        <h1 id="ir-title">Topic 1: OUR SOLAR SYSTEM</h1>
        <div id="ir-content" lang="en-us">
          <div>
            <p>
            The Solar System[c] is the gravitationally bound system of the Sun and the objects that orbit it. It formed 4.6 billion years ago from the gravitational collapse of a giant interstellar molecular cloud. The vast majority (99.86%) of the system's mass is in the Sun, with most of the remaining mass contained in the planet Jupiter. The four inner system planets—Mercury, Venus, Earth and Mars—are terrestrial planets, being composed primarily of rock and metal. The four giant planets of the outer system are substantially larger and more massive than the terrestrials. The two largest, Jupiter and Saturn, are gas giants, being composed mainly of hydrogen and helium; the next two, Uranus and Neptune, are ice giants, being composed mostly of volatile substances with relatively high melting points compared with hydrogen and helium, such as water, ammonia, and methane. All eight planets have nearly circular orbits that lie near the plane of Earth's orbit, called the ecliptic.

There are an unknown number of smaller dwarf planets and innumerable small Solar System bodies orbiting the Sun.[d] Six of the major planets, the six largest possible dwarf planets, and many of the smaller bodies are orbited by natural satellites, commonly called "moons" after Earth's Moon. Two natural satellites, Jupiter's moon Ganymede and Saturn's moon Titan, are larger but not more massive than Mercury, the smallest terrestrial planet, and Jupiter's moon Callisto is nearly as large. Each of the giant planets and some smaller bodies are encircled by planetary rings of ice, dust and moonlets. The asteroid belt, which lies between the orbits of Mars and Jupiter, contains objects composed of rock, metal and ice. Beyond Neptune's orbit lie the Kuiper belt and scattered disc, which are populations of objects composed mostly of ice and rock.
            </p>
            <ul>
            <h3>Takeaway notes</h3>
              <li>
                Biggest planet is Jupiter
                </li>
              <li>
                Third planet from the sun is Earth
                </li>
              <li>
                Smallest planet is Mercury
                </li>
              <li>
                Neptune takes 165 Earth years to orbit the sun
                </li>
              
            </ul>
          </div>
          <h3>
            Other languages.
        </h3>
          <p lang="es-es">
            El Lector inmersivo está disponible en varios idiomas.
        </p>
          <p lang="zh-cn">
            沉浸式阅读器支持许多语言
        </p>
          <p lang="de-de">
            Der plastische Reader ist in vielen Sprachen verfügbar.
        </p>
          <p lang="ar-eg" dir="rtl" style={{ textAlign: 'right' }}>
            يتوفر \"القارئ الشامل\" في العديد من اللغات.
        </p>
        </div>
      </div>
    </div>
  );
}

export default App;