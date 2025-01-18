import { observer } from "mobx-react-lite";
import requestStore from "../stores/requestStore";

const Metrics = observer(() => {
  const { openRequestsCount, urgentRequestsCount, averageResolutionTime } = requestStore;
  
  return (
    <div className="metrics">
      <div className="metric">
        <h2>{openRequestsCount}</h2>
        <p>Open Requests</p>
      </div>
      <div className="metric">
        <h2>{urgentRequestsCount}</h2>
        <p>Urgent Requests</p>
      </div>
      <div className="metric">
        <h2>{Math.max(Math.round(averageResolutionTime / (1000 * 60 * 60 * 24)), 0)}</h2>
        <p>Average time (days) to resolve</p>
      </div>
    </div>
  );
});

export default Metrics;
