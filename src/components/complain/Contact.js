// image
import imageAdmin from "../../assets/images/favicon.png";

export default function Contact({ dataContact, clickContact, contact }) {
  return (
    <>
      {dataContact?.length > 0 ? (
        <>
          {dataContact.map((item) => (
            <div
              key={item.id}
              className="contact"
              onClick={() => {
                clickContact(item);
              }}
            >
              {/* image side */}
              <div className="imgSide">
                {item.image === null ? (
                  <img src={imageAdmin} alt={item.name} />
                ) : (
                  <img src={item.image} alt={item.name} />
                )}
              </div>
              {/* info side */}
              <div className="infoSide">
                <h1>{item.name}</h1>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="noContact">
            <h1>No contact</h1>
          </div>
        </>
      )}
    </>
  );
}
