// The AnalystDashboard now uses the LenderDashboard component
// since analysts are essentially lenders in the Caelo system
import LenderDashboard from './LenderDashboard';

const AnalystDashboard = () => {
  return <LenderDashboard />;
};

export default AnalystDashboard;