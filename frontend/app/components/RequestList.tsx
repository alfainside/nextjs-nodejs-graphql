import { observer } from "mobx-react-lite";
import requestStore from "../stores/requestStore";
import { fDateTime } from "../lib/utils";

const RequestList = observer(() => {
  const { requests, resolveRequest } = requestStore;

  return (
    <div className="request-list">
      <h2>Maintenance Requests</h2>
      {requests.length === 0 ? (
        <p>No requests available.</p>
      ) : (
        requests.map((request) => (
          <div key={request.id} className={`request ${request.status.toLowerCase()}`}>
            <div>
              <h3>{request.title}</h3>
              <p className={`urgency ${request.urgency.toLowerCase().replace(" ", "-")}`}>
              {
                request.urgency === "High" ? request.urgency + " ⚡" :
                request.urgency === "Non Urgent" ? request.urgency + " 😊" :
                request.urgency === "Urgent" ? request.urgency + " ⚡" :
                request.urgency === "Emergency" ? request.urgency + " 🔥" :
                request.urgency === "Low" ? request.urgency + " 😊" :
                request.urgency === "Less Urgent" ? request.urgency + "🔨" : request.urgency
              }
              </p>
            </div>
            <div className="actions">
              <span>{fDateTime(new Date(request.createdAt))}</span>
              {request.status !== "Resolved" ? (
                <button
                  className="resolve-btn"
                  onClick={() => resolveRequest(request.id)}
                >
                  Mark as Resolved
                </button>
              ) : (
                <button className="resolved-btn" disabled>
                  Resolved
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
});

export default RequestList;
