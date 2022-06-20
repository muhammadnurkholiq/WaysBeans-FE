// react
import { Card } from "react-bootstrap";
// image
import sendMessageIcon from "../../assets/images/sendMessage-icon.png";
import imageAdmin from "../../assets/images/favicon.png";
import Profile from "../../assets/images/profile.jpg";
import StatusOnline from "../../assets/images/status-online.png";
import StatusOffline from "../../assets/images/status-offline.png";

export default function Message({ contact, user, messages, sendMessage }) {
  return (
    <>
      {contact ? (
        <>
          {/* header */}
          <div className="messageHeader">
            {/* image side */}
            <div className="imgSide">
              {contact.image === null ? (
                <img src={imageAdmin} alt={contact.name} />
              ) : (
                <img src={contact.image} alt={contact.name} />
              )}
            </div>
            {/* info side */}
            <div className="infoSide">
              <h1>{contact.name}</h1>
              <div className="statusSide">
                <div className="status">
                  <img src={StatusOnline} alt="status" />
                </div>
                <div className="type">
                  <h1>Online</h1>
                </div>
              </div>
            </div>
          </div>
          {/* message */}
          <div className="messageField">
            <div className="messageList">
              {messages.map((item) => (
                <>
                  {item.idSender === user.id ? (
                    <>
                      {/* send message */}
                      <div className="send" key={item.id}>
                        <Card>{item.message}</Card>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* receive message */}
                      <div className="receive" key={item.id}>
                        <Card>{item.message}</Card>
                      </div>
                    </>
                  )}
                </>
              ))}
            </div>
            {/* input */}
            <form onSubmit={sendMessage} className="messageInput">
              <input
                name="message"
                placeholder="Enter a message"
                autoComplete="off"
              />
              <button type="submit">
                <img src={sendMessageIcon} alt="send message" />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="noMessage">
          <h1>No Message</h1>
        </div>
      )}
    </>
  );
}
