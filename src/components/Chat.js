import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [welcome, setWelcome] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, isLoading] = useState(false);
  const [loadingWelcome, isLoadingWelcome] = useState(false);
  const { state } = useLocation();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (event) => {
    setPrompt(event.target.value);
  };
  useEffect(() => {
    async function fetchData() {
      try{
      console.log("welcome--->", state);
      setWelcome(state.content);
      isLoadingWelcome(true);
      const { data } = await axios.post(
        "http://localhost:7000/api/chat",
        {
          message: [
            {
              role: "user",
              content: `list down some questions regarding this text: ${state.content}`,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      isLoadingWelcome(false);
      console.log("Questions-->", data.response.content);
      setQuestions( data.response.content.split('\n'));

      setMessages([
        ...state,
        {
          role: "user",
          content: "list down some questions regarding this text",
        },
        data.response.content,
      ]);


    }catch(e) {
      isLoading(false)
      setErrorMessage(e.message);
      console.error(e);
    }
    }
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleFormSubmit = async (event) => {
    isLoading(true);
    event.preventDefault();
    if (prompt.trim().length === 0) {
      alert("please fill the input before submitting");
      return;
    }

    let messagesArr = [...messages, { role: "user", content: prompt }];

    try {
      const { data } = await axios.post(
        "http://localhost:7000/api/chat",
        { message: messagesArr },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      isLoading(false);
      setMessages([
        ...messages,
        { role: "user:", content: prompt },
        { role: "assistant:", content: data.response.content },
      ]);
      setMessageData([
        ...messageData,
        { role: "user:", content: prompt },
        { role: "assistant:", content: data.response.content },
      ]);
    } catch (error) {
      isLoading(false)
      console.error(error);
    }
  };
  return (
    <div style={{display: 'flex', flexDirection:'column', alignItems: "center", justifyContent:'center',width: '80%', margin:'auto' }}>
      <div style={{border:'3px solid #404040', backgroundColor: '#404040', padding:'2rem', borderRadius:'1rem', lineHeight: '1.75rem', letterSpacing:'0.2px' }}>{welcome}</div>
      <h1>you can ask for example</h1>
      <div style={{display: "flex", flexDirection:"column", alignItems: 'start', }}>
      {!loadingWelcome ? (
        questions.map((item,key) => <div style={{paddingTop: "0.5rem"}}key={key}>➤{item}</div>)
      ) : (
        <h3>Thinking...</h3>
      )}
      </div>
      <ul className="feed">
        {messageData.map((item, key) => (
          <li key={key}>
            <p className="role">{item.role}</p>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
      {!loading ? (
        <form onSubmit={handleFormSubmit} style={{textAlign:'center'}}>
          <textarea
            placeholder="Send a message"
            onChange={handleChange}
            id="input"
            style={{backgroundColor: 'white', border: "4px solid #dcdee5", borderRadius: '1rem', width: "75rem", height:'5rem', padding:'1rem'}}
          />
          <button style={{margin: '20px 0', backgroundColor:'#5932ef', border:'1px solid #5133c6', width: '6.5rem', height: '2.5rem', color:'white', borderRadius:'0.5rem'}} type="submit">Ask Assistant</button>
        </form>
      ) : (
        <h3>Thinking...</h3>
      )}
    </div>
  );
}

export default Chat;
